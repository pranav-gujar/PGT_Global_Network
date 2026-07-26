import { EmailTemplate, TemplateResult } from "../types.ts";
import { getEmailWrapper, PGT_LOGO_URL } from "./base.ts";

const parseLinks = (linksStr: string): string => {
  if (!linksStr) return "";
  const parts = linksStr.split(/[,\s;\n]+/).map(p => p.trim()).filter(Boolean);
  if (parts.length === 0) return "";
  
  return parts.map(url => {
    let href = url;
    if (!/^https?:\/\//i.test(url)) {
      href = `https://${url}`;
    }
    return `<div style="margin-top: 4px;"><a href="${href}" target="_blank" style="color: #4f46e5; text-decoration: underline; word-break: break-all;">${url}</a></div>`;
  }).join("");
};

export class AdminNotificationTemplate implements EmailTemplate {
  public generate(record: any): TemplateResult {
    const details = record.applicant_details || {};
    const fullName = details.full_name || "Applicant";
    const email = details.email || "N/A";
    const phone = details.phone || "N/A";
    const organizationInstitution = details.organization_institution || details.college || "N/A";
    const currentRole = details.current_role || "N/A";
    const highestQualification = details.highest_qualification || details.year_qualification || "N/A";
    const cityState = details.city_state || "N/A";
    const whyJoin = details.why_join || "N/A";
    const skills = details.skills || "N/A";
    const previousExperience = details.previous_experience || "";
    const portfolioLinks = details.portfolio_links || "";
    const availability = details.availability || "N/A";
    const resumeUrl = record.resume_url || null;
    const positionTitle = record.position_title || "PGT Core Team Role";
    const applicationId = record.application_id || "PGT-Application";
    const relatedId = record.id || null;

    const recipient = Deno.env.get("ADMIN_EMAIL");
    if (!recipient) {
      throw new Error("Missing ADMIN_EMAIL environment variable for admin notification.");
    }

    const dateStr = new Date(record.created_at || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }) + " UTC";

    const portfolioLinksHtml = parseLinks(portfolioLinks);

    const html = `
    <div class="header" style="background: #0f172a;">
      <img src="${PGT_LOGO_URL}" alt="PGT Global Network" />
      <h1>New Core Team Application</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hello Admin,</p>
      <p>A new application has been submitted for the PGT Core Team role: <strong>${positionTitle}</strong>.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 24px 0;">
        <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Applicant Information</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px;">Application ID</td>
            <td style="padding: 6px 0; font-family: monospace; font-weight: bold; color: #4f46e5;">${applicationId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Full Name</td>
            <td style="padding: 6px 0; font-weight: 600;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Email Address</td>
            <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Phone Number</td>
            <td style="padding: 6px 0; color: #334155;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Org / Institution</td>
            <td style="padding: 6px 0; color: #334155;">${organizationInstitution}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Role / Occupation</td>
            <td style="padding: 6px 0; color: #334155;">${currentRole}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Highest Qualification</td>
            <td style="padding: 6px 0; color: #334155;">${highestQualification}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Location</td>
            <td style="padding: 6px 0; color: #334155;">${cityState}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Availability</td>
            <td style="padding: 6px 0; color: #334155;">${availability}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="margin-bottom: 8px; font-size: 13px; text-transform: uppercase; color: #64748b;">Why Join PGT?</h4>
        <p style="margin-top: 0; font-size: 14px; background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 10px 15px; border-radius: 0 8px 8px 0; color: #475569;">${whyJoin}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="margin-bottom: 8px; font-size: 13px; text-transform: uppercase; color: #64748b;">Skills & Experience</h4>
        <p style="margin-top: 0; font-size: 14px; color: #334155;"><strong>Skills:</strong> ${skills}</p>
        ${previousExperience ? `<p style="font-size: 14px; color: #334155;"><strong>Experience:</strong> ${previousExperience}</p>` : ""}
      </div>

      ${portfolioLinksHtml ? `
      <div style="margin-bottom: 24px;">
        <h4 style="margin-bottom: 8px; font-size: 13px; text-transform: uppercase; color: #64748b;">Links</h4>
        <div style="font-size: 14px;">${portfolioLinksHtml}</div>
      </div>
      ` : ""}

      <div style="margin-top: 30px; text-align: center;">
        ${resumeUrl ? `
          <a href="${resumeUrl}" target="_blank" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-weight: 600; text-decoration: none; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
            View Applicant Resume (PDF)
          </a>
        ` : '<span style="color: #ef4444; font-weight: bold;">No Resume Uploaded</span>'}
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from the PGT Global Network Recruitment System.</p>
    </div>
    `.trim();

    return {
      to: recipient,
      from: "PGT Recruitment Portal <office@pgtglobalnetwork.com>",
      subject: `New Core Team Application: ${positionTitle} - ${fullName}`,
      html: getEmailWrapper(html),
      relatedId,
    };
  }
}
