import React, { useState, useEffect, useMemo } from 'react';
import {
  Send,
  Sparkles,
  Laptop,
  Smartphone,
  Check,
  Copy,
  Trash2,
  RefreshCw,
  RotateCcw,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Search,
  Bookmark,
  Layers,
  X,
  Mail,
  ShieldCheck,
  FileText,
  UserCheck,
  Settings,
  Key,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Paperclip,
  UploadCloud,
  File,
  Download,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import {
  EmailTemplate,
  EmailStudioLog,
  EmailAttachmentItem,
} from '../types';
import {
  fetchEmailLogs,
  recordEmailLog,
  deleteEmailLog,
} from '../services/adminDataService';

// Format bytes into readable string (e.g. 245 KB, 1.2 MB)
export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Categorize attachment for icon rendering
export const getAttachmentFileCategory = (filename: string, mimeType: string) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext) || mimeType.startsWith('image/')) {
    return 'image';
  }
  if (ext === 'pdf' || mimeType.includes('pdf')) {
    return 'pdf';
  }
  if (['doc', 'docx', 'rtf', 'txt', 'odt'].includes(ext) || mimeType.includes('word') || mimeType.includes('document')) {
    return 'doc';
  }
  if (['xls', 'xlsx', 'csv'].includes(ext) || mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
    return 'sheet';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || mimeType.includes('zip') || mimeType.includes('archive')) {
    return 'archive';
  }
  return 'file';
};

interface AdminEmailStudioProps {
  initialRecipient?: {
    email: string;
    name?: string;
  } | null;
  onBackToOverview?: () => void;
}

// 6 Prebuilt Corporate Templates (All clean, no auto-fill until explicitly clicked)
const PREBUILT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'blank',
    name: 'Blank / Custom Email',
    description: 'Write any custom email from scratch with clean empty fields',
    subject: '',
    headline: '',
    body: '',
    ctaText: '',
    ctaUrl: '',
    isCustom: false,
  },
  {
    id: 'inquiry-followup',
    name: 'Client Inquiry Follow-up',
    description: 'Personalized corporate response to a website contact form inquiry',
    subject: 'Following up on your inquiry — PGT Global Network',
    headline: 'Thank you for reaching out to PGT Global Network',
    body: `Thank you for contacting PGT Global Network regarding your inquiry.\n\nWe have reviewed your submission and would like to connect to discuss how our initiatives, resources, and leadership team can assist you with your objectives.\n\nPlease let us know your preferred availability for a brief introductory conversation, or feel free to reply directly to this email at your convenience.`,
    ctaText: 'Schedule Introduction Call',
    ctaUrl: 'https://pgtglobalnetwork.com/contact',
    isCustom: false,
  },
  {
    id: 'application-received',
    name: 'Career Application Received & Next Steps',
    description: 'Acknowledgment and next stages for submitted team and career applications',
    subject: 'Your Application to PGT Global Network — Review Update',
    headline: 'Application Dossier Received & Under Review',
    body: `Thank you for your interest in joining PGT Global Network. We have successfully received your candidate dossier and credentials.\n\nOur leadership and talent evaluation committee is currently reviewing candidate submissions across our active initiatives and upcoming organizational projects.\n\nIf your experience and aspirations align with our upcoming mandates, our executive office will reach out directly to schedule a preliminary discussion.`,
    ctaText: 'Explore PGT Initiatives',
    ctaUrl: 'https://pgtglobalnetwork.com/careers',
    isCustom: false,
  },
  {
    id: 'strategy-consultation',
    name: 'Strategy Consultation Invite',
    description: 'Invitation for enterprise architecture discovery and technical consultation',
    subject: 'Strategic Consultation & Discovery Session — PGT Global Network',
    headline: 'Invitation to Architecture & Strategy Discovery',
    body: `Thank you for connecting with the executive team at PGT Global Network.\n\nWe would like to invite you to an exclusive technical strategy session to explore potential roadmaps, organizational alignment, and scalable delivery models.\n\nPlease select your preferred briefing window using the calendar link below.`,
    ctaText: 'Reserve Discovery Window',
    ctaUrl: 'https://pgtglobalnetwork.com/contact',
    isCustom: false,
  },
  {
    id: 'partner-network-welcome',
    name: 'Partner Network Welcome',
    description: 'Welcome letter and onboarding briefing for accepted referral partners',
    subject: 'Welcome to the PGT Global Partner Ecosystem',
    headline: 'Partner Onboarding & Network Briefing',
    body: `On behalf of the executive leadership, welcome to the PGT Global Network partner ecosystem.\n\nYour organization is now credentialed to collaborate on strategic ventures, ecosystem deployments, and cross-border innovation projects.\n\nOur partner enablement team will share your onboarding documentation shortly.`,
    ctaText: 'Access Partner Portal',
    ctaUrl: 'https://pgtglobalnetwork.com/programs',
    isCustom: false,
  },
  {
    id: 'corporate-letterhead',
    name: 'Corporate Letterhead (Custom)',
    description: 'Clean corporate letterhead format for custom announcements or updates',
    subject: 'Executive Notice & Strategic Update — PGT Global Network',
    headline: 'Executive Briefing & Strategic Update',
    body: `Please accept this formal communication issued by the Executive Office of PGT Global Network.\n\nThis transmission contains verified records, organizational notifications, or administrative updates authorized by our leadership team.\n\nShould you have any inquiries or require certified verification of this communication, please contact our executive desk directly.`,
    ctaText: 'Visit Executive Hub',
    ctaUrl: 'https://pgtglobalnetwork.com',
    isCustom: false,
  },
];

const CUSTOM_TEMPLATES_STORAGE_KEY = 'pgt_custom_email_templates_v1';

