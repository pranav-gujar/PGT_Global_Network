export interface AdminSession {
  username: string;
  displayName: string;
  role: 'Founder & CEO' | 'Founder & Managing Director' | 'Admin';
  token: string;
  loginTime: string;
  expiresAt: number; // Unix timestamp ms
}

export type AdminTab = 'overview' | 'contacts' | 'applications' | 'profiles' | 'articles' | 'email-studio' | 'logs';

export interface AdminCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface SystemMetric {
  title: string;
  count: number | string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  description: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  category: string;
  subject?: string | null;
  message: string;
  is_read?: boolean;
  admin_notes?: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin' | 'team_member' | 'volunteer' | string;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface JobApplication {
  id: string;
  application_id?: string;
  user_id?: string;
  position_title: string;
  position_type?: string;
  resume_url?: string | null;
  status: 'Submitted' | 'Reviewed' | 'Accepted' | 'Rejected' | 'pending' | string;
  applicant_details?: {
    full_name?: string;
    phone_number?: string;
    organization_institution?: string;
    current_role?: string;
    highest_qualification?: string;
    city_state?: string;
    why_join?: string;
    skills?: string;
    previous_experience?: string;
    portfolio_links?: string;
    availability?: string;
    resume_url?: string;
    applied_at?: string;
    [key: string]: any;
  };
  application_data?: any;
  created_at: string;
  updated_at?: string;
}

export interface DbArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  read_time: string;
  image: string;
  card_image?: string;
  tags: string[];
  published_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  headline: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  isCustom?: boolean;
}

export interface EmailStudioLog {
  id: string;
  recipient_email: string;
  recipient_name: string;
  cc?: string;
  bcc?: string;
  subject: string;
  headline?: string;
  body_paragraphs: string;
  cta_text?: string;
  cta_url?: string;
  template_used: string;
  sender_name: string;
  sender_role: string;
  company_name?: string;
  website_url?: string;
  footer_note?: string;
  rendered_html?: string;
  status: 'Delivered' | 'Sent' | 'Failed' | string;
  provider_message_id?: string;
  created_at: string;
}
