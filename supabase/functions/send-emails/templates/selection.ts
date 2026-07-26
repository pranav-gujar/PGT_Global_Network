import { EmailTemplate, TemplateResult } from "../types.ts";
import { getEmailWrapper, PGT_LOGO_URL } from "./base.ts";

export class SelectionTemplate implements EmailTemplate {
  public generate(data: any): TemplateResult {
    const fullName = data.fullName || "Applicant";
    const recipient = data.recipient;
    const positionTitle = data.positionTitle || "PGT Core Team Role";
    const onboardLink = data.onboardLink || "https://pgtglobalnetwork.com/onboarding";
    const relatedId = data.relatedId || null;

    if (!recipient) {
      throw new Error("Cannot generate Selection Email: Recipient email is missing.");
    }

    const html = `
    <div class="header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
      <img src="${PGT_LOGO_URL}" alt="PGT Global Network" />
      <h1>Congratulations!</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hello <strong>${fullName}</strong>,</p>
      <p>We are absolutely thrilled to inform you that you have been selected to join the <strong>PGT Core Team</strong> as a <strong>${positionTitle}</strong>!</p>
      
      <p>Our recruitment board was highly impressed by your application, interview responses, and passion for leadership. We are confident you will make an outstanding impact on our global student network.</p>

      <p><strong>Next Steps: Onboarding</strong></p>
      <p>To accept this offer and begin your onboarding journey, please click the secure link below to access your member onboarding portal:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${onboardLink}" target="_blank" style="background-color: #10b981; color: #ffffff; padding: 12px 28px; border-radius: 12px; font-weight: 600; text-decoration: none; display: inline-block; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">
          Accept Offer & Onboard
        </a>
      </div>

      <p>Once again, welcome to the team! We are excited to build the future of PGT Global Network together.</p>
      
      <p style="margin-bottom: 0;">Best regards,<br><strong>PGT Global Network Team</strong></p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PGT Global Network. All rights reserved.</p>
      <p style="margin-bottom: 0;"><a href="https://pgtglobalnetwork.com">pgtglobalnetwork.com</a> | <a href="mailto:office@pgtglobalnetwork.com">office@pgtglobalnetwork.com</a></p>
    </div>
    `.trim();

    return {
      to: recipient,
      from: "PGT Global Network Team <office@pgtglobalnetwork.com>",
      subject: `Offer of Selection - ${positionTitle} - PGT Global Network`,
      html: getEmailWrapper(html),
      relatedId,
    };
  }
}
