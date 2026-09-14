import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import founderImg from '../../assets/founderImg.jpg';
import {
  fetchContactMessages,
  fetchRegisteredProfiles,
  fetchJobApplications,
  fetchArticles,
  fetchEmailLogs,
} from '../services/adminDataService';
import { ContactMessage, UserProfile, JobApplication, DbArticle } from '../types';
import {
  Inbox,
  Users,
  Briefcase,
  BookOpen,
  Send,
  Mail,
  Shield,
  ArrowUpRight,
  Database,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { AdminTab } from '../types';

interface AdminDashboardProps {
  onNavigateTab?: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { session } = useAdminAuth();

  // Live IST Time states
  const [istTime, setIstTime] = useState<string>('');
  const [istDate, setIstDate] = useState<string>('');
  const [istDay, setIstDay] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setIstDay(
        new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long' }).format(now)
      );
      setIstDate(
        new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' }).format(now)
      );
      setIstTime(
        new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(now)
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [emailsCount, setEmailsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsMigration, setNeedsMigration] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [contactsRes, profilesRes, appsRes, articlesRes, emailsRes] = await Promise.all([
          fetchContactMessages(),
          fetchRegisteredProfiles(),
          fetchJobApplications(),
          fetchArticles(),
          fetchEmailLogs(),
        ]);

        if (isMounted) {
          setContacts(contactsRes.data);
          setProfiles(profilesRes.data);
          setApplications(appsRes.data);
          setArticles(articlesRes.data);
          setEmailsCount(emailsRes.count ?? emailsRes.data.length);
          setNeedsMigration(
            !!contactsRes.needsMigration ||
            !!profilesRes.needsMigration ||
            !!appsRes.needsMigration ||
            !!articlesRes.needsMigration
          );
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[AdminDashboard] Error loading data:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const unreadContactsCount = contacts.filter((c) => !c.is_read).length;
  const pendingAppsCount = applications.filter((a) => (a.status || 'pending').toLowerCase() === 'pending').length;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Executive Welcome Hero with Founder Photo & Live Clock */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-4 sm:p-8 backdrop-blur-xl shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6">
          {/* Founder Identity Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            {/* Founder Photo with Glowing Ring */}
            <div className="relative self-start sm:self-center flex-shrink-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-amber-400/30 via-indigo-500/30 to-cyan-400/30 blur-md animate-admin-ambient pointer-events-none" />
              <div className="relative h-16 w-16 sm:h-24 sm:w-24 rounded-xl sm:rounded-2xl p-1 bg-gradient-to-br from-amber-400 via-indigo-500 to-cyan-400 shadow-xl shadow-amber-500/10">
                <img
                  src={founderImg}
                  alt="Pranav, Founder & CEO"
                  className="h-full w-full rounded-[10px] sm:rounded-[14px] object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-emerald-500 border-2 border-card"></span>
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold text-amber-500 border border-amber-500/20 mb-1.5 sm:mb-2">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Founder &amp; CEO Executive Suite</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Pranav, Founder &amp; CEO
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                Centralized administrative console for PGT Global Network. Click any card below to open its dedicated inspection portal.
              </p>
            </div>
          </div>

          {/* Live Date, Day, Time & Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 w-full sm:w-auto">
            {/* Live IST Box with Day, Date & Seconds */}
            <div className="w-full sm:w-auto rounded-xl border border-border/80 bg-card/80 p-2.5 sm:p-3 shadow-sm backdrop-blur-md">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="font-semibold text-foreground">{istDay},</span>
                <span className="truncate">{istDate}</span>
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-500 animate-pulse flex-shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">IST</span>
                <span className="font-mono text-sm sm:text-base font-bold tracking-wider text-foreground">
                  {istTime || 'Loading...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Section 2: System Health & Diagnostics Panel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            System Infrastructure &amp; Connectivity
          </span>
          <span className="text-[10px] font-mono text-emerald-500 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            All Nodes Active
          </span>
        </div>

        {/* System Health / Status Bar (Directly below Founder Info Card) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 rounded-2xl border border-border/90 bg-muted/40 dark:bg-muted/15 p-2 sm:p-3 shadow-sm">
          <div className="flex items-center space-x-2 sm:space-x-3 rounded-xl border border-border/80 bg-card p-2 sm:p-3 text-xs shadow-xs min-w-0">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[11px] text-muted-foreground uppercase font-semibold tracking-wider truncate">Portal Status</p>
              <p className="font-bold text-foreground text-xs sm:text-sm truncate">Operational</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 rounded-xl border border-border/80 bg-card p-2 sm:p-3 text-xs shadow-xs min-w-0">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Database className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[11px] text-muted-foreground uppercase font-semibold tracking-wider truncate">Database</p>
              <p className="font-bold text-foreground text-xs sm:text-sm truncate">Supabase Active</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 rounded-xl border border-border/80 bg-card p-2 sm:p-3 text-xs shadow-xs min-w-0">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[11px] text-muted-foreground uppercase font-semibold tracking-wider truncate">Security</p>
              <p className="font-bold text-foreground text-xs sm:text-sm truncate">Stealth / 256-bit</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 rounded-xl border border-border/80 bg-card p-2 sm:p-3 text-xs shadow-xs min-w-0">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[11px] text-muted-foreground uppercase font-semibold tracking-wider truncate">Session</p>
              <p className="font-bold text-foreground text-xs sm:text-sm truncate">Active (7 Days)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Horizontal Section Divider Line */}
      <div className="w-full border-t-2 border-neutral-300 dark:border-neutral-700/80 my-4" />

      {/* Supabase Permissions Notice if DB Needs Migration */}
      {needsMigration && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-xs text-amber-600 dark:text-amber-400">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm">Supabase Database Setup Required for Live Data</h4>
              <p className="leading-relaxed">
                Supabase Row Level Security (RLS) is active and restricting client reads on <code className="font-mono bg-black/10 px-1 py-0.5 rounded">contact_messages</code>, <code className="font-mono bg-black/10 px-1 py-0.5 rounded">applications</code>, or <code className="font-mono bg-black/10 px-1 py-0.5 rounded">profiles</code>.
                Execute the migration in your Supabase SQL Editor:
                <span className="block mt-1 font-mono bg-black/15 p-2 rounded text-[11px] text-foreground select-all">
                  supabase/migrations/20260726000010_admin_portal_channels.sql
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Distinct Main Controlling System Panel Enclosure */}
      <section className="rounded-2xl sm:rounded-3xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-900/40 p-3.5 sm:p-7 shadow-sm space-y-4 sm:space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 border-b-2 border-neutral-300 dark:border-neutral-700/80 pb-3 sm:pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-primary border border-primary/20 mb-1 sm:mb-1.5">
              <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Core Controlling Channels</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
              Executive Command Center
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md sm:text-right font-medium">
            Tap any channel card below to open its dedicated inspection portal, inspect database records, or safe-delete entries.
          </p>
        </div>

        {/* Primary Channel Cards (Click opens full page) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Card 1: Registered Users */}
          <div
            onClick={() => onNavigateTab?.('profiles')}
            className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 bg-card p-4 sm:p-5 shadow-sm admin-card-hover animate-admin-card stagger-1 active:scale-[0.98] hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition-transform duration-300 ease-out">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                <span>Inspect</span>
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-3.5 sm:mt-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Registered Users
                </p>
                <span className="text-[10px] sm:text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  Active DB
                </span>
              </div>
              <h3 className="mt-1 sm:mt-1.5 text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
                {isLoading ? '—' : profiles.length}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                All registered community members, volunteers, and accounts.
              </p>
            </div>
          </div>

          {/* Card 2: Contact Form Responses */}
          <div
            onClick={() => onNavigateTab?.('contacts')}
            className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 bg-card p-4 sm:p-5 shadow-sm admin-card-hover animate-admin-card stagger-2 active:scale-[0.98] hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-300 ease-out">
                <Inbox className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1">
                <span>Inquiries</span>
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-3.5 sm:mt-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Contact Inquiries
                </p>
                {unreadContactsCount > 0 ? (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.2 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                    {unreadContactsCount} New
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Reviewed
                  </span>
                )}
              </div>
              <h3 className="mt-1 sm:mt-1.5 text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
                {isLoading ? '—' : contacts.length}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                Direct inquiries and messages from public Contact Us form.
              </p>
            </div>
          </div>

          {/* Card 3: Career & Team Applications */}
          <div
            onClick={() => onNavigateTab?.('applications')}
            className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 bg-card p-4 sm:p-5 shadow-sm admin-card-hover animate-admin-card stagger-3 active:scale-[0.98] hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform duration-300 ease-out">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center gap-1">
                <span>Applications</span>
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-3.5 sm:mt-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Career &amp; Team
                </p>
                {pendingAppsCount > 0 ? (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.2 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                    {pendingAppsCount} Pending
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Reviewed
                  </span>
                )}
              </div>
              <h3 className="mt-1 sm:mt-1.5 text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
                {isLoading ? '—' : applications.length}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                Candidate dossiers with resumes from the Careers portal.
              </p>
            </div>
          </div>

          {/* Card 4: Articles & Knowledge Hub */}
          <div
            onClick={() => onNavigateTab?.('articles')}
            className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 bg-card p-4 sm:p-5 shadow-sm admin-card-hover animate-admin-card stagger-4 active:scale-[0.98] hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300 ease-out">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                <span>Manage</span>
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-3.5 sm:mt-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Articles &amp; Blog
                </p>
                <span className="text-[10px] sm:text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Hub
                </span>
              </div>
              <h3 className="mt-1 sm:mt-1.5 text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
                {isLoading ? '—' : articles.length}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                Published blog stories, research ideas, and insights.
              </p>
            </div>
          </div>

          {/* Card 5: Executive Email Studio */}
          <div
            onClick={() => onNavigateTab?.('email-studio')}
            className="group relative cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 bg-card p-4 sm:p-5 shadow-sm admin-card-hover animate-admin-card stagger-5 active:scale-[0.98] hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform duration-300 ease-out">
                <Send className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                <span>Compose</span>
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-3.5 sm:mt-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Email Studio
                </p>
                <span className="text-[10px] sm:text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ready
                </span>
              </div>
              <h3 className="mt-1 sm:mt-1.5 text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
                {isLoading ? '—' : emailsCount}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                Corporate HTML mailer, batch mail merge, and audit vault.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