export const AdminEmailStudio: React.FC<AdminEmailStudioProps> = ({
  initialRecipient,
  onBackToOverview,
}) => {
  // Step 1: Mode & Recipient State (All strictly empty by default)
  const [recipientMode, setRecipientMode] = useState<'single' | 'batch'>('single');
  const [recipientEmail, setRecipientEmail] = useState<string>(initialRecipient?.email || '');
  const [recipientName, setRecipientName] = useState<string>(initialRecipient?.name || '');
  const [showCC, setShowCC] = useState<boolean>(false);
  const [ccValue, setCcValue] = useState<string>('');
  const [showBCC, setShowBCC] = useState<boolean>(false);
  const [bccValue, setBccValue] = useState<string>('');
  const [batchRawInput, setBatchRawInput] = useState<string>(''); // Pure placeholder, empty by default

  // If initialRecipient changes dynamically, populate Single Recipient
  useEffect(() => {
    if (initialRecipient?.email) {
      setRecipientMode('single');
      setRecipientEmail(initialRecipient.email);
      if (initialRecipient.name) {
        setRecipientName(initialRecipient.name);
      }
    }
  }, [initialRecipient]);

  // Step 2: Templates State
  const [customTemplates, setCustomTemplates] = useState<EmailTemplate[]>(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_TEMPLATES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('blank');
  const [isSavingTemplateModalOpen, setIsSavingTemplateModalOpen] = useState<boolean>(false);
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [newTemplateDesc, setNewTemplateDesc] = useState<string>('');

  // Step 3: Message & CTA State (ALL EMPTY BY DEFAULT - PLACEHOLDERS ONLY)
  const [subject, setSubject] = useState<string>('');
  const [headline, setHeadline] = useState<string>('');
  const [bodyParagraphs, setBodyParagraphs] = useState<string>('');
  const [ctaText, setCtaText] = useState<string>('');
  const [ctaUrl, setCtaUrl] = useState<string>('');

  // Step 4: Attachments State (PDF, Docs, Images, etc.)
  const [attachments, setAttachments] = useState<EmailAttachmentItem[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Add files to attachments state (reads as Base64)
  const handleAddFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const maxFiles = 10;
    if (attachments.length + fileList.length > maxFiles) {
      toast.error(`You can attach up to ${maxFiles} files per email.`);
      return;
    }

    const filesArray = Array.from(fileList);
    let countSuccess = 0;

    filesArray.forEach((file) => {
      // 10MB limit per file check
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const newAttachment: EmailAttachmentItem = {
          id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          base64: base64Data,
        };

        setAttachments((prev) => [...prev, newAttachment]);
        countSuccess++;
        if (countSuccess === filesArray.length) {
          toast.success(`Attached ${filesArray.length === 1 ? file.name : `${filesArray.length} files`}`);
        }
      };
      reader.onerror = () => {
        toast.error(`Failed to read "${file.name}"`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    toast.success('Attachment removed', { duration: 1200 });
  };

  const handleClearAllAttachments = () => {
    setAttachments([]);
    toast.success('All attachments removed', { duration: 1200 });
  };

  const handleDownloadAttachmentItem = (att: EmailAttachmentItem) => {
    if (!att.base64) {
      toast.error('File content not available for download');
      return;
    }
    const link = document.createElement('a');
    link.href = att.base64;
    link.download = att.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Step 5: Sender Sign-off & Footer State (PGT Global Network Executive Office)
  const [senderName, setSenderName] = useState<string>('PGT Global Network Team');
  const [senderRole, setSenderRole] = useState<string>('Executive Office & Secretariat');
  const [companyName, setCompanyName] = useState<string>('PGT Global Network');
  const [officialWebsiteUrl, setOfficialWebsiteUrl] = useState<string>(
    'https://www.pgtglobalnetwork.com/'
  );
  const [footerNote, setFooterNote] = useState<string>(
    'PGT Global Network. Official executive communication. Confidential and privileged.'
  );

  // Live Preview Device Frame State
  const [previewDevice, setPreviewDevice] = useState<'laptop' | 'mobile'>('laptop');

  // Live Email Provider State (Resend API key & custom verified sender)
  const [resendApiKey, setResendApiKey] = useState<string>(() => {
    return localStorage.getItem('pgt_admin_resend_api_key') || (import.meta as any).env?.VITE_RESEND_API_KEY || '';
  });
  const [senderEmailAddress, setSenderEmailAddress] = useState<string>(() => {
    return localStorage.getItem('pgt_admin_sender_email') || 'PGT Global Network Team <office@pgtglobalnetwork.com>';
  });
  const [isProviderSettingsOpen, setIsProviderSettingsOpen] = useState<boolean>(false);
  const [tempApiKey, setTempApiKey] = useState<string>('');
  const [tempSenderEmail, setTempSenderEmail] = useState<string>('');

  // Dispatch & UI States
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
    currentRecipient: string;
    isOpen: boolean;
  } | null>(null);

  // In-Page Non-Intrusive Success Banner (Replaces jarring full-screen modal)
  const [lastDispatchedSuccess, setLastDispatchedSuccess] = useState<{
    recipient: string;
    subject: string;
    messageId: string;
    isLive: boolean;
    isBatch?: boolean;
    count?: number;
  } | null>(null);

  // Custom In-App Inline Delete State (Zero full-screen blocking modals)
  const [inlineDeleteId, setInlineDeleteId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Outgoing Email Logs State
  const [logs, setLogs] = useState<EmailStudioLog[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
  const [logsSearch, setLogsSearch] = useState<string>('');
  const [selectedAuditLog, setSelectedAuditLog] = useState<EmailStudioLog | null>(null);
  const [auditTab, setAuditTab] = useState<'visual' | 'fields' | 'raw'>('visual');
  const [copiedAuditField, setCopiedAuditField] = useState<string | null>(null);
  const [dbSyncPending, setDbSyncPending] = useState<boolean>(false);
  const [copiedSetupSql, setCopiedSetupSql] = useState<boolean>(false);

  const EMAIL_STUDIO_SQL_SETUP = `-- PGT GLOBAL NETWORK • COMPLETE EMAIL STUDIO LOGS SETUP
CREATE TABLE IF NOT EXISTS public.pgt_email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  recipient_name text,
  cc text,
  bcc text,
  subject text NOT NULL,
  headline text,
  body_paragraphs text NOT NULL,
  cta_text text,
  cta_url text,
  template_used text DEFAULT 'Custom',
  sender_name text DEFAULT 'PGT Global Network Team',
  sender_role text DEFAULT 'Executive Management Office',
  company_name text DEFAULT 'PGT Global Network',
  website_url text DEFAULT 'https://pgtglobalnetwork.com',
  footer_note text,
  rendered_html text,
  attachments jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'Delivered',
  provider_message_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.pgt_email_logs 
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.pgt_email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view email logs" ON public.pgt_email_logs;
DROP POLICY IF EXISTS "Public can insert email logs" ON public.pgt_email_logs;
DROP POLICY IF EXISTS "Public can delete email logs" ON public.pgt_email_logs;
DROP POLICY IF EXISTS "Allow anon all on email logs" ON public.pgt_email_logs;

CREATE POLICY "Allow anon all on email logs"
  ON public.pgt_email_logs
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_pgt_email_logs_created_at
  ON public.pgt_email_logs (created_at DESC);

CREATE OR REPLACE FUNCTION public.get_admin_email_logs()
RETURNS SETOF public.pgt_email_logs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.pgt_email_logs ORDER BY created_at DESC;
$$;`;

  const handleCopySetupSql = () => {
    navigator.clipboard.writeText(EMAIL_STUDIO_SQL_SETUP);
    setCopiedSetupSql(true);
    toast.success('SQL setup script copied! Paste and run in Supabase SQL Editor.', { duration: 4500 });
    setTimeout(() => setCopiedSetupSql(false), 3000);
  };

  // Load Email Logs
  const loadLogs = async () => {
    setIsLogsLoading(true);
    try {
      const res = await fetchEmailLogs();
      setLogs(res.data);
      if (res.needsMigration !== undefined) {
        setDbSyncPending(!!res.needsMigration);
      }
    } catch (err) {
      console.error('Error fetching email logs:', err);
    } finally {
      setIsLogsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Parse Batch Recipients with lineIndex tracking
  const parsedBatchRecipients = useMemo(() => {
    if (!batchRawInput.trim()) return [];
    const lines = batchRawInput.split('\n');
    const list: { name: string; email: string; lineIndex: number }[] = [];

    lines.forEach((line, lineIndex) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.includes(',')) {
        const parts = trimmed.split(',');
        const p1 = parts[0].trim();
        const p2 = parts.slice(1).join(',').trim();

        if (p2.includes('@')) {
          list.push({ name: p1, email: p2, lineIndex });
        } else if (p1.includes('@')) {
          list.push({ name: p2, email: p1, lineIndex });
        } else {
          list.push({ name: p1, email: p2, lineIndex });
        }
      } else if (trimmed.includes('@')) {
        list.push({ name: '', email: trimmed, lineIndex });
      }
    });
    return list;
  }, [batchRawInput]);

  // Remove single recipient from batch list by its line index
  const handleRemoveBatchRecipient = (lineIndexToRemove: number) => {
    const lines = batchRawInput.split('\n');
    if (lineIndexToRemove >= 0 && lineIndexToRemove < lines.length) {
      lines.splice(lineIndexToRemove, 1);
      setBatchRawInput(lines.join('\n'));
      toast.success('Recipient removed from batch list', { duration: 1200 });
    }
  };

  // Clear all recipients in batch list
  const handleClearAllRecipients = () => {
    setBatchRawInput('');
    toast.success('Batch recipient list cleared', { duration: 1200 });
  };

  // All Templates combined (prebuilt + custom)
  const allTemplates = useMemo(() => {
    return [...customTemplates, ...PREBUILT_TEMPLATES];
  }, [customTemplates]);

  // Handle template selection
  const handleSelectTemplate = (tmpl: EmailTemplate) => {
    setSelectedTemplateId(tmpl.id);
    if (tmpl.id === 'blank') {
      setSubject('');
      setHeadline('');
      setBodyParagraphs('');
      setCtaText('');
      setCtaUrl('');
      setSenderName('PGT Global Network Team');
      setSenderRole('Executive Office & Secretariat');
      setCompanyName('PGT Global Network');
      setOfficialWebsiteUrl('https://www.pgtglobalnetwork.com/');
      setFooterNote('PGT Global Network. Official executive communication. Confidential and privileged.');
      setAttachments([]);
      toast.success('Selected Blank / Custom Email', { duration: 1500 });
      return;
    }

    setSubject(tmpl.subject || '');
    setHeadline(tmpl.headline || '');
    setBodyParagraphs(tmpl.body || '');
    setCtaText(tmpl.ctaText || '');
    setCtaUrl(tmpl.ctaUrl || '');
    if (tmpl.senderName !== undefined) setSenderName(tmpl.senderName);
    if (tmpl.senderRole !== undefined) setSenderRole(tmpl.senderRole);
    if (tmpl.companyName !== undefined) setCompanyName(tmpl.companyName);
    if (tmpl.officialWebsiteUrl !== undefined) setOfficialWebsiteUrl(tmpl.officialWebsiteUrl);
    if (tmpl.footerNote !== undefined) setFooterNote(tmpl.footerNote);

    // Restore attachments if any were saved with this template
    if (tmpl.attachments && Array.isArray(tmpl.attachments) && tmpl.attachments.length > 0) {
      setAttachments([...tmpl.attachments]);
      toast.success(`Applied template: ${tmpl.name} (${tmpl.attachments.length} file${tmpl.attachments.length > 1 ? 's' : ''} restored)`, { duration: 2000 });
    } else {
      setAttachments([]);
      toast.success(`Applied template: ${tmpl.name}`, { duration: 1500 });
    }
  };

  // Save current as custom template
  const handleSaveCurrentAsTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    const newTmpl: EmailTemplate = {
      id: `custom_${Date.now()}`,
      name: newTemplateName.trim(),
      description: newTemplateDesc.trim() || 'Custom saved executive template',
      subject,
      headline,
      body: bodyParagraphs,
      ctaText,
      ctaUrl,
      senderName,
      senderRole,
      companyName,
      officialWebsiteUrl,
      footerNote,
      attachments: attachments.map((a) => ({ ...a })),
      isCustom: true,
    };

    const updated = [newTmpl, ...customTemplates];
    setCustomTemplates(updated);
    try {
      localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage quota warning when saving template:', e);
      try {
        const lightweight = updated.map((t) => ({
          ...t,
          attachments: t.attachments?.map((a) => ({ id: a.id, name: a.name, size: a.size, type: a.type, base64: a.base64 })),
        }));
        localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify(lightweight));
      } catch (innerErr) {
        toast.error('Template saved in active session, but browser storage limit reached for files.');
      }
    }
    setSelectedTemplateId(newTmpl.id);
    setIsSavingTemplateModalOpen(false);
    setNewTemplateName('');
    setNewTemplateDesc('');
    toast.success(
      `Saved custom template: ${newTmpl.name}${attachments.length > 0 ? ` with ${attachments.length} attachment(s)` : ''}`
    );
  };

  // Delete custom template
  const handleDeleteCustomTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = customTemplates.filter((t) => t.id !== id);
    setCustomTemplates(filtered);
    try {
      localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
    if (selectedTemplateId === id) {
      setSelectedTemplateId('blank');
    }
    toast.success('Custom template deleted');
  };

  // Reset fields to empty
  const handleResetFields = () => {
    setSelectedTemplateId('blank');
    setRecipientEmail('');
    setRecipientName('');
    setCcValue('');
    setBccValue('');
    setShowCC(false);
    setShowBCC(false);
    setBatchRawInput('');
    setSubject('');
    setHeadline('');
    setBodyParagraphs('');
    setCtaText('');
    setCtaUrl('');
    setAttachments([]);
    toast.success('Composer fields reset');
  };

  // Premium Corporate HTML Generator (Clean, Top-Tier, Invisible Empty Fields & Branded Attachments)
  const generateEmailHtml = (targetName: string, isPreview = false) => {
    const greeting = targetName.trim() ? `Dear ${targetName.trim()},` : '';
    const rawParagraphs = (bodyParagraphs || '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    // Format paragraphs with bullet list support (- or * or •)
    const formattedParagraphsHtml = rawParagraphs.map((para) => {
      const lines = para.split('\n');
      const hasBullets = lines.some((l) => /^\s*[-*•]\s+/.test(l));
      if (!hasBullets) {
        return `<p style="margin: 0 0 18px 0; line-height: 1.75; color: #334155; font-size: 15px;">${para.replace(/\n/g, '<br/>')}</p>`;
      }

      let inList = false;
      const htmlPieces: string[] = [];
      for (const line of lines) {
        const trimmed = line.trim();
        if (/^[-*•]\s+/.test(trimmed)) {
          if (!inList) {
            htmlPieces.push('<ul style="margin: 8px 0 16px 0; padding-left: 22px; color: #334155; font-size: 15px; line-height: 1.75;">');
            inList = true;
          }
          const itemText = trimmed.replace(/^[-*•]\s+/, '');
          htmlPieces.push(`<li style="margin-bottom: 6px;">${itemText}</li>`);
        } else {
          if (inList) {
            htmlPieces.push('</ul>');
            inList = false;
          }
          if (trimmed) {
            htmlPieces.push(`<p style="margin: 0 0 14px 0; line-height: 1.75; color: #334155; font-size: 15px;">${trimmed}</p>`);
          }
        }
      }
      if (inList) {
        htmlPieces.push('</ul>');
      }
      return htmlPieces.join('');
    }).join('');

    const logoSrc = isPreview
      ? '/PGT New Logo Transparent.png'
      : 'https://pgtglobalnetwork.com/PGT%20New%20Logo%20Transparent.png';

    const hasSignoff = !!(
      senderName.trim() ||
      senderRole.trim() ||
      companyName.trim() ||
      officialWebsiteUrl.trim()
    );

    const websiteDisplay = officialWebsiteUrl.trim()
      ? officialWebsiteUrl.trim().replace(/^https?:\/\//i, '')
      : '';
    const websiteHref = officialWebsiteUrl.trim()
      ? (officialWebsiteUrl.startsWith('http') ? officialWebsiteUrl : `https://${officialWebsiteUrl}`)
      : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject.trim() || 'PGT Global Network Executive Communication'}</title>
</head>
<body style="margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container Card with Refined Shadow & Border -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03);">
          
          <!-- Top Vibrant Gradient Accent Bar -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #4f46e5 0%, #3b82f6 50%, #06b6d4 100%);"></td>
          </tr>

          <!-- Brand Header with Centered Official Logo -->
          <tr>
            <td align="center" style="padding: 36px 40px 24px 40px; border-bottom: 1px solid #f8fafc;">
              <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center">
                    <img src="${logoSrc}" alt="PGT Global Network" style="height: 48px; width: auto; max-width: 190px; display: block; margin: 0 auto; border: 0;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Banner / Headline (Invisible if empty) -->
          ${
            headline.trim()
              ? `<tr>
            <td align="center" style="padding: 24px 40px 8px 40px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.35; letter-spacing: -0.4px; text-align: center;">
                ${headline.trim()}
              </h1>
            </td>
          </tr>`
              : ''
          }

          <!-- Body Content Area -->
          <tr>
            <td style="padding: ${headline.trim() ? '16px' : '28px'} 44px 34px 44px; font-size: 15px; line-height: 1.8; color: #334155;">
              ${
                greeting
                  ? `<p style="margin: 0 0 18px 0; font-weight: 700; color: #0f172a; font-size: 15px; letter-spacing: -0.1px;">${greeting}</p>`
                  : ''
              }

              ${formattedParagraphsHtml}

              <!-- Call to Action Button (Invisible if either ctaText or ctaUrl is empty) -->
              ${
                ctaText.trim() && ctaUrl.trim()
                  ? `<div style="margin: 32px 0 28px 0; text-align: center;">
                <table border="0" cellspacing="0" cellpadding="0" align="center">
                  <tr>
                    <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%); box-shadow: 0 6px 18px rgba(79, 70, 229, 0.32);">
                      <a href="${ctaUrl.trim()}" target="_blank" rel="noopener noreferrer" style="font-size: 14.5px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 14px 32px; display: inline-block; letter-spacing: 0.2px;">
                        ${ctaText.trim()} &nbsp;&rarr;
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 12px 0 0 0; font-size: 11.5px; color: #94a3b8; text-align: center;">
                  Direct link: <a href="${ctaUrl.trim()}" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; text-decoration: underline;">${ctaUrl.trim()}</a>
                </p>
              </div>`
                  : ''
              }

              <!-- Attached Documents Box (Invisible if no attachments) -->
              ${
                attachments.length > 0
                  ? `<div style="margin: 30px 0 24px 0; padding: 16px 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px;">
                <table border="0" cellspacing="0" cellpadding="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 10px; font-size: 11.5px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.6px;">
                      &#128206; Attached Documents (${attachments.length})
                    </td>
                  </tr>
                  ${attachments
                    .map(
                      (att) => `<tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #1e293b; border-top: 1px dashed #e2e8f0;">
                      <table border="0" cellspacing="0" cellpadding="0" width="100%">
                        <tr>
                          <td style="color: #0f172a; font-weight: 600;">
                            ${att.name}
                          </td>
                          <td align="right" style="color: #64748b; font-size: 11.5px; font-family: monospace;">
                            ${formatFileSize(att.size)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>`
                    )
                    .join('')}
                </table>
              </div>`
                  : ''
              }

              <!-- Executive Sign-off Block (Invisible if all sign-off fields are empty) -->
              ${
                hasSignoff
                  ? `<div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="border-left: 3.5px solid #4f46e5; padding-left: 16px;">
                      <p style="margin: 0 0 4px 0; font-size: 13px; color: #64748b; font-weight: 500;">With regards,</p>
                      ${senderName.trim() ? `<p style="margin: 0; font-size: 15.5px; font-weight: 800; color: #0f172a; letter-spacing: -0.2px;">${senderName.trim()}</p>` : ''}
                      ${senderRole.trim() ? `<p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #4f46e5;">${senderRole.trim()}</p>` : ''}
                      ${companyName.trim() ? `<p style="margin: 3px 0 0 0; font-size: 12.5px; color: #64748b;">${companyName.trim()}</p>` : ''}
                      ${
                        websiteHref
                          ? `<p style="margin: 4px 0 0 0; font-size: 12px;"><a href="${websiteHref}" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; text-decoration: underline; font-weight: 600;">${websiteDisplay}</a></p>`
                          : ''
                      }
                    </td>
                  </tr>
                </table>
              </div>`
                  : ''
              }
            </td>
          </tr>

          <!-- Corporate Legal Footer (Invisible empty notes) -->
          <tr>
            <td align="center" style="padding: 26px 40px 30px 40px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 11px; line-height: 1.6; color: #94a3b8;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #64748b; font-size: 11px; letter-spacing: 0.8px; text-transform: uppercase;">
                PGT GLOBAL NETWORK
              </p>
              <p style="margin: 0 0 4px 0; font-size: 11px;">
                &copy; ${new Date().getFullYear()}${companyName.trim() ? ` ${companyName.trim()}` : ''}. All rights reserved.
              </p>
              ${
                footerNote.trim()
                  ? `<p style="margin: 0; font-size: 10.5px; color: #94a3b8; max-width: 460px; display: inline-block;">
                ${footerNote.trim()}
              </p>`
                  : ''
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  // Helper to format IST timestamp
  const formatIST = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return isoString;
    }
  };

  // Real Email Delivery Pipeline (Resend API & Supabase Engine)
  const deliverEmail = async (params: {
    to: string;
    subject: string;
    html: string;
    cc?: string;
    bcc?: string;
    attachments?: EmailAttachmentItem[];
  }): Promise<{ isLive: boolean; messageId: string; error?: string }> => {
    const key = resendApiKey.trim();
    const sender = senderEmailAddress.trim() || 'PGT Global Network Team <office@pgtglobalnetwork.com>';
    let lastError: string | null = null;

    // 1. Direct Resend API via proxy / direct if API Key is available
    if (key) {
      const endpoints = ['/api-resend/emails', 'https://api.resend.com/emails'];
      for (const endpoint of endpoints) {
        try {
          const payload: any = {
            from: sender,
            to: [params.to],
            subject: params.subject,
            html: params.html,
          };
          if (params.cc) {
            payload.cc = params.cc.split(',').map((s) => s.trim()).filter(Boolean);
          }
          if (params.bcc) {
            payload.bcc = params.bcc.split(',').map((s) => s.trim()).filter(Boolean);
          }
          if (params.attachments && params.attachments.length > 0) {
            payload.attachments = params.attachments.map((att) => ({
              filename: att.name,
              content: att.base64 ? att.base64.replace(/^data:.*?;base64,/, '') : '',
            }));
          }

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const data = await res.json();
            return { isLive: true, messageId: data.id || `re_${Date.now().toString(36)}` };
          } else {
            const errText = await res.text();
            console.warn(`[EmailStudio] Resend API (${endpoint}) response:`, errText);
            try {
              const parsed = JSON.parse(errText);
              lastError = parsed.message || parsed.error || errText;
            } catch {
              lastError = errText;
            }
          }
        } catch (err: any) {
          console.warn(`[EmailStudio] Resend API (${endpoint}) network error:`, err);
          if (!lastError) lastError = err.message;
        }
      }
    }

    // 2. Supabase Edge Function invoke fallback
    try {
      const { data, error } = await supabase.functions.invoke('send-emails', {
        body: {
          emailType: 'executive_email_studio',
          recipient: params.to,
          data: {
            from: sender,
            subject: params.subject,
            html: params.html,
            cc: params.cc,
            bcc: params.bcc,
            attachments: params.attachments,
            resendApiKey: key || undefined,
          },
        },
      });

      if (!error && data?.success) {
        return { isLive: true, messageId: data.messageId || `sb_${Date.now().toString(36)}` };
      } else {
        const sbErr = error?.message || data?.error || (data?.errors && data?.errors.join(', '));
        if (sbErr) {
          console.warn('[EmailStudio] Supabase Edge Function error:', sbErr);
          lastError = sbErr;
        }
      }
    } catch (sbErr: any) {
      console.warn('[EmailStudio] Supabase Edge Function invoke exception:', sbErr);
      if (sbErr?.message) lastError = sbErr.message;
    }

    // Default: Vault Logged
    return {
      isLive: false,
      messageId: `pgt_vault_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      error: lastError || (key ? 'Live delivery failed' : 'Live delivery requires a Resend API Key. Stored in vault.'),
    };
  };

  // Dispatch Single Email
  const handleDispatchSingle = async () => {
    if (!recipientEmail.trim() || !recipientEmail.includes('@')) {
      toast.error('Please enter a valid recipient email address');
      return;
    }
    if (!subject.trim()) {
      toast.error('Please enter an email subject line');
      return;
    }
    if (!bodyParagraphs.trim()) {
      toast.error('Please write the email body content');
      return;
    }

    setIsDispatching(true);
    const renderedHtml = generateEmailHtml(recipientName.trim());

    try {
      const delivery = await deliverEmail({
        to: recipientEmail.trim(),
        subject: subject.trim(),
        html: renderedHtml,
        cc: showCC && ccValue.trim() ? ccValue.trim() : undefined,
        bcc: showBCC && bccValue.trim() ? bccValue.trim() : undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      const logStatus = delivery.isLive ? 'Delivered (Live)' : 'Logged (Provider Key Pending)';

      const logResult = await recordEmailLog({
        recipient_email: recipientEmail.trim(),
        recipient_name: recipientName.trim() || 'Client / Partner',
        cc: showCC ? ccValue.trim() : undefined,
        bcc: showBCC ? bccValue.trim() : undefined,
        subject: subject.trim(),
        headline: headline.trim(),
        body_paragraphs: bodyParagraphs,
        cta_text: ctaText.trim() || undefined,
        cta_url: ctaUrl.trim() || undefined,
        template_used:
          allTemplates.find((t) => t.id === selectedTemplateId)?.name || 'Custom Email',
        sender_name: senderName,
        sender_role: senderRole,
        company_name: companyName,
        website_url: officialWebsiteUrl,
        footer_note: footerNote,
        rendered_html: renderedHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
        status: logStatus,
        provider_message_id: delivery.messageId,
      });

      if (logResult.data) {
        setLogs((prev) => {
          const exists = prev.some((l) => l.id === logResult.data!.id);
          return exists ? prev : [logResult.data!, ...prev];
        });
      }
      if (logResult.needsMigration !== undefined) {
        setDbSyncPending(!!logResult.needsMigration);
      }

      await loadLogs();

      // Smooth in-page success banner without full-page blur or screen lag
      setLastDispatchedSuccess({
        recipient: recipientEmail.trim(),
        subject: subject.trim(),
        messageId: delivery.messageId,
        isLive: delivery.isLive,
        isBatch: false,
      });

      if (delivery.isLive) {
        toast.success(`Email delivered live to ${recipientEmail.trim()}!`, { duration: 3500 });
      } else {
        if (delivery.error && delivery.error.includes('Key')) {
          toast.success('Dispatched & Logged to Vault! Add Resend Key to send live emails.', {
            duration: 4500,
          });
        } else {
          toast.error(`Live Delivery Failed: ${delivery.error || 'Check console or Supabase logs'}. Stored in vault.`, {
            duration: 6000,
          });
        }
      }
    } catch (err: any) {
      console.error('Dispatch error:', err);
      toast.error('Failed to dispatch email: ' + (err.message || 'Unknown error'));
    } finally {
      setIsDispatching(false);
    }
  };

  // Send Test Copy
  const handleSendTestCopy = async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject line first');
      return;
    }
    setIsSendingTest(true);
    const testEmail = 'office@pgtglobalnetwork.com';
    const testSubject = `[TEST PREVIEW] ${subject.trim()}`;
    const testHtml = generateEmailHtml('Executive Office (Test)');

    try {
      const delivery = await deliverEmail({
        to: testEmail,
        subject: testSubject,
        html: testHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      const logResult = await recordEmailLog({
        recipient_email: testEmail,
        recipient_name: 'Executive Office (Test Copy)',
        subject: testSubject,
        headline: headline.trim(),
        body_paragraphs: bodyParagraphs,
        cta_text: ctaText.trim() || undefined,
        cta_url: ctaUrl.trim() || undefined,
        template_used: 'Test Copy Dispatch',
        sender_name: senderName,
        sender_role: senderRole,
        company_name: companyName,
        website_url: officialWebsiteUrl,
        footer_note: footerNote,
        rendered_html: testHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
        status: delivery.isLive ? 'Delivered (Live)' : 'Logged (Provider Key Pending)',
        provider_message_id: delivery.messageId,
      });

      if (logResult.data) {
        setLogs((prev) => {
          const exists = prev.some((l) => l.id === logResult.data!.id);
          return exists ? prev : [logResult.data!, ...prev];
        });
      }
      if (logResult.needsMigration !== undefined) {
        setDbSyncPending(!!logResult.needsMigration);
      }

      await loadLogs();
      toast.success(`Test preview logged to ${testEmail}!`, { duration: 3000 });
    } catch (err: any) {
      toast.error('Failed to send test copy: ' + err.message);
    } finally {
      setIsSendingTest(false);
    }
  };

  // Dispatch Batch Emails (Personalized 1-to-1)
  const handleDispatchBatch = async () => {
    if (parsedBatchRecipients.length === 0) {
      toast.error('No valid recipients found in batch input');
      return;
    }
    if (!subject.trim()) {
      toast.error('Please enter an email subject line');
      return;
    }
    if (!bodyParagraphs.trim()) {
      toast.error('Please write the email body content');
      return;
    }

    setIsDispatching(true);
    setBatchProgress({
      isOpen: true,
      current: 0,
      total: parsedBatchRecipients.length,
      currentRecipient: parsedBatchRecipients[0].name || parsedBatchRecipients[0].email,
    });

    try {
      const templateTitle =
        allTemplates.find((t) => t.id === selectedTemplateId)?.name || 'Personalized Batch';

      let liveCount = 0;
      for (let i = 0; i < parsedBatchRecipients.length; i++) {
        const item = parsedBatchRecipients[i];
        setBatchProgress({
          isOpen: true,
          current: i + 1,
          total: parsedBatchRecipients.length,
          currentRecipient: item.name ? `${item.name} (${item.email})` : item.email,
        });

        const itemHtml = generateEmailHtml(item.name);
        const delivery = await deliverEmail({
          to: item.email.trim(),
          subject: subject.trim(),
          html: itemHtml,
          cc: showCC && ccValue.trim() ? ccValue.trim() : undefined,
          bcc: showBCC && bccValue.trim() ? bccValue.trim() : undefined,
          attachments: attachments.length > 0 ? attachments : undefined,
        });

        if (delivery.isLive) liveCount++;

        const logResult = await recordEmailLog({
          recipient_email: item.email,
          recipient_name: item.name || 'Valued Recipient',
          cc: showCC ? ccValue.trim() : undefined,
          bcc: showBCC ? bccValue.trim() : undefined,
          subject: subject.trim(),
          headline: headline.trim(),
          body_paragraphs: bodyParagraphs,
          cta_text: ctaText.trim() || undefined,
          cta_url: ctaUrl.trim() || undefined,
          template_used: `${templateTitle} [Mail Merge]`,
          sender_name: senderName,
          sender_role: senderRole,
          company_name: companyName,
          website_url: officialWebsiteUrl,
          footer_note: footerNote,
          rendered_html: itemHtml,
          attachments: attachments.length > 0 ? attachments : undefined,
          status: delivery.isLive ? 'Delivered (Live)' : 'Logged (Provider Key Pending)',
          provider_message_id: delivery.messageId,
        });

        if (logResult.data) {
          setLogs((prev) => {
            const exists = prev.some((l) => l.id === logResult.data!.id);
            return exists ? prev : [logResult.data!, ...prev];
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      await loadLogs();
      setBatchProgress(null);

      // In-page success feedback without full-screen modal lock
      setLastDispatchedSuccess({
        recipient: `${parsedBatchRecipients.length} Recipients`,
        subject: subject.trim(),
        messageId: `batch_${Date.now().toString(36)}`,
        isLive: liveCount > 0,
        isBatch: true,
        count: parsedBatchRecipients.length,
      });

      toast.success(`Batch dispatch completed! (${parsedBatchRecipients.length} emails processed)`);
    } catch (err: any) {
      console.error('Batch error:', err);
      toast.error('Failed to complete batch dispatch: ' + err.message);
      setBatchProgress(null);
    } finally {
      setIsDispatching(false);
    }
  };

  // Perform permanent inline deletion
  const handleExecuteDelete = async (targetId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsDeletingId(targetId);
    try {
      await deleteEmailLog(targetId);
      setLogs((prev) => prev.filter((l) => l.id !== targetId));
      if (selectedAuditLog?.id === targetId) {
        setSelectedAuditLog(null);
      }
      setInlineDeleteId(null);
      toast.success('Dispatched email log permanently removed');
    } catch (err: any) {
      toast.error('Failed to delete log: ' + err.message);
    } finally {
      setIsDeletingId(null);
    }
  };

  // Save Provider Settings
  const handleSaveProviderSettings = () => {
    const cleanKey = tempApiKey.trim();
    const cleanSender = tempSenderEmail.trim() || 'PGT Global Network Team <office@pgtglobalnetwork.com>';
    setResendApiKey(cleanKey);
    setSenderEmailAddress(cleanSender);
    try {
      localStorage.setItem('pgt_admin_resend_api_key', cleanKey);
      localStorage.setItem('pgt_admin_sender_email', cleanSender);
    } catch (e) {
      console.error(e);
    }
    setIsProviderSettingsOpen(false);
    if (cleanKey) {
      toast.success('Resend API key configured! Live emails will be delivered directly.');
    } else {
      toast.success('Provider settings updated. In database vault mode.');
    }
  };

  // Open Provider Settings modal
  const handleOpenProviderSettings = () => {
    setTempApiKey(resendApiKey);
    setTempSenderEmail(senderEmailAddress);
    setIsProviderSettingsOpen(true);
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAuditField(fieldKey);
    toast.success('Copied to clipboard', { duration: 1200 });
    setTimeout(() => setCopiedAuditField(null), 1500);
  };

  // Filtered outgoing logs
  const filteredLogs = useMemo(() => {
    if (!logsSearch.trim()) return logs;
    const q = logsSearch.toLowerCase();
    return logs.filter(
      (l) =>
        l.recipient_email?.toLowerCase().includes(q) ||
        l.recipient_name?.toLowerCase().includes(q) ||
        l.subject?.toLowerCase().includes(q) ||
        l.template_used?.toLowerCase().includes(q)
    );
  }, [logs, logsSearch]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 pb-16">
      {/* Top Breadcrumb & Header Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {onBackToOverview && (
              <button
                onClick={onBackToOverview}
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors admin-btn-press"
                title="Back to Overview"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-xs flex-shrink-0">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-foreground">
                  Executive Email Studio
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Direct HTML mailer with real-time responsive desktop and mobile preview rendering.
              </p>
            </div>
          </div>

          {/* Engine Status & Delivery Settings Button */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={handleOpenProviderSettings}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors admin-btn-press"
              title="Configure Resend API Key for live inbox delivery"
            >
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Delivery Settings</span>
            </button>
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{resendApiKey ? 'Live Delivery Ready' : 'Vault Active'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* IN-PAGE NON-INTRUSIVE SUCCESS NOTIFICATION BANNER */}
      {lastDispatchedSuccess && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/25 p-4 sm:p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">
                    {lastDispatchedSuccess.isBatch
                      ? `Batch Dispatch Completed (${lastDispatchedSuccess.count} emails)`
                      : 'Email Dispatched & Successfully Logged'}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lastDispatchedSuccess.isLive
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {lastDispatchedSuccess.isLive
                      ? 'Delivered to Inboxes (Live)'
                      : 'Logged in Database Vault (Provider Key Pending)'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Recipient:</span> {lastDispatchedSuccess.recipient}
                  {' • '}
                  <span className="font-semibold text-foreground">Subject:</span> &ldquo;{lastDispatchedSuccess.subject}&rdquo;
                  {' • '}
                  <span className="font-mono text-[11px] text-muted-foreground">Ref: {lastDispatchedSuccess.messageId}</span>
                </p>
                {!lastDispatchedSuccess.isLive && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/90 pt-1">
                    Tip: To send directly to actual Google / Outlook inboxes in real-time, click{' '}
                    <button
                      type="button"
                      onClick={handleOpenProviderSettings}
                      className="underline font-bold hover:text-amber-900 dark:hover:text-white"
                    >
                      Delivery Settings
                    </button>{' '}
                    to enter your free Resend API key.
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLastDispatchedSuccess(null)}
              className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
              title="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Composer & Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 4-Step Composer */}
        <div className="lg:col-span-7 space-y-5">
          {/* STEP 1: Recipient Configuration */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground/60 text-[10px] font-mono">
                  @
                </span>
                <span>Recipient Configuration</span>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">Step 1 of 5</span>
            </div>

            {/* Recipient Mode Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
              <button
                type="button"
                onClick={() => setRecipientMode('single')}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center space-x-1.5 ${
                  recipientMode === 'single'
                    ? 'bg-card text-foreground shadow-xs border border-border/80'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Single Recipient</span>
              </button>
              <button
                type="button"
                onClick={() => setRecipientMode('batch')}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center space-x-1.5 ${
                  recipientMode === 'batch'
                    ? 'bg-card text-foreground shadow-xs border border-border/80'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Personalized Batch</span>
                <span className="rounded-full bg-indigo-500/15 px-1.5 py-0.2 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  Multi
                </span>
              </button>
            </div>

            {/* Mode A: Single Recipient Fields */}
            {recipientMode === 'single' ? (
              <div className="space-y-3.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Recipient Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="client@enterprise.com"
                      className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Recipient Full Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. David Vance"
                      className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* CC & BCC Toggles */}
                <div className="flex items-center space-x-4 text-xs font-medium pt-0.5">
                  {!showCC ? (
                    <button
                      type="button"
                      onClick={() => setShowCC(true)}
                      className="text-primary hover:underline flex items-center gap-1 text-xs"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add CC</span>
                    </button>
                  ) : (
                    <span className="text-muted-foreground text-xs">CC Active</span>
                  )}

                  {!showBCC ? (
                    <button
                      type="button"
                      onClick={() => setShowBCC(true)}
                      className="text-primary hover:underline flex items-center gap-1 text-xs"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add BCC</span>
                    </button>
                  ) : (
                    <span className="text-muted-foreground text-xs">BCC Active</span>
                  )}
                </div>

                {showCC && (
                  <div className="animate-in fade-in-50 duration-200">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">
                        Carbon Copy (CC) Addresses (comma-separated)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCC(false);
                          setCcValue('');
                        }}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Remove CC
                      </button>
                    </div>
                    <input
                      type="text"
                      value={ccValue}
                      onChange={(e) => setCcValue(e.target.value)}
                      placeholder="colleague@enterprise.com, advisor@org.com"
                      className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}

                {showBCC && (
                  <div className="animate-in fade-in-50 duration-200">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">
                        Blind Carbon Copy (BCC) Addresses (comma-separated)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBCC(false);
                          setBccValue('');
                        }}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Remove BCC
                      </button>
                    </div>
                    <input
                      type="text"
                      value={bccValue}
                      onChange={(e) => setBccValue(e.target.value)}
                      placeholder="audit@pgtglobalnetwork.com, legal@pgtglobalnetwork.com"
                      className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Mode B: Personalized Batch Input */
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    Recipients List (One per line: Name, Email)
                  </label>
                  <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                    {parsedBatchRecipients.length} Recipients
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={batchRawInput}
                  onChange={(e) => setBatchRawInput(e.target.value)}
                  placeholder={`David Vance, david@enterprise.com\nSarah Connor, sarah@cyberdyne.com\nAlex Smith, alex@startup.io\nclient@techfire.com`}
                  className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                {/* Batch Mode Explanatory Notice Banner */}
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-foreground text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Personalized 1-to-1 Deliveries</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Each person receives an individual, branded email greeting them by name (
                    <strong className="text-foreground">"Dear David,"</strong>). Recipient email addresses
                    remain 100% private from each other without using BCC.
                  </p>
                </div>

                {/* DETECTED RECIPIENTS (With Clear Remove Button per Item) */}
                {parsedBatchRecipients.length > 0 && (
                  <div className="rounded-xl border border-border/80 bg-muted/25 p-3.5 space-y-3 animate-in fade-in-50 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Detected Recipients ({parsedBatchRecipients.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleClearAllRecipients}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-600 hover:underline bg-red-500/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Clear All</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {parsedBatchRecipients.map((rec) => (
                        <div
                          key={`${rec.email}-${rec.lineIndex}`}
                          className="group inline-flex items-center space-x-2 rounded-xl border border-border/90 bg-card px-3 py-1.5 text-xs shadow-xs hover:border-red-300 dark:hover:border-red-800/60 transition-all"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold">
                            {(rec.name || rec.email).charAt(0).toUpperCase()}
                          </span>
                          <span className="font-bold text-foreground">
                            {rec.name || 'Recipient'}
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            ({rec.email})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBatchRecipient(rec.lineIndex)}
                            className="inline-flex items-center gap-1 rounded-md bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white px-2 py-0.5 text-[10.5px] font-bold transition-all ml-1 shadow-2xs cursor-pointer"
                            title={`Remove ${rec.name || rec.email}`}
                          >
                            <X className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: Choose Email Template */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <Layers className="h-4 w-4 text-primary" />
                <span>Choose Email Template</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsSavingTemplateModalOpen(true)}
                  className="inline-flex items-center space-x-1 rounded-lg border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/60 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 text-[11px] font-bold transition-colors"
                >
                  <Bookmark className="h-3 w-3" />
                  <span>Save Current as Template</span>
                </button>
                <span className="text-[11px] font-semibold text-muted-foreground">Step 2 of 5</span>
              </div>
            </div>

            {/* Templates Grid (2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allTemplates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`group relative cursor-pointer rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/5 shadow-xs ring-1 ring-indigo-500'
                        : 'border-border/70 bg-card hover:bg-muted/30 hover:border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 pr-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-foreground truncate">{tmpl.name}</h4>
                          {tmpl.isCustom && (
                            <span className="rounded bg-amber-500/15 px-1 py-0.2 text-[9px] font-bold text-amber-500 uppercase">
                              Custom
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {tmpl.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {isSelected && (
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white shadow-xs">
                            <Check className="h-2.5 w-2.5" />
                          </div>
                        )}
                        {tmpl.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomTemplate(tmpl.id, e)}
                            className="text-muted-foreground hover:text-red-500 p-1 rounded-md"
                            title="Delete custom template"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Message & Call To Action */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-4 w-4 text-primary" />
                <span>Message &amp; Call to Action</span>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">Step 3 of 5</span>
            </div>

            <div className="space-y-3.5">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Subject Line <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Strategic Technology Consultation — Next Steps"
                  className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Email Headline / Header Banner Text
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Confirmation of Your Consultation Request"
                  className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Body Paragraphs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Email Body Paragraphs <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    Separate paragraphs with empty double lines
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={bodyParagraphs}
                  onChange={(e) => setBodyParagraphs(e.target.value)}
                  placeholder="Enter your message here..."
                  className="w-full rounded-xl border border-border/80 bg-background p-3.5 text-xs text-foreground placeholder:text-muted-foreground/60 leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* CTA Button Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Call to Action Button Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Schedule Discovery Call"
                    className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Call to Action Link URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="https://calendly.com/pgt-tech/discovery"
                    className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: File Attachments */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <Paperclip className="h-4 w-4 text-primary" />
                <span>File Attachments (PDF, Docs, Images)</span>
              </div>
              <div className="flex items-center space-x-2">
                {attachments.length > 0 && (
                  <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {attachments.length} {attachments.length === 1 ? 'file' : 'files'} attached
                  </span>
                )}
                <span className="text-[11px] font-semibold text-muted-foreground">Step 4 of 5</span>
              </div>
            </div>

            {/* Dropzone & File Input */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDraggingFile(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingFile(false);
                handleAddFiles(e.dataTransfer.files);
              }}
              onClick={() => {
                document.getElementById('email-studio-file-input')?.click();
              }}
              className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                isDraggingFile
                  ? 'border-indigo-500 bg-indigo-500/10 ring-4 ring-indigo-500/20'
                  : 'border-border/80 hover:border-indigo-500/60 bg-muted/20 hover:bg-muted/40'
              }`}
            >
              <input
                id="email-studio-file-input"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.svg,.zip"
                className="hidden"
                onChange={(e) => {
                  handleAddFiles(e.target.files);
                  e.target.value = '';
                }}
              />

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-xs mb-3">
                <UploadCloud className="h-6 w-6" />
              </div>

              <p className="text-xs font-bold text-foreground">
                Click to browse or drag &amp; drop files here
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-sm">
                Supports PDF, Word (.doc, .docx), Excel (.xls, .xlsx, .csv), Images (.png, .jpg), and Archives (.zip) up to 10MB each
              </p>
            </div>

            {/* Attached Files List */}
            {attachments.length > 0 && (
              <div className="space-y-2 pt-1 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between text-xs font-semibold px-0.5">
                  <span className="text-muted-foreground text-[11px]">
                    Attached Files ({attachments.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleClearAllAttachments}
                    className="text-[11px] text-red-500 hover:text-red-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove All</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {attachments.map((att) => {
                    const category = getAttachmentFileCategory(att.name, att.type);
                    return (
                      <div
                        key={att.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-border/90 bg-card p-3 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800/60 transition-all"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold shrink-0 ${
                              category === 'pdf'
                                ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                                : category === 'image'
                                ? 'bg-violet-500/15 text-violet-600 dark:text-violet-400'
                                : category === 'doc'
                                ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                                : category === 'sheet'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {category === 'pdf' ? (
                              'PDF'
                            ) : category === 'image' ? (
                              <ImageIcon className="h-4 w-4" />
                            ) : (
                              <File className="h-4 w-4" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate max-w-[140px] sm:max-w-[170px]" title={att.name}>
                              {att.name}
                            </p>
                            <p className="text-[10px] font-mono text-muted-foreground">
                              {formatFileSize(att.size)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          {att.base64 && (
                            <button
                              type="button"
                              onClick={() => handleDownloadAttachmentItem(att)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                              title="Download file"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Remove attachment"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* STEP 5: Sender Sign-off & Footer */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Sender Sign-off &amp; Footer</span>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">Step 5 of 5</span>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Sign-off Sender Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="PGT Global Network Team"
                    className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Sender Designation / Role
                  </label>
                  <input
                    type="text"
                    value={senderRole}
                    onChange={(e) => setSenderRole(e.target.value)}
                    placeholder="Executive Office & Secretariat"
                    className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="PGT Global Network"
                    className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    value={officialWebsiteUrl}
                    onChange={(e) => setOfficialWebsiteUrl(e.target.value)}
                    placeholder="https://www.pgtglobalnetwork.com/"
                    className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Corporate Footer Note / Disclaimer
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    Appears in bottom footer box of email
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={footerNote}
                  onChange={(e) => setFooterNote(e.target.value)}
                  placeholder="PGT Global Network. Official executive communication. Confidential and privileged."
                  className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Action Bar Below Composer */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleResetFields}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors admin-btn-press"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Fields</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetName = recipientMode === 'single' ? recipientName.trim() : (parsedBatchRecipients[0]?.name || '');
                  const rendered = generateEmailHtml(targetName);
                  navigator.clipboard.writeText(rendered);
                  toast.success('Corporate Email HTML copied to clipboard!', { duration: 2000 });
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors admin-btn-press"
                title="Copy the rendered HTML email code to clipboard"
              >
                <Copy className="h-3.5 w-3.5 text-indigo-500" />
                <span>Copy HTML</span>
              </button>

              <button
                type="button"
                onClick={handleSendTestCopy}
                disabled={isSendingTest || isDispatching}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50 admin-btn-press"
              >
                <Send className="h-3.5 w-3.5 text-indigo-500" />
                <span>{isSendingTest ? 'Sending...' : 'Send Test Copy'}</span>
              </button>
            </div>

            <button
              type="button"
              disabled={isDispatching || (recipientMode === 'batch' && parsedBatchRecipients.length === 0)}
              onClick={recipientMode === 'single' ? handleDispatchSingle : handleDispatchBatch}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-primary px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:pointer-events-none admin-btn-press"
            >
              <Send className="h-4 w-4" />
              <span>
                {isDispatching
                  ? 'Dispatching...'
                  : recipientMode === 'single'
                  ? 'Dispatch Email'
                  : `Dispatch Batch (${parsedBatchRecipients.length} Individual Emails)`}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Dual Real-Time Device Simulator */}
        <div className="lg:col-span-5 sticky top-24 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Live Preview Frame
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                Real-time HTML
              </span>
            </div>

            {/* Laptop vs Mobile Toggle */}
            <div className="flex items-center space-x-1 p-0.5 rounded-xl bg-muted/60 border border-border/70">
              <button
                type="button"
                onClick={() => setPreviewDevice('laptop')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  previewDevice === 'laptop'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Laptop className="h-3.5 w-3.5" />
                <span>Laptop View</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  previewDevice === 'mobile'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Mobile View</span>
              </button>
            </div>
          </div>

          {/* Simulator Container */}
          {previewDevice === 'laptop' ? (
            /* Laptop macOS Browser Window Frame */
            <div className="rounded-2xl border border-border/90 bg-card overflow-hidden shadow-lg transition-all">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-3.5 py-2.5">
                <div className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                </div>
                <div className="flex-1 max-w-[240px] mx-auto">
                  <div className="rounded-md bg-background/80 border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground text-center font-mono truncate">
                    mail.pgtglobalnetwork.com/preview
                  </div>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">100%</span>
              </div>

              {/* Scrollable Email Canvas */}
              <div className="bg-slate-100/90 dark:bg-slate-900/70 p-5 max-h-[620px] overflow-y-auto">
                <div className="mx-auto max-w-[440px] rounded-2xl bg-white text-slate-900 shadow-md border border-slate-200/90 overflow-hidden font-sans text-xs">
                  {/* Top Gradient Accent Line */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />

                  {/* Header: Centered Official Logo */}
                  <div className="p-6 border-b border-slate-100 text-center flex justify-center items-center bg-slate-50/40">
                    <img
                      src="/PGT New Logo Transparent.png"
                      alt="PGT Global Network"
                      className="h-10 w-auto object-contain mx-auto"
                    />
                  </div>

                  {/* Headline Banner (Invisible if empty) */}
                  {headline.trim() && (
                    <div className="px-6 pt-5 text-center">
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug tracking-tight">
                        {headline.trim()}
                      </h3>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6 space-y-3.5 leading-relaxed text-slate-700">
                    {recipientMode === 'single' && recipientName.trim() && (
                      <p className="font-bold text-slate-900 text-[13px]">
                        Dear {recipientName.trim()},
                      </p>
                    )}

                    {recipientMode === 'batch' && parsedBatchRecipients.length > 0 && parsedBatchRecipients[0].name?.trim() && (
                      <p className="font-bold text-slate-900 text-[13px]">
                        Dear {parsedBatchRecipients[0].name.trim()},
                      </p>
                    )}

                    {bodyParagraphs.trim() && (
                      bodyParagraphs
                        .split(/\n\s*\n/)
                        .filter(Boolean)
                        .map((para, idx) => (
                          <div key={idx} className="leading-relaxed text-[12.5px] text-slate-700">
                            {para.split('\n').map((line, lIdx) => {
                              const trimmed = line.trim();
                              if (/^[-*•]\s+/.test(trimmed)) {
                                return (
                                  <li key={lIdx} className="ml-4 list-disc text-slate-700 my-0.5">
                                    {trimmed.replace(/^[-*•]\s+/, '')}
                                  </li>
                                );
                              }
                              return <p key={lIdx} className="my-1">{line}</p>;
                            })}
                          </div>
                        ))
                    )}

                    {/* CTA Button (Invisible if either ctaText or ctaUrl is empty) */}
                    {ctaText.trim() && ctaUrl.trim() && (
                      <div className="pt-3 pb-1 text-center">
                        <span className="inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25">
                          {ctaText.trim()} &nbsp;&rarr;
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1.5 truncate text-center">
                          Direct link: <span className="text-indigo-600 underline">{ctaUrl.trim()}</span>
                        </p>
                      </div>
                    )}

                    {/* Attached Documents (Invisible if no attachments) */}
                    {attachments.length > 0 && (
                      <div className="my-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-slate-700">
                        <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                          <Paperclip className="h-3.5 w-3.5 text-indigo-600" />
                          <span>Attachments ({attachments.length})</span>
                        </div>
                        <div className="space-y-1.5">
                          {attachments.map((att) => (
                            <div
                              key={att.id}
                              className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-white border border-slate-200 text-[11.5px]"
                            >
                              <span className="font-semibold text-slate-800 truncate max-w-[210px]" title={att.name}>
                                {att.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">{formatFileSize(att.size)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sign-off (Invisible if all sign-off fields are empty) */}
                    {(senderName.trim() || senderRole.trim() || companyName.trim() || officialWebsiteUrl.trim()) && (
                      <div className="pt-5 border-t border-slate-100 space-y-0.5 text-slate-600">
                        <div className="border-l-[3px] border-indigo-500 pl-3.5 space-y-0.5">
                          <p className="text-xs text-slate-400">With regards,</p>
                          {senderName.trim() && <p className="font-bold text-slate-900 text-sm">{senderName.trim()}</p>}
                          {senderRole.trim() && <p className="text-xs font-semibold text-indigo-600">{senderRole.trim()}</p>}
                          {companyName.trim() && <p className="text-xs text-slate-600">{companyName.trim()}</p>}
                          {officialWebsiteUrl.trim() && (
                            <p className="pt-0.5">
                              <a
                                href={officialWebsiteUrl.startsWith('http') ? officialWebsiteUrl : `https://${officialWebsiteUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-indigo-600 hover:underline inline-block"
                              >
                                {officialWebsiteUrl.trim().replace(/^https?:\/\//i, '')}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Box (Invisible empty notes) */}
                  <div className="bg-slate-50/80 p-4 border-t border-slate-100 text-center text-[10px] text-slate-400 space-y-1">
                    <p className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                      PGT GLOBAL NETWORK
                    </p>
                    <p>&copy; {new Date().getFullYear()}{companyName.trim() ? ` ${companyName.trim()}` : ''}. All rights reserved.</p>
                    {footerNote.trim() && (
                      <p className="text-[9px] leading-tight text-slate-400">
                        {footerNote.trim()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Smartphone Frame */
            <div className="mx-auto w-[290px] sm:w-[320px] rounded-[38px] border-[6px] border-slate-800 bg-slate-900 shadow-2xl p-2 transition-all">
              {/* Speaker Notch */}
              <div className="flex justify-center mb-1">
                <div className="h-3 w-20 rounded-full bg-slate-800 flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700 mr-2" />
                  <span className="h-1 w-6 rounded-full bg-slate-700" />
                </div>
              </div>

              {/* Phone Screen Canvas */}
              <div className="rounded-[26px] bg-slate-100 dark:bg-slate-900 overflow-hidden max-h-[580px] overflow-y-auto">
                <div className="bg-white text-slate-900 font-sans text-[11px] p-4 space-y-3">
                  {/* Top Gradient */}
                  <div className="h-1.5 -mx-4 -mt-4 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />

                  {/* Header: Centered Official Logo */}
                  <div className="border-b border-slate-100 pb-3 pt-2 text-center flex justify-center bg-slate-50/40 -mx-4 px-4">
                    <img
                      src="/PGT New Logo Transparent.png"
                      alt="PGT Global Network"
                      className="h-8 w-auto object-contain mx-auto"
                    />
                  </div>

                  {/* Headline Banner (Invisible if empty) */}
                  {headline.trim() && (
                    <h4 className="font-extrabold text-slate-900 text-xs leading-snug text-center pt-1">
                      {headline.trim()}
                    </h4>
                  )}

                  {recipientMode === 'single' && recipientName.trim() && (
                    <p className="font-bold text-slate-900 text-xs">
                      Dear {recipientName.trim()},
                    </p>
                  )}

                  {recipientMode === 'batch' && parsedBatchRecipients.length > 0 && parsedBatchRecipients[0].name?.trim() && (
                    <p className="font-bold text-slate-900 text-xs">
                      Dear {parsedBatchRecipients[0].name.trim()},
                    </p>
                  )}

                  {bodyParagraphs.trim() && (
                    bodyParagraphs
                      .split(/\n\s*\n/)
                      .filter(Boolean)
                      .map((p, i) => (
                        <div key={i} className="text-slate-700 leading-relaxed text-[11px]">
                          {p.split('\n').map((line, lIdx) => {
                            const trimmed = line.trim();
                            if (/^[-*•]\s+/.test(trimmed)) {
                              return (
                                <li key={lIdx} className="ml-3 list-disc text-slate-700 my-0.5">
                                  {trimmed.replace(/^[-*•]\s+/, '')}
                                </li>
                              );
                            }
                            return <p key={lIdx} className="my-0.5">{line}</p>;
                          })}
                        </div>
                      ))
                  )}

                  {/* CTA Button (Invisible if empty) */}
                  {ctaText.trim() && ctaUrl.trim() && (
                    <div className="pt-2 pb-1 text-center">
                      <span className="inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-[10.5px] font-bold text-white shadow-xs">
                        {ctaText.trim()} &nbsp;&rarr;
                      </span>
                    </div>
                  )}

                  {/* Attachments for mobile frame */}
                  {attachments.length > 0 && (
                    <div className="my-2 rounded-lg border border-slate-200 bg-slate-50/80 p-2 text-slate-700">
                      <div className="flex items-center space-x-1 text-[9.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        <Paperclip className="h-3 w-3 text-indigo-600" />
                        <span>Attachments ({attachments.length})</span>
                      </div>
                      <div className="space-y-1">
                        {attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between py-0.5 px-1.5 rounded bg-white border border-slate-200 text-[10px]"
                          >
                            <span className="font-semibold text-slate-800 truncate max-w-[140px]" title={att.name}>
                              {att.name}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">{formatFileSize(att.size)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sign-off (Invisible if empty) */}
                  {(senderName.trim() || senderRole.trim() || companyName.trim() || officialWebsiteUrl.trim()) && (
                    <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-600 space-y-0.5">
                      <div className="border-l-2 border-indigo-500 pl-2 space-y-0.5">
                        <p className="text-[9px] text-slate-400">With regards,</p>
                        {senderName.trim() && <p className="font-bold text-slate-900 text-xs">{senderName.trim()}</p>}
                        {senderRole.trim() && <p className="text-[9px] font-semibold text-indigo-600">{senderRole.trim()}</p>}
                        {companyName.trim() && <p className="text-[9px] text-slate-600">{companyName.trim()}</p>}
                        {officialWebsiteUrl.trim() && (
                          <p className="pt-0.5">
                            <a
                              href={officialWebsiteUrl.startsWith('http') ? officialWebsiteUrl : `https://${officialWebsiteUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] font-medium text-indigo-600 hover:underline block"
                            >
                              {officialWebsiteUrl.trim().replace(/^https?:\/\//i, '')}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer Box */}
                  <div className="bg-slate-50 -mx-4 -mb-4 p-3 text-center text-[8.5px] text-slate-400 border-t border-slate-100 space-y-0.5">
                    <p className="font-semibold text-slate-500 uppercase text-[8px] tracking-wider">
                      PGT GLOBAL NETWORK
                    </p>
                    <p>&copy; {new Date().getFullYear()}{companyName.trim() ? ` ${companyName.trim()}` : ''}</p>
                    {footerNote.trim() && (
                      <p className="text-[8px] text-slate-400">{footerNote.trim()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OUTGOING AUDIT LOGS VAULT */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Recent Outgoing Email Dispatches
            </h3>
            <span className="text-xs font-semibold text-muted-foreground">
              ({logs.length} logged)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search filter */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={logsSearch}
                onChange={(e) => setLogsSearch(e.target.value)}
                placeholder="Filter dispatches..."
                className="rounded-xl border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 w-36 sm:w-48"
              />
            </div>

            {/* Refresh button */}
            <button
              onClick={loadLogs}
              disabled={isLogsLoading}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors admin-btn-press"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLogsLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Logs</span>
            </button>
          </div>
        </div>

        {/* Supabase Cloud Sync Status Banner */}
        {dbSyncPending && (
          <div className="mx-4 sm:mx-5 my-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 sm:p-4 text-xs text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center space-x-2.5">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-400">
                  Logs Active in Local Vault • Remote Supabase Cloud Sync Pending
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Your dispatched emails and attachments are safely logged in this browser. To permanently sync dispatches across all team devices, run the one-time SQL setup in your Supabase SQL Editor.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopySetupSql}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-xs admin-btn-press"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{copiedSetupSql ? 'SQL Copied!' : 'Copy Supabase SQL'}</span>
            </button>
          </div>
        )}

        {/* Logs Content */}
        {isLogsLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
            <span>Loading outgoing audit logs...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
              <Mail className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-foreground">No Sent Emails Yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              Any email you dispatch via the Executive Email Studio will be permanently logged here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/70 bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Dispatched (IST)</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Subject &amp; Template</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredLogs.map((log) => {
                  const isExpanded = selectedAuditLog?.id === log.id;
                  const isInlineDeleting = inlineDeleteId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => setSelectedAuditLog(isExpanded ? null : log)}
                        className={`group cursor-pointer transition-colors ${
                          isExpanded
                            ? 'bg-indigo-500/10 dark:bg-indigo-950/30'
                            : 'hover:bg-muted/40'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180 text-primary' : ''}`}>
                              <ChevronDown className="h-3.5 w-3.5" />
                            </span>
                            <span>{formatIST(log.created_at)}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-foreground">{log.recipient_name || 'Recipient'}</p>
                          <p className="font-mono text-[11px] text-primary">{log.recipient_email}</p>
                          {log.cc && (
                            <p className="text-[10px] text-muted-foreground truncate max-w-xs mt-0.5">
                              <span className="font-semibold text-foreground/70">CC:</span> {log.cc}
                            </p>
                          )}
                          {log.bcc && (
                            <p className="text-[10px] text-muted-foreground truncate max-w-xs mt-0.5">
                              <span className="font-semibold text-foreground/70">BCC:</span> {log.bcc}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-foreground truncate max-w-xs">{log.subject}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-medium">
                              {log.template_used || 'Email'}
                            </span>
                            {log.attachments && log.attachments.length > 0 && (
                              <span
                                className="inline-flex items-center gap-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold"
                                title={`${log.attachments.length} file(s) attached`}
                              >
                                <Paperclip className="h-2.5 w-2.5" />
                                <span>{log.attachments.length} {log.attachments.length === 1 ? 'file' : 'files'}</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{log.status || 'Delivered'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div
                            className="inline-flex items-center space-x-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isInlineDeleting ? (
                              <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-xl animate-in fade-in duration-150">
                                <span className="text-[10px] font-bold text-red-500">Delete?</span>
                                <button
                                  type="button"
                                  onClick={(e) => handleExecuteDelete(log.id, e)}
                                  disabled={isDeletingId === log.id}
                                  className="px-2 py-0.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold transition-all disabled:opacity-50"
                                >
                                  {isDeletingId === log.id ? '...' : 'Yes'}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInlineDeleteId(null);
                                  }}
                                  className="px-2 py-0.5 rounded-lg border border-border bg-card text-[10px] text-muted-foreground hover:text-foreground"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setSelectedAuditLog(isExpanded ? null : log)}
                                  className={`inline-flex h-7 px-2.5 items-center gap-1 rounded-lg border text-xs font-semibold transition-colors ${
                                    isExpanded
                                      ? 'bg-primary text-primary-foreground border-primary'
                                      : 'border-border bg-card text-foreground hover:bg-muted'
                                  }`}
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="h-3.5 w-3.5" />
                                      <span>Collapse</span>
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-3.5 w-3.5 text-primary" />
                                      <span>Inspect</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInlineDeleteId(log.id);
                                  }}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                  title="Delete log"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* INLINE EXPANDABLE AUDIT DRAWER (Zero full-screen blocking) */}
                      {isExpanded && (
                        <tr key={`expanded-row-${log.id}`} className="bg-muted/15">
                          <td colSpan={5} className="p-3 sm:p-5">
                            <div className="rounded-2xl border border-border/90 bg-card shadow-md overflow-hidden animate-in slide-in-from-top-2 duration-200">
                              {/* Drawer Header Strip */}
                              <div className="p-4 border-b border-border/70 flex flex-wrap items-center justify-between gap-3 bg-muted/30">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-sm font-bold text-foreground">
                                      Dispatched Email Audit Dossier
                                    </h4>
                                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                      {log.status || 'Delivered'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                                    {log.recipient_name} &lt;{log.recipient_email}&gt; • {formatIST(log.created_at)}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setSelectedAuditLog(null)}
                                  className="inline-flex items-center space-x-1 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                                >
                                  <ChevronUp className="h-3.5 w-3.5" />
                                  <span>Close Audit</span>
                                </button>
                              </div>

                              {/* 3-Tab Selector */}
                              <div className="flex border-b border-border/70 px-4 pt-2 bg-muted/10 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setAuditTab('visual')}
                                  className={`py-2 px-3 text-xs font-bold border-b-2 transition-all ${
                                    auditTab === 'visual'
                                      ? 'border-primary text-primary'
                                      : 'border-transparent text-muted-foreground hover:text-foreground'
                                  }`}
                                >
                                  1. Visual Email Preview
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAuditTab('fields')}
                                  className={`py-2 px-3 text-xs font-bold border-b-2 transition-all ${
                                    auditTab === 'fields'
                                      ? 'border-primary text-primary'
                                      : 'border-transparent text-muted-foreground hover:text-foreground'
                                  }`}
                                >
                                  2. Fields &amp; Message Content
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAuditTab('raw')}
                                  className={`py-2 px-3 text-xs font-bold border-b-2 transition-all ${
                                    auditTab === 'raw'
                                      ? 'border-primary text-primary'
                                      : 'border-transparent text-muted-foreground hover:text-foreground'
                                  }`}
                                >
                                  3. Raw Database Audit
                                </button>
                              </div>

                              {/* Drawer Body Content */}
                              <div className="p-4 sm:p-5 space-y-4">
                                {auditTab === 'visual' && (
                                  <div className="space-y-3">
                                    <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-xs space-y-1.5">
                                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">To:</span>
                                          <span className="font-bold text-foreground">{log.recipient_name}</span>
                                          <span className="font-mono text-primary text-[11px]">&lt;{log.recipient_email}&gt;</span>
                                        </div>
                                        <span className="font-mono text-[10px] text-muted-foreground">
                                          ID: {log.provider_message_id || '—'}
                                        </span>
                                      </div>

                                      {(log.cc || log.bcc) && (
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-0.5">
                                          {log.cc && (
                                            <div className="flex items-center space-x-1.5 text-[11px]">
                                              <span className="font-bold text-muted-foreground">CC:</span>
                                              <span className="font-mono text-foreground">{log.cc}</span>
                                              <button
                                                type="button"
                                                onClick={() => handleCopy(log.cc!, 'vis_cc')}
                                                className="text-muted-foreground hover:text-foreground p-0.5"
                                                title="Copy CC"
                                              >
                                                {copiedAuditField === 'vis_cc' ? (
                                                  <Check className="h-3 w-3 text-emerald-500" />
                                                ) : (
                                                  <Copy className="h-3 w-3" />
                                                )}
                                              </button>
                                            </div>
                                          )}
                                          {log.bcc && (
                                            <div className="flex items-center space-x-1.5 text-[11px]">
                                              <span className="font-bold text-muted-foreground">BCC:</span>
                                              <span className="font-mono text-foreground">{log.bcc}</span>
                                              <button
                                                type="button"
                                                onClick={() => handleCopy(log.bcc!, 'vis_bcc')}
                                                className="text-muted-foreground hover:text-foreground p-0.5"
                                                title="Copy BCC"
                                              >
                                                {copiedAuditField === 'vis_bcc' ? (
                                                  <Check className="h-3 w-3 text-emerald-500" />
                                                ) : (
                                                  <Copy className="h-3 w-3" />
                                                )}
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {/* Visual Attachments Quick Access Bar */}
                                    {log.attachments && log.attachments.length > 0 && (
                                      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center space-x-1.5">
                                            <Paperclip className="h-3.5 w-3.5 text-indigo-500" />
                                            <span className="text-[11px] font-bold text-foreground">
                                              Dispatched Files ({log.attachments.length})
                                            </span>
                                          </div>
                                          <span className="text-[10px] text-muted-foreground font-mono">
                                            {formatFileSize(log.attachments.reduce((sum, item) => sum + (item.size || 0), 0))}
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {log.attachments.map((att, idx) => {
                                            const cat = getAttachmentFileCategory(att.name, att.type);
                                            return (
                                              <div
                                                key={att.id || `vis-att-${idx}`}
                                                className="inline-flex items-center space-x-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-2xs hover:border-primary/40 transition-colors"
                                              >
                                                <div
                                                  className={`h-5 w-5 rounded flex items-center justify-center shrink-0 ${
                                                    cat === 'pdf'
                                                      ? 'text-red-500 bg-red-500/10'
                                                      : cat === 'doc'
                                                      ? 'text-blue-500 bg-blue-500/10'
                                                      : cat === 'sheet'
                                                      ? 'text-emerald-500 bg-emerald-500/10'
                                                      : cat === 'image'
                                                      ? 'text-amber-500 bg-amber-500/10'
                                                      : 'text-indigo-500 bg-indigo-500/10'
                                                  }`}
                                                >
                                                  {cat === 'image' ? (
                                                    <ImageIcon className="h-3 w-3" />
                                                  ) : (
                                                    <FileText className="h-3 w-3" />
                                                  )}
                                                </div>
                                                <span className="font-semibold text-foreground max-w-[140px] truncate" title={att.name}>
                                                  {att.name}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-mono">
                                                  ({formatFileSize(att.size)})
                                                </span>
                                                <button
                                                  type="button"
                                                  onClick={() => handleDownloadAttachmentItem(att)}
                                                  className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted"
                                                  title={`Download ${att.name}`}
                                                >
                                                  <Download className="h-3.5 w-3.5" />
                                                </button>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}

                                    <div className="rounded-xl border border-border bg-slate-100 dark:bg-slate-900 p-3 sm:p-4">
                                      {log.rendered_html ? (
                                        <iframe
                                          srcDoc={log.rendered_html}
                                          title="Delivered Email"
                                          className="w-full min-h-[420px] rounded-lg bg-white border border-slate-200"
                                        />
                                      ) : (
                                        <div className="p-8 text-center text-xs text-muted-foreground">
                                          No cached visual HTML for this log.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {auditTab === 'fields' && (
                                  <div className="space-y-3 text-xs">
                                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                                      <div className="flex justify-between items-center mb-1">
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase">
                                          Subject Line
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopy(log.subject, 'subj')}
                                          className="text-muted-foreground hover:text-foreground"
                                        >
                                          {copiedAuditField === 'subj' ? (
                                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                                          ) : (
                                            <Copy className="h-3.5 w-3.5" />
                                          )}
                                        </button>
                                      </div>
                                      <p className="font-bold text-foreground text-sm">{log.subject}</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase">
                                          Recipient
                                        </span>
                                        <p className="font-semibold text-foreground mt-1">
                                          {log.recipient_name}
                                        </p>
                                        <p className="font-mono text-primary text-[11px]">
                                          {log.recipient_email}
                                        </p>
                                      </div>
                                      <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase">
                                          Template Used
                                        </span>
                                        <p className="font-semibold text-foreground mt-1">
                                          {log.template_used}
                                        </p>
                                        <p className="font-mono text-muted-foreground text-[10px] mt-0.5">
                                          ID: {log.provider_message_id || '—'}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                                      <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase">
                                          Body Content
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopy(log.body_paragraphs, 'body')}
                                          className="text-muted-foreground hover:text-foreground"
                                        >
                                          {copiedAuditField === 'body' ? (
                                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                                          ) : (
                                            <Copy className="h-3.5 w-3.5" />
                                          )}
                                        </button>
                                      </div>
                                      <div className="whitespace-pre-wrap leading-relaxed text-foreground bg-card p-3 rounded-lg border border-border/60">
                                        {log.body_paragraphs}
                                      </div>
                                    </div>

                                    {/* Attached Documents in Fields Tab */}
                                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1.5">
                                          <Paperclip className="h-3.5 w-3.5 text-primary" />
                                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                            Dispatched Attachments ({log.attachments?.length || 0})
                                          </span>
                                        </div>
                                        {log.attachments && log.attachments.length > 0 && (
                                          <span className="text-[10px] text-muted-foreground font-mono">
                                            Total: {formatFileSize(log.attachments.reduce((sum, item) => sum + (item.size || 0), 0))}
                                          </span>
                                        )}
                                      </div>

                                      {log.attachments && log.attachments.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                          {log.attachments.map((att, idx) => {
                                            const cat = getAttachmentFileCategory(att.name, att.type);
                                            return (
                                              <div
                                                key={att.id || `att-${idx}`}
                                                className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-card shadow-2xs hover:border-primary/40 transition-colors"
                                              >
                                                <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                                                  <div
                                                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                      cat === 'pdf'
                                                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                        : cat === 'doc'
                                                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                        : cat === 'sheet'
                                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                        : cat === 'image'
                                                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                        : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                                                    }`}
                                                  >
                                                    {cat === 'image' ? (
                                                      <ImageIcon className="h-4 w-4" />
                                                    ) : (
                                                      <FileText className="h-4 w-4" />
                                                    )}
                                                  </div>
                                                  <div className="min-w-0">
                                                    <p className="font-semibold text-foreground text-xs truncate" title={att.name}>
                                                      {att.name}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground font-mono">
                                                      {formatFileSize(att.size)} • {att.type || 'Document'}
                                                    </p>
                                                  </div>
                                                </div>

                                                <button
                                                  type="button"
                                                  onClick={() => handleDownloadAttachmentItem(att)}
                                                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-border bg-background text-[11px] font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-all shrink-0 admin-btn-press shadow-2xs"
                                                  title={`Download ${att.name}`}
                                                >
                                                  <Download className="h-3 w-3" />
                                                  <span>Download</span>
                                                </button>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-muted-foreground italic py-1">
                                          No documents or files were attached to this email.
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {auditTab === 'raw' && (
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-muted-foreground font-mono">
                                        Database Payload JSON (Supabase &amp; Vault)
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCopy(JSON.stringify(log, null, 2), 'rawJson')
                                        }
                                        className="inline-flex items-center space-x-1 text-xs text-primary hover:underline"
                                      >
                                        {copiedAuditField === 'rawJson' ? (
                                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                                        ) : (
                                          <Copy className="h-3.5 w-3.5" />
                                        )}
                                        <span>Copy Raw JSON</span>
                                      </button>
                                    </div>
                                    <pre className="rounded-xl border border-border bg-muted/60 p-4 text-[11px] font-mono text-foreground overflow-x-auto max-h-[320px]">
                                      {JSON.stringify(log, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>

                              {/* Drawer Footer Actions */}
                              <div className="p-3.5 border-t border-border/70 flex items-center justify-between gap-3 bg-muted/20">
                                <div className="flex items-center space-x-2">
                                  {isInlineDeleting ? (
                                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-xl animate-in fade-in duration-150">
                                      <span className="text-xs font-bold text-red-500">Permanently delete?</span>
                                      <button
                                        type="button"
                                        onClick={(e) => handleExecuteDelete(log.id, e)}
                                        disabled={isDeletingId === log.id}
                                        className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all disabled:opacity-50"
                                      >
                                        {isDeletingId === log.id ? 'Deleting...' : 'Yes, Delete'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setInlineDeleteId(null);
                                        }}
                                        className="px-2 py-1 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-foreground"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setInlineDeleteId(log.id);
                                      }}
                                      className="inline-flex items-center space-x-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                      <span>Delete Log</span>
                                    </button>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setSelectedAuditLog(null)}
                                  className="rounded-xl border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                                >
                                  Collapse View
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EMAIL DELIVERY ENGINE SETTINGS MODAL */}
      {isProviderSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in-50 duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-border/70 pb-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Email Delivery Engine Settings</h3>
                  <p className="text-xs text-muted-foreground">Configure your Resend API Key for live inbox delivery</p>
                </div>
              </div>
              <button
                onClick={() => setIsProviderSettingsOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  Resend API Key (<span className="font-mono text-primary">re_...</span>)
                </label>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="re_123456789abcdef..."
                  className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Your key is securely saved in your browser session. Free API keys are available at{' '}
                  <a
                    href="https://resend.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-semibold"
                  >
                    resend.com
                  </a>
                  . When configured, emails are delivered instantly to real inboxes.
                </p>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  Sender Address (From)
                </label>
                <input
                  type="text"
                  value={tempSenderEmail}
                  onChange={(e) => setTempSenderEmail(e.target.value)}
                  placeholder="PGT Global Network Team <office@pgtglobalnetwork.com>"
                  className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Official verified sender address: <span className="font-mono text-primary">PGT Global Network Team &lt;office@pgtglobalnetwork.com&gt;</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border/70">
              <button
                type="button"
                onClick={() => setIsProviderSettingsOpen(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProviderSettings}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm admin-btn-press"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BATCH PROGRESS MODAL */}
      {batchProgress?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in-50 duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
              <div>
                <h4 className="font-bold text-sm text-foreground">Dispatching Batch Emails...</h4>
                <p className="text-xs text-muted-foreground">
                  Sending 1-to-1 personalized emails to each contact
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground">
                  {batchProgress.current} / {batchProgress.total} (
                  {Math.round((batchProgress.current / batchProgress.total) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.round((batchProgress.current / batchProgress.total) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-mono truncate">
              Current: <span className="text-foreground">{batchProgress.currentRecipient}</span>
            </p>
          </div>
        </div>
      )}

      {/* SAVE CUSTOM TEMPLATE MODAL */}
      {isSavingTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in-50 duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="text-sm font-bold text-foreground">Save as Custom Template</h3>
              <button
                onClick={() => setIsSavingTemplateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. VIP Partner Introduction"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Description / Context
                </label>
                <input
                  type="text"
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  placeholder="e.g. Formal outreach for high-tier enterprise leads"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Attachments notice if any attached */}
              {attachments.length > 0 && (
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 flex items-start gap-2.5">
                  <Paperclip className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-foreground">
                      {attachments.length} attached {attachments.length === 1 ? 'file' : 'files'} included
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Attached documents will be permanently saved with this template and automatically restored when this template is selected.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border/70">
              <button
                type="button"
                onClick={() => setIsSavingTemplateModalOpen(false)}
                className="rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCurrentAsTemplate}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEmailStudio;

