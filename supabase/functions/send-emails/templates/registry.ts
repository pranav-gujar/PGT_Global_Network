import { WebhookPayload, DirectPayload, TemplateResult } from "../types.ts";
import { ApplicationConfirmationTemplate } from "./application-confirmation.ts";
import { AdminNotificationTemplate } from "./admin-notification.ts";
import { InterviewInvitationTemplate } from "./interview-invitation.ts";
import { SelectionTemplate } from "./selection.ts";
import { RejectionTemplate } from "./rejection.ts";
import { ContactFormTemplate } from "./contact-form.ts";
import { NewsletterTemplate } from "./newsletter.ts";

export const webhookHandlers: Record<
  string,
  (payload: WebhookPayload) => TemplateResult | TemplateResult[]
> = {
  "applications.INSERT": (payload: WebhookPayload) => {
    const results: TemplateResult[] = [];
    
    // 1. Applicant Confirmation
    try {
      const applicantResult = new ApplicationConfirmationTemplate().generate(payload.record);
      results.push(applicantResult as TemplateResult);
    } catch (e: any) {
      console.warn(`[TemplateRegistry] Skipping applicant confirmation: ${e.message}`);
    }

    // 2. Admin Notification
    try {
      const adminResult = new AdminNotificationTemplate().generate(payload.record);
      results.push(adminResult as TemplateResult);
    } catch (e: any) {
      console.warn(`[TemplateRegistry] Skipping admin notification: ${e.message}`);
    }

    return results;
  },

  "contact_messages.INSERT": (payload: WebhookPayload) => {
    // Returns user confirmation and admin notification
    return new ContactFormTemplate().generate(payload.record);
  }
};

export const directHandlers: Record<
  string,
  (payload: DirectPayload) => TemplateResult | TemplateResult[]
> = {
  "recruitment_applicant_confirmation": (payload: DirectPayload) => {
    return new ApplicationConfirmationTemplate().generate(payload.data);
  },

  "recruitment_admin_notification": (payload: DirectPayload) => {
    return new AdminNotificationTemplate().generate(payload.data);
  },

  "interview_invitation": (payload: DirectPayload) => {
    return new InterviewInvitationTemplate().generate({
      recipient: payload.recipient,
      ...payload.data,
    });
  },

  "selection": (payload: DirectPayload) => {
    return new SelectionTemplate().generate({
      recipient: payload.recipient,
      ...payload.data,
    });
  },

  "rejection": (payload: DirectPayload) => {
    return new RejectionTemplate().generate({
      recipient: payload.recipient,
      ...payload.data,
    });
  },

  "contact_form": (payload: DirectPayload) => {
    return new ContactFormTemplate().generate(payload.data);
  },

  "newsletter": (payload: DirectPayload) => {
    return new NewsletterTemplate().generate({
      recipient: payload.recipient,
      ...payload.data,
    });
  },

  "executive_email_studio": (payload: DirectPayload) => {
    return {
      to: payload.recipient,
      from: payload.data?.from || "PGT Global Network Team <office@pgtglobalnetwork.com>",
      subject: payload.data?.subject || "PGT Global Network Executive Communication",
      html: payload.data?.html || "<p>PGT Global Network Executive Dispatch</p>",
      emailType: "executive_email_studio",
      relatedId: payload.data?.relatedId,
    };
  }
};
