import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MailService } from "./services/mail.ts";
import { webhookHandlers, directHandlers } from "./templates/registry.ts";
import { WebhookPayload, DirectPayload, TemplateResult } from "./types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log(`[PGT Mail Service] Received request:`, JSON.stringify(payload));

    let emailResults: TemplateResult | TemplateResult[] | null = null;
    let resolvedEmailType = "unknown";

    // 1. Determine trigger type and resolve templates
    if (payload.table && payload.type) {
      // Database Webhook Trigger
      const webhookPayload = payload as WebhookPayload;
      const routeKey = `${webhookPayload.table}.${webhookPayload.type}`;
      resolvedEmailType = `webhook:${routeKey}`;

      console.log(`[PGT Mail Service] Routing database webhook trigger: ${routeKey}`);
      const handler = webhookHandlers[routeKey];
      if (!handler) {
        console.warn(`[PGT Mail Service] No registered handler for webhook trigger: ${routeKey}`);
        return new Response(JSON.stringify({ success: true, message: `No handler for ${routeKey}` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      emailResults = handler(webhookPayload);
    } else if (payload.emailType) {
      // Direct API Trigger
      const directPayload = payload as DirectPayload;
      resolvedEmailType = directPayload.emailType;

      console.log(`[PGT Mail Service] Routing direct email trigger: ${directPayload.emailType}`);
      const handler = directHandlers[directPayload.emailType];
      if (!handler) {
        throw new Error(`Invalid email type: '${directPayload.emailType}'. No registered handler found.`);
      }
      emailResults = handler(directPayload);
    } else {
      throw new Error("Invalid request payload. Must provide database webhook properties or a direct 'emailType'.");
    }

    if (!emailResults) {
      throw new Error(`Failed to generate emails for trigger: ${resolvedEmailType}`);
    }

    // Standardize to array
    const emailsToSend = Array.isArray(emailResults) ? emailResults : [emailResults];
    console.log(`[PGT Mail Service] Generated ${emailsToSend.length} email(s) to send.`);

    const dispatchPromises = emailsToSend.map(async (email) => {
      // Determine emailType for tracking logs based on email subject patterns or template registry
      const logEmailType = email.subject.startsWith("New Core Team Application")
        ? "recruitment_admin_notification"
        : email.subject.startsWith("Application Received")
        ? "recruitment_applicant_confirmation"
        : email.subject.startsWith("[Contact Form]")
        ? "contact_form_admin_notification"
        : email.subject.startsWith("Message Received")
        ? "contact_form_confirmation"
        : resolvedEmailType;

      return await MailService.send({
        to: email.to,
        from: email.from,
        subject: email.subject,
        html: email.html,
        emailType: logEmailType,
        relatedId: email.relatedId,
      });
    });

    const dispatchResults = await Promise.all(dispatchPromises);
    const failures = dispatchResults.filter((r) => !r.success);

    if (failures.length > 0) {
      console.error(`[PGT Mail Service] Failed to send ${failures.length} email(s).`);
      return new Response(
        JSON.stringify({
          success: false,
          sent: dispatchResults.length - failures.length,
          failed: failures.length,
          errors: failures.map((f) => f.error),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("[PGT Mail Service] All emails dispatched and logged successfully.");
    return new Response(
      JSON.stringify({
        success: true,
        sent: dispatchResults.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    const errMsg = error.message || error;
    console.error("[PGT Mail Service] Fatal error processing request:", errMsg);
    return new Response(JSON.stringify({ error: errMsg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
