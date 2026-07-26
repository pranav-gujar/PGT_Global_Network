import { supabaseClient } from "./supabase.ts";
import { EmailOptions } from "../types.ts";

const RESEND_API_URL = "https://api.resend.com/emails";

export class MailService {
  private static resendApiKey = Deno.env.get("RESEND_API_KEY") || "";

  /**
   * Dispatches an email using Resend and records it in the database tracking log.
   */
  public static async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string; skipped?: boolean }> {
    const { to, from, subject, html, emailType, relatedId } = options;

    // 1. Idempotency Check (only run if relatedId is a valid UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isRelatedIdUuid = typeof relatedId === "string" && uuidRegex.test(relatedId);

    if (isRelatedIdUuid) {
      try {
        console.log(`[MailService] Checking idempotency for type '${emailType}' with related ID '${relatedId}'...`);
        const { data, error } = await supabaseClient
          .from("email_logs")
          .select("id, provider_message_id")
          .eq("related_id", relatedId)
          .eq("email_type", emailType)
          .eq("status", "Sent")
          .maybeSingle();

        if (error) {
          console.warn(`[MailService] Idempotency check database error: ${JSON.stringify(error)}`);
        } else if (data) {
          console.log(`[MailService] Idempotency Match: '${emailType}' already successfully sent for related ID '${relatedId}'. Skipping dispatch.`);
          return { success: true, messageId: data.provider_message_id || undefined, skipped: true };
        }
      } catch (checkErr) {
        console.error(`[MailService] Idempotency check exception:`, checkErr);
      }
    }

    if (!this.resendApiKey) {
      const errMsg = "Missing RESEND_API_KEY environment variable.";
      console.error(errMsg);
      await this.logEmail({
        emailType,
        recipient: Array.isArray(to) ? to.join(", ") : to,
        status: "Failed",
        error_message: errMsg,
        relatedId,
      });
      return { success: false, error: errMsg };
    }

    const recipientString = Array.isArray(to) ? to.join(", ") : to;
    // Default PGT sender if none is specified
    const sender = from || "PGT Global Network Team <office@pgtglobalnetwork.com>";

    try {
      console.log(`[MailService] Dispatching '${emailType}' email to: ${recipientString}`);
      
      const res = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.resendApiKey}`,
        },
        body: JSON.stringify({
          from: sender,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const responseText = await res.text();
        console.error(`[MailService] Resend API failed: ${responseText}`);
        await this.logEmail({
          emailType,
          recipient: recipientString,
          status: "Failed",
          error_message: `Resend API Error: ${responseText}`,
          relatedId,
        });
        return { success: false, error: responseText };
      }

      const data = await res.json();
      const messageId = data.id || null;
      console.log(`[MailService] Email successfully sent. Message ID: ${messageId}`);

      await this.logEmail({
        emailType,
        recipient: recipientString,
        status: "Sent",
        provider_message_id: messageId,
        relatedId,
      });

      return { success: true, messageId };
    } catch (err: any) {
      const errMsg = err.message || String(err);
      console.error(`[MailService] Exception during email dispatch: ${errMsg}`);
      await this.logEmail({
        emailType,
        recipient: recipientString,
        status: "Failed",
        error_message: `Exception: ${errMsg}`,
        relatedId,
      });
      return { success: false, error: errMsg };
    }
  }

  /**
   * Helper to write tracking record to email_logs
   */
  private static async logEmail(log: {
    emailType: string;
    recipient: string;
    status: "Sent" | "Failed";
    provider_message_id?: string | null;
    error_message?: string | null;
    relatedId?: string | null;
  }) {
    try {
      const { error } = await supabaseClient.from("email_logs").insert({
        email_type: log.emailType,
        recipient: log.recipient,
        status: log.status,
        provider_message_id: log.provider_message_id || null,
        error_message: log.error_message || null,
        related_id: log.relatedId || null,
      });

      if (error) {
        console.error(`[MailService] Failed to insert email log into DB: ${JSON.stringify(error)}`);
      } else {
        console.log(`[MailService] Email log successfully inserted for: ${log.recipient}`);
      }
    } catch (dbErr) {
      console.error("[MailService] DB logging exception:", dbErr);
    }
  }
}
