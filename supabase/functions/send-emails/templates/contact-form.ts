import { EmailTemplate, TemplateResult } from "../types.ts";
import { getEmailWrapper, PGT_LOGO_URL } from "./base.ts";

export class ContactFormTemplate implements EmailTemplate {
  public generate(record: any): TemplateResult[] {
    const fullName = record.full_name || "User";
    const userEmail = record.email;
    const category = record.category || "General Inquiry";
    const customSubject = record.subject || "";
    const messageContent = record.message || "";
    const relatedId = record.id || null;

    const dateStr = new Date(record.created_at || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }) + " UTC";

    const results: TemplateResult[] = [];

    // Resolve subject lines as per requirements
    // For Visitor Email:
    // Subject: We've Received Your Message | PGT Global Network
    // For Admin Email:
    // Subject: New Contact Form Submission
    const visitorSubject = "We've Received Your Message | PGT Global Network";
    const adminSubject = "New Contact Form Submission";

    // 1. User Confirmation Email
    if (userEmail) {
      let inquiryDetailsHtml = `
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px;">Category</td>
            <td style="padding: 6px 0; font-weight: 600;">${category}</td>
          </tr>
      `;

      if (category === "Other" && customSubject) {
        inquiryDetailsHtml += `
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Custom Subject</td>
            <td style="padding: 6px 0; font-weight: 600; color: #4f46e5;">${customSubject}</td>
          </tr>
        `;
      }

      inquiryDetailsHtml += `
        </table>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
        <p style="margin: 0; font-size: 14px; color: #475569; font-style: italic;">"${messageContent}"</p>
      `;

      const userHtml = `
      <div class="header">
        <img src="${PGT_LOGO_URL}" alt="PGT Global Network" />
        <h1>We Have Received Your Message</h1>
      </div>
      <div class="content">
        <p style="font-size: 16px; margin-top: 0;">Hello <strong>${fullName}</strong>,</p>
        <p>Thank you for reaching out to the PGT Global Network team. We have successfully received your message and will review it shortly. Someone from our team will respond to you as soon as possible.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 24px 0;">
          <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Inquiry Details</h3>
          ${inquiryDetailsHtml}
        </div>

        <p>Our team aims to respond to all inquiries within 24 to 48 business hours. If your request is urgent, please feel free to reach out to us at <a href="mailto:office@pgtglobalnetwork.com" style="color: #4f46e5; text-decoration: none; font-weight: 600;">office@pgtglobalnetwork.com</a>.</p>
        
        <p style="margin-bottom: 0;">Best regards,<br><strong>PGT Global Network Team</strong></p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} PGT Global Network. All rights reserved.</p>
        <p style="margin-bottom: 0;"><a href="https://pgtglobalnetwork.com">pgtglobalnetwork.com</a> | <a href="mailto:office@pgtglobalnetwork.com">office@pgtglobalnetwork.com</a></p>
      </div>
      `.trim();

      results.push({
        to: userEmail,
        from: "PGT Global Network Team <office@pgtglobalnetwork.com>",
        subject: visitorSubject,
        html: getEmailWrapper(userHtml),
        relatedId,
      });
    }

    // 2. Admin Alert Email
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "office@pgtglobalnetwork.com";
    let adminInquiryDetailsHtml = `
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 140px;">Full Name</td>
          <td style="padding: 6px 0; font-weight: 600;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Email Address</td>
          <td style="padding: 6px 0; font-weight: 600;"><a href="mailto:${userEmail}" style="color: #4f46e5; text-decoration: none;">${userEmail || "N/A"}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Category</td>
          <td style="padding: 6px 0; font-weight: 600;">${category}</td>
        </tr>
    `;

    if (category === "Other" && customSubject) {
      adminInquiryDetailsHtml += `
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Custom Subject</td>
          <td style="padding: 6px 0; font-weight: 600; color: #4f46e5;">${customSubject}</td>
        </tr>
      `;
    }

    adminInquiryDetailsHtml += `
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Submitted Time</td>
          <td style="padding: 6px 0; color: #334155;">${dateStr}</td>
        </tr>
      </table>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
      <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">${messageContent}</p>
    `;

    const adminHtml = `
    <div class="header" style="background: #0f172a;">
      <img src="${PGT_LOGO_URL}" alt="PGT Global Network" />
      <h1>New Contact Inquiry</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hello Admin,</p>
      <p>A new inquiry has been submitted via the contact form on the PGT Global Network website.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 24px 0;">
        <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Inquiry Details</h3>
        ${adminInquiryDetailsHtml}
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from the PGT Global Network Platform.</p>
    </div>
    `.trim();

    results.push({
      to: adminEmail,
      from: "PGT Web Portal <office@pgtglobalnetwork.com>",
      subject: adminSubject,
      html: getEmailWrapper(adminHtml),
      relatedId,
    });

    return results;
  }
}
