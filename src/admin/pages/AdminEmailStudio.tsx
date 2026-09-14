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
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import {
  EmailTemplate,
  EmailStudioLog,
} from '../types';
import {
  fetchEmailLogs,
  recordEmailLog,
  deleteEmailLog,
} from '../services/adminDataService';

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

  // Step 4: Sender Sign-off & Footer State (PGT Global Network Executive Office)
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
    return localStorage.getItem('pgt_admin_sender_email') || 'PGT Global Network <onboarding@resend.dev>';
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

  // Custom In-App Delete Confirmation Modal State (Zero browser confirm)
  const [logToDelete, setLogToDelete] = useState<EmailStudioLog | null>(null);

  // Outgoing Email Logs State
  const [logs, setLogs] = useState<EmailStudioLog[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
  const [logsSearch, setLogsSearch] = useState<string>('');
  const [selectedAuditLog, setSelectedAuditLog] = useState<EmailStudioLog | null>(null);
  const [auditTab, setAuditTab] = useState<'visual' | 'fields' | 'raw'>('visual');
  const [copiedAuditField, setCopiedAuditField] = useState<string | null>(null);

  // Load Email Logs
  const loadLogs = async () => {
    setIsLogsLoading(true);
    try {
      const res = await fetchEmailLogs();
      setLogs(res.data);
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
      toast.success('Selected Blank / Custom Email', { duration: 1500 });
      return;
    }

    setSubject(tmpl.subject);
    setHeadline(tmpl.headline);
    setBodyParagraphs(tmpl.body);
    setCtaText(tmpl.ctaText || '');
    setCtaUrl(tmpl.ctaUrl || '');
    toast.success(`Applied template: ${tmpl.name}`, { duration: 1500 });
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
      isCustom: true,
    };

    const updated = [newTmpl, ...customTemplates];
    setCustomTemplates(updated);
    try {
      localStorage.setItem(CUSTOM_TEMPLATES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSelectedTemplateId(newTmpl.id);
    setIsSavingTemplateModalOpen(false);
    setNewTemplateName('');
    setNewTemplateDesc('');
    toast.success(`Saved custom template: ${newTmpl.name}`);
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
    toast.success('Composer fields reset');
  };

  // Premium Corporate HTML Generator (Clean, Top-Tier, No "Official Dispatch" text, Logo Only)
  const generateEmailHtml = (targetName: string, isPreview = false) => {
    const greeting = targetName ? `Dear ${targetName},` : '';
    const rawParagraphs = (bodyParagraphs || (isPreview ? 'Enter your message here...' : ''))
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

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject || 'PGT Global Network Executive Communication'}</title>
</head>
<body style="margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container Card with Subtle Ambient Shadow -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.04), 0 8px 10px -6px rgba(15, 23, 42, 0.02);">
          
          <!-- Top Gradient Accent Line -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #4f46e5 0%, #3b82f6 50%, #06b6d4 100%);"></td>
          </tr>

          <!-- Brand Header (Logo Only - No text, No badge) -->
          <tr>
            <td align="left" style="padding: 34px 40px 22px 40px;">
              <img src="${logoSrc}" alt="PGT Global Network" style="height: 40px; width: auto; max-width: 170px; display: block; border: 0;" />
            </td>
          </tr>

          <!-- Banner / Headline (Optional) -->
          ${
            headline
              ? `<tr>
            <td style="padding: 16px 40px 6px 40px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.35; letter-spacing: -0.3px;">
                ${headline}
              </h1>
            </td>
          </tr>`
              : ''
          }

          <!-- Body Content Area -->
          <tr>
            <td style="padding: ${headline ? '14px' : '22px'} 40px 32px 40px; font-size: 15px; line-height: 1.75; color: #334155;">
              ${
                greeting
                  ? `<p style="margin: 0 0 18px 0; font-weight: 600; color: #0f172a; font-size: 15px;">${greeting}</p>`
                  : ''
              }

              ${formattedParagraphsHtml}

              <!-- Call to Action Button (Optional) -->
              ${
                ctaText && ctaUrl
                  ? `<div style="margin: 30px 0 24px 0; text-align: left;">
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); box-shadow: 0 4px 14px rgba(79, 70, 229, 0.28);">
                      <a href="${ctaUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 13px 30px; display: inline-block; letter-spacing: 0.2px;">
                        ${ctaText} &nbsp;&rarr;
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 12px 0 0 0; font-size: 12px; color: #94a3b8;">
                  Direct Link: <a href="${ctaUrl}" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; text-decoration: underline;">${ctaUrl}</a>
                </p>
              </div>`
                  : ''
              }

              <!-- Executive Sign-off Block -->
              <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                <table border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="border-left: 3px solid #4f46e5; padding-left: 14px;">
                      <p style="margin: 0 0 4px 0; font-size: 13px; color: #64748b;">With regards,</p>
                      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">${senderName || 'PGT Global Network Team'}</p>
                      <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #4f46e5;">${senderRole || 'Executive Office & Secretariat'}</p>
                      <p style="margin: 3px 0 0 0; font-size: 12.5px; color: #64748b;">${companyName || 'PGT Global Network'}</p>
                      ${
                        officialWebsiteUrl
                          ? `<p style="margin: 4px 0 0 0; font-size: 12.5px;"><a href="${officialWebsiteUrl.startsWith('http') ? officialWebsiteUrl : `https://${officialWebsiteUrl}`}" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; text-decoration: underline; font-weight: 500;">${officialWebsiteUrl && !officialWebsiteUrl.includes('pgtglobalnetwork.com') ? officialWebsiteUrl.replace(/^https?:\/\//i, '') : 'www.pgtglobalnetwork.com'}</a></p>`
                          : `<p style="margin: 4px 0 0 0; font-size: 12.5px;"><a href="https://www.pgtglobalnetwork.com/" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; text-decoration: underline; font-weight: 500;">www.pgtglobalnetwork.com</a></p>`
                      }
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Corporate Legal Footer -->
          <tr>
            <td style="padding: 24px 40px 28px 40px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 11px; line-height: 1.6; color: #94a3b8;">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #64748b; font-size: 11px; letter-spacing: 0.5px;">
                PGT GLOBAL NETWORK
              </p>
              <p style="margin: 0 0 4px 0;">
                &copy; ${new Date().getFullYear()} ${companyName || 'PGT Global Network'}. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 10px; color: #94a3b8; max-width: 480px; display: inline-block;">
                ${footerNote || 'PGT Global Network. Official executive communication. Confidential and privileged.'}
              </p>
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
  }): Promise<{ isLive: boolean; messageId: string; error?: string }> => {
    const key = resendApiKey.trim();
    const sender = senderEmailAddress.trim() || 'PGT Global Network <onboarding@resend.dev>';

    // 1. Direct Resend API if API Key is available
    if (key) {
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

        const res = await fetch('https://api.resend.com/emails', {
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
          console.warn('[EmailStudio] Resend API error:', errText);
          return {
            isLive: false,
            messageId: `vault_${Date.now().toString(36)}`,
            error: errText,
          };
        }
      } catch (err: any) {
        console.warn('[EmailStudio] Resend API network error:', err);
      }
    }

    // 2. Supabase Function invoke fallback
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
          },
        },
      });
      if (!error && data?.success) {
        return { isLive: true, messageId: data.messageId || `sb_${Date.now().toString(36)}` };
      }
    } catch {
      // Offline fallback to vault
    }

    // Default: Vault Logged
    return {
      isLive: false,
      messageId: `pgt_vault_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      error: 'Live delivery requires a Resend API Key. Stored in vault.',
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
      });

      const logStatus = delivery.isLive ? 'Delivered (Live)' : 'Logged (Provider Key Pending)';

      await recordEmailLog({
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
        status: logStatus,
        provider_message_id: delivery.messageId,
      });

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
        toast.success(`Email delivered live to ${recipientEmail.trim()}!`, { duration: 3000 });
      } else {
        toast.success('Dispatched & Logged to Vault! Add Resend Key to send live emails.', {
          duration: 4500,
        });
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
      });

      await recordEmailLog({
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
        status: delivery.isLive ? 'Delivered (Live)' : 'Logged (Provider Key Pending)',
        provider_message_id: delivery.messageId,
      });

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
        });

        if (delivery.isLive) liveCount++;

        await recordEmailLog({
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
          status: delivery.isLive ? 'Delivered (Live)' : 'Logged (Provider Key Pending)',
          provider_message_id: delivery.messageId,
        });

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

  // Trigger Custom In-App Delete Confirmation (Zero browser confirm)
  const handleDeleteLogClick = (log: EmailStudioLog, e: React.MouseEvent) => {
    e.stopPropagation();
    setLogToDelete(log);
  };

  // Perform permanent deletion
  const handleConfirmDeleteLog = async () => {
    if (!logToDelete) return;
    const targetId = logToDelete.id;
    try {
      await deleteEmailLog(targetId);
      setLogs((prev) => prev.filter((l) => l.id !== targetId));
      if (selectedAuditLog?.id === targetId) {
        setSelectedAuditLog(null);
      }
      toast.success('Dispatched email log permanently removed');
    } catch (err: any) {
      toast.error('Failed to delete log: ' + err.message);
    } finally {
      setLogToDelete(null);
    }
  };

  // Save Provider Settings
  const handleSaveProviderSettings = () => {
    const cleanKey = tempApiKey.trim();
    const cleanSender = tempSenderEmail.trim() || 'PGT Global Network <onboarding@resend.dev>';
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
              <span className="text-[11px] font-semibold text-muted-foreground">Step 1 of 4</span>
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
                <span className="text-[11px] font-semibold text-muted-foreground">Step 2 of 4</span>
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
              <span className="text-[11px] font-semibold text-muted-foreground">Step 3 of 4</span>
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

          {/* STEP 4: Sender Sign-off & Footer */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Sender Sign-off &amp; Footer</span>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">Step 4 of 4</span>
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
                  <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />

                  {/* Header: Logo Only */}
                  <div className="p-5 border-b border-slate-100 text-left">
                    <img
                      src="/PGT New Logo Transparent.png"
                      alt="PGT Global Network"
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Headline Banner */}
                  {headline && (
                    <div className="px-6 pt-5">
                      <h3 className="text-base font-bold text-slate-900 leading-snug tracking-tight">
                        {headline}
                      </h3>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6 space-y-3.5 leading-relaxed text-slate-700">
                    {recipientMode === 'single' && recipientName.trim() && (
                      <p className="font-semibold text-slate-900 text-[13px]">
                        Dear {recipientName.trim()},
                      </p>
                    )}

                    {recipientMode === 'batch' && parsedBatchRecipients.length > 0 && parsedBatchRecipients[0].name && (
                      <p className="font-semibold text-slate-900 text-[13px]">
                        Dear {parsedBatchRecipients[0].name},
                      </p>
                    )}

                    {bodyParagraphs.trim() ? (
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
                    ) : (
                      <p className="text-slate-400 text-xs italic py-2">
                        Enter your message here...
                      </p>
                    )}

                    {/* CTA Button */}
                    {ctaText && (
                      <div className="pt-2">
                        <span className="inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25">
                          {ctaText} &nbsp;&rarr;
                        </span>
                        {ctaUrl && (
                          <p className="text-[10px] text-slate-400 mt-1 truncate">
                            Direct Link: <span className="text-indigo-600 underline">{ctaUrl}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Sign-off */}
                    <div className="pt-5 border-t border-slate-100 space-y-0.5 text-slate-600">
                      <div className="border-l-2 border-indigo-500 pl-3 space-y-0.5">
                        <p className="text-xs text-slate-400">With regards,</p>
                        <p className="font-bold text-slate-900 text-sm">{senderName}</p>
                        <p className="text-xs font-semibold text-indigo-600">{senderRole}</p>
                        <p className="pt-0.5">
                          <a
                            href="https://www.pgtglobalnetwork.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-indigo-600 hover:underline inline-block"
                          >
                            www.pgtglobalnetwork.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Box */}
                  <div className="bg-slate-50/80 p-4 border-t border-slate-100 text-center text-[10px] text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-500 uppercase text-[9px] tracking-wider">
                      PGT GLOBAL NETWORK &bull; EXECUTIVE CORRESPONDENCE
                    </p>
                    <p>© 2026 {companyName}. All rights reserved.</p>
                    <p className="text-[9px] leading-tight text-slate-400">
                      {footerNote}
                    </p>
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
                  <div className="h-1 -mx-4 -mt-4 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />

                  {/* Header: Logo Only */}
                  <div className="border-b border-slate-100 pb-2.5 pt-1 text-left">
                    <img
                      src="/PGT New Logo Transparent.png"
                      alt="PGT Global Network"
                      className="h-6 w-auto object-contain"
                    />
                  </div>

                  {headline && (
                    <h4 className="font-bold text-slate-900 text-xs leading-snug">
                      {headline}
                    </h4>
                  )}

                  {recipientMode === 'single' && recipientName.trim() && (
                    <p className="font-semibold text-slate-900 text-xs">
                      Dear {recipientName.trim()},
                    </p>
                  )}

                  {recipientMode === 'batch' && parsedBatchRecipients.length > 0 && parsedBatchRecipients[0].name && (
                    <p className="font-semibold text-slate-900 text-xs">
                      Dear {parsedBatchRecipients[0].name},
                    </p>
                  )}

                  {bodyParagraphs.trim() ? (
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
                  ) : (
                    <p className="text-slate-400 text-[10.5px] italic py-1">
                      Enter your message here...
                    </p>
                  )}

                  {ctaText && (
                    <div className="pt-1">
                      <span className="inline-block rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-3.5 py-1.5 text-[10.5px] font-semibold text-white shadow-xs">
                        {ctaText} &nbsp;&rarr;
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-600 space-y-0.5">
                    <div className="border-l-2 border-indigo-500 pl-2 space-y-0.5">
                      <p className="text-[9px] text-slate-400">With regards,</p>
                      <p className="font-bold text-slate-900 text-xs">{senderName}</p>
                      <p className="text-[9px] font-semibold text-indigo-600">{senderRole}</p>
                      <p className="text-[9px] text-slate-600">{companyName}</p>
                      <p className="pt-0.5">
                        <a
                          href="https://www.pgtglobalnetwork.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] font-medium text-indigo-600 hover:underline block"
                        >
                          www.pgtglobalnetwork.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 -mx-4 -mb-4 p-3 text-center text-[8.5px] text-slate-400 border-t border-slate-100 space-y-0.5">
                    <p className="font-semibold text-slate-500 uppercase text-[8px] tracking-wider">
                      PGT GLOBAL NETWORK
                    </p>
                    <p>© 2026 {companyName}</p>
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
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedAuditLog(log)}
                    className="group cursor-pointer hover:bg-muted/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {formatIST(log.created_at)}
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4">
                      <p className="font-semibold text-foreground truncate max-w-xs">{log.subject}</p>
                      <span className="inline-block mt-0.5 rounded bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground font-medium">
                        {log.template_used || 'Email'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{log.status || 'Delivered'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div
                        className="inline-flex items-center space-x-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedAuditLog(log)}
                          className="flex h-7 px-2.5 items-center gap-1 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-primary" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteLogClick(log, e)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete log"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CUSTOM IN-APP DELETE CONFIRMATION MODAL (NO BROWSER POPUPS) */}
      {logToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in-50 duration-150">
          <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-500">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Confirm Permanent Deletion</h3>
                <p className="text-xs text-muted-foreground">This dispatched log record will be permanently erased.</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 text-xs space-y-1.5">
              <p className="text-muted-foreground">Target Recipient:</p>
              <p className="font-bold text-foreground truncate">
                {logToDelete.recipient_name} &lt;{logToDelete.recipient_email}&gt;
              </p>
              <p className="font-semibold text-primary truncate">Subject: {logToDelete.subject}</p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setLogToDelete(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteLog}
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold shadow-sm transition-all admin-btn-press"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

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
                  placeholder="PGT Global Network <onboarding@resend.dev>"
                  className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Default testing address is <span className="font-mono">PGT Global Network &lt;onboarding@resend.dev&gt;</span>. Once you verify your domain, update this to your executive address.
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

      {/* FULL DISPATCHED AUDIT MODAL (3 TABS) */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in-50 duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border/70 flex items-start justify-between gap-3 bg-muted/20">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-foreground">
                    Dispatched Email Audit Dossier
                  </h3>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {selectedAuditLog.status || 'Delivered'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  {selectedAuditLog.recipient_name} &lt;{selectedAuditLog.recipient_email}&gt; •{' '}
                  {formatIST(selectedAuditLog.created_at)}
                </p>
              </div>

              <button
                onClick={() => setSelectedAuditLog(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
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

            {/* Modal Body with Scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {auditTab === 'visual' && (
                <div className="space-y-3">
                  {/* Recipient / CC / BCC Quick Meta Strip */}
                  <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-xs space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">To:</span>
                        <span className="font-bold text-foreground">{selectedAuditLog.recipient_name}</span>
                        <span className="font-mono text-primary text-[11px]">&lt;{selectedAuditLog.recipient_email}&gt;</span>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        ID: {selectedAuditLog.provider_message_id || '—'}
                      </span>
                    </div>

                    {(selectedAuditLog.cc || selectedAuditLog.bcc) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-0.5">
                        {selectedAuditLog.cc && (
                          <div className="flex items-center space-x-1.5 text-[11px]">
                            <span className="font-bold text-muted-foreground">CC:</span>
                            <span className="font-mono text-foreground">{selectedAuditLog.cc}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedAuditLog.cc!, 'vis_cc')}
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
                        {selectedAuditLog.bcc && (
                          <div className="flex items-center space-x-1.5 text-[11px]">
                            <span className="font-bold text-muted-foreground">BCC:</span>
                            <span className="font-mono text-foreground">{selectedAuditLog.bcc}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedAuditLog.bcc!, 'vis_bcc')}
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

                  <div className="rounded-xl border border-border bg-slate-100 dark:bg-slate-900 p-3 sm:p-4">
                    {selectedAuditLog.rendered_html ? (
                      <iframe
                        srcDoc={selectedAuditLog.rendered_html}
                        title="Delivered Email"
                        className="w-full min-h-[460px] rounded-lg bg-white border border-slate-200"
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
                        onClick={() => handleCopy(selectedAuditLog.subject, 'subj')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {copiedAuditField === 'subj' ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="font-bold text-foreground text-sm">{selectedAuditLog.subject}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">
                        Recipient
                      </span>
                      <p className="font-semibold text-foreground mt-1">
                        {selectedAuditLog.recipient_name}
                      </p>
                      <p className="font-mono text-primary text-[11px]">
                        {selectedAuditLog.recipient_email}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">
                        Template Used
                      </span>
                      <p className="font-semibold text-foreground mt-1">
                        {selectedAuditLog.template_used}
                      </p>
                      <p className="font-mono text-muted-foreground text-[10px] mt-0.5">
                        ID: {selectedAuditLog.provider_message_id || '—'}
                      </p>
                    </div>
                  </div>

                  {/* CC and BCC Audit Cards */}
                  {(selectedAuditLog.cc || selectedAuditLog.bcc) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedAuditLog.cc && (
                        <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase">
                              Carbon Copy (CC)
                            </span>
                            <button
                              onClick={() => handleCopy(selectedAuditLog.cc!, 'f_cc')}
                              className="text-muted-foreground hover:text-foreground"
                              title="Copy CC"
                            >
                              {copiedAuditField === 'f_cc' ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <p className="font-mono text-foreground text-[11px] break-all">
                            {selectedAuditLog.cc}
                          </p>
                        </div>
                      )}
                      {selectedAuditLog.bcc && (
                        <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase">
                              Blind Carbon Copy (BCC)
                            </span>
                            <button
                              onClick={() => handleCopy(selectedAuditLog.bcc!, 'f_bcc')}
                              className="text-muted-foreground hover:text-foreground"
                              title="Copy BCC"
                            >
                              {copiedAuditField === 'f_bcc' ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <p className="font-mono text-foreground text-[11px] break-all">
                            {selectedAuditLog.bcc}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">
                        Body Content
                      </span>
                      <button
                        onClick={() => handleCopy(selectedAuditLog.body_paragraphs, 'body')}
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
                      {selectedAuditLog.body_paragraphs}
                    </div>
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
                      onClick={() =>
                        handleCopy(JSON.stringify(selectedAuditLog, null, 2), 'rawJson')
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
                  <pre className="rounded-xl border border-border bg-muted/60 p-4 text-[11px] font-mono text-foreground overflow-x-auto max-h-[360px]">
                    {JSON.stringify(selectedAuditLog, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-border/70 flex items-center justify-between gap-3 bg-muted/20">
              <button
                type="button"
                onClick={(e) => handleDeleteLogClick(selectedAuditLog, e)}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete From Logs</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAuditLog(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmailStudio;
