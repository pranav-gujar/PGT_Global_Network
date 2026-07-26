/**
 * TypeScript Interfaces for PGT Mail Service
 */

export interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: any;
  old_record?: any;
  schema: string;
}

export interface DirectPayload {
  emailType: string;
  recipient: string;
  data: any;
}

export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  emailType: string;
  relatedId?: string | null;
}

export interface TemplateResult {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  relatedId?: string | null;
}

export interface EmailTemplate {
  generate(payload: any): TemplateResult | TemplateResult[];
}
