import { EmailTemplate, TemplateResult } from "../types.ts";
import { getEmailWrapper, PGT_LOGO_URL } from "./base.ts";

export class InterviewInvitationTemplate implements EmailTemplate {
  public generate(data: any): TemplateResult {
    const fullName = data.fullName || "Applicant";
    const recipient = data.recipient;
    const positionTitle = data.positionTitle || "PGT Core Team Role";
    const interviewTime = data.interviewTime || "To be scheduled";
    const interviewLink = data.interviewLink || "#";
    const relatedId = data.relatedId || null;

    if (!recipient) {
      throw new Error("Cannot generate Interview Invitation: Recipient email is missing.");
    }

    const html = `
    <div class="header">
      <img src="${PGT_LOGO_URL}" alt="PGT Global Network" />
      <h1>Interview Invitation</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hello <strong>${fullName}</strong>,</p>
      <p>Congratulations! We have reviewed your application for the position of <strong>${positionTitle}</strong> and would like to invite you for a virtual interview session.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 24px 0;">
        <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Interview Details</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px;">Position</td>
            <td style="padding: 6px 0; font-weight: 600;">${positionTitle}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Scheduled Time</td>
            <td style="padding: 6px 0; font-weight: 600; color: #4f46e5;">${interviewTime}</td>
          </tr>
        </table>
      </div>

      <p>Please use the secure link below to confirm or select a time for your interview slot:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${interviewLink}" target="_blank" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; border-radius: 12px; font-weight: 600; text-decoration: none; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
          Confirm Interview Slot
        </a>
      </div>

      <p>If you have any questions or require adjustments, please contact us directly by replying to this email.</p>
      
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
      subject: `Interview Invitation - ${positionTitle}`,
      html: getEmailWrapper(html),
      relatedId,
    };
  }
}
