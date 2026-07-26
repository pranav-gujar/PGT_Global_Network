import { EmailTemplate, TemplateResult } from "../types.ts";
import { getEmailWrapper, PGT_LOGO_URL } from "./base.ts";

export class ApplicationConfirmationTemplate implements EmailTemplate {
  public generate(record: any): TemplateResult {
    const details = record.applicant_details || {};
    const fullName = details.full_name || "Applicant";
    const recipient = details.email;
    const positionTitle = record.position_title || "PGT Core Team Role";
    const applicationId = record.application_id || "PGT-Application";
    const relatedId = record.id || null;

    const dateStr = new Date(record.created_at || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }) + " UTC";

    if (!recipient) {
      throw new Error("Cannot generate Application Confirmation: Applicant email is missing.");
    }

    const html = `
    <div class="header">
      <img src="${PGT_LOGO_URL}" alt="PGT Global Network" />
      <h1>Application Received</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hello <strong>${fullName}</strong>,</p>
      <p>Thank you for submitting your application to join the <strong>PGT Core Team</strong>. We are thrilled to see your interest in becoming part of our student leadership team.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 24px 0;">
        <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Application Summary</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px;">Application ID</td>
            <td style="padding: 6px 0; font-family: monospace; font-weight: bold; color: #4f46e5;">${applicationId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Position</td>
            <td style="padding: 6px 0; font-weight: 600;">${positionTitle}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Submitted On</td>
            <td style="padding: 6px 0; color: #334155;">${dateStr}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Status</td>
            <td style="padding: 6px 0;"><span style="background-color: #fef3c7; color: #d97706; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold;">Submitted</span></td>
          </tr>
        </table>
      </div>

      <p><strong>What happens next?</strong></p>
      <p>Our recruitment board will review your profile, skills, and resume. Should your qualifications align with our team's active goals, we will contact you directly via email to schedule a virtual interview session.</p>
      <p>You can track the progress of your submission at any time by visiting your <a href="https://pgtglobalnetwork.com/dashboard" style="color: #4f46e5; text-decoration: underline; font-weight: 600;">Member Dashboard</a>.</p>
      
      <p style="margin-bottom: 0;">Best regards,<br><strong>PGT Global Network Recruitment Team</strong></p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PGT Global Network. All rights reserved.</p>
      <p style="margin-bottom: 0;"><a href="https://pgtglobalnetwork.com">pgtglobalnetwork.com</a> | <a href="mailto:office@pgtglobalnetwork.com">office@pgtglobalnetwork.com</a></p>
    </div>
    `.trim();

    return {
      to: recipient,
      from: "PGT Global Network Team <office@pgtglobalnetwork.com>",
      subject: `Application Received - ${positionTitle} (${applicationId})`,
      html: getEmailWrapper(html),
      relatedId,
    };
  }
}
