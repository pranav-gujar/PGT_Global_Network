import { EmailTemplate, TemplateResult } from "../types.ts";
import { getEmailWrapper, PGT_LOGO_URL } from "./base.ts";

export class NewsletterTemplate implements EmailTemplate {
  public generate(data: any): TemplateResult {
    const recipient = data.recipient;
    const newsletterSubject = data.newsletterSubject || "PGT Global Network Newsletter";
    const newsletterBody = data.newsletterBody || "";
    const unsubscribeLink = data.unsubscribeLink || "https://pgtglobalnetwork.com/unsubscribe";

    if (!recipient) {
      throw new Error("Cannot generate Newsletter: Recipient email is missing.");
    }

    const html = `
    <div class="header">
      <img src="${PGT_LOGO_URL}" alt="PGT Global Network" />
      <h1>PGT Global Network</h1>
    </div>
    <div class="content">
      ${newsletterBody}
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      <p style="font-size: 11px; text-align: center; color: #94a3b8;">
        You are receiving this email because you subscribed to the PGT Global Network newsletter. 
        <br />
        If you wish to stop receiving these emails, you can <a href="${unsubscribeLink}" style="color: #6366f1; text-decoration: underline;">unsubscribe here</a>.
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} PGT Global Network. All rights reserved.</p>
    </div>
    `.trim();

    return {
      to: recipient,
      from: "PGT Global Network News <office@pgtglobalnetwork.com>",
      subject: newsletterSubject,
      html: getEmailWrapper(html),
    };
  }
}
