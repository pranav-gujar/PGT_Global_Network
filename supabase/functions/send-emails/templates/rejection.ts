import { EmailTemplate, TemplateResult } from "../types.ts";
import { getEmailWrapper, PGT_LOGO_URL } from "./base.ts";

export class RejectionTemplate implements EmailTemplate {
  public generate(data: any): TemplateResult {
    const fullName = data.fullName || "Applicant";
    const recipient = data.recipient;
    const positionTitle = data.positionTitle || "PGT Core Team Role";
    const relatedId = data.relatedId || null;

    if (!recipient) {
      throw new Error("Cannot generate Rejection Email: Recipient email is missing.");
    }

    const html = `
    <div class="header" style="background: #475569;">
      <img src="${PGT_LOGO_URL}" alt="PGT Global Network" />
      <h1>Application Update</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hello <strong>${fullName}</strong>,</p>
      <p>Thank you for your application for the <strong>${positionTitle}</strong> role and for taking the time to share your experience with the PGT Global Network team.</p>
      
      <p>We received an exceptionally high volume of applications from talented candidates this season. After careful consideration of all applications, we regret to inform you that we are not moving forward with your application at this time.</p>

      <p>Although we cannot offer you a core team role for this cycle, we were highly impressed by your qualifications and would love to stay in touch. We will retain your profile in our talent pool for future openings that match your skills.</p>

      <p>We wish you the very best in your academic and professional endeavors, and thank you once again for your interest in PGT Global Network.</p>
      
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
      subject: `Application Status Update - ${positionTitle}`,
      html: getEmailWrapper(html),
      relatedId,
    };
  }
}
