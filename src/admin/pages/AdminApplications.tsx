import React, { useEffect, useState, useMemo } from 'react';
import { JobApplication } from '../types';
import {
  fetchJobApplications,
  updateApplicationStatus,
  deleteJobApplication,
} from '../services/adminDataService';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import {
  Briefcase,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Copy,
  Check,
  Calendar,
  Mail,
  User,
  Phone,
  FileText,
  MapPin,
  GraduationCap,
  Building,
  ExternalLink,
  ArrowLeft,
  X,
  Send,
  AlertCircle,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminApplicationsProps {
  onBackToOverview?: () => void;
  onSendEmail?: (email: string, name: string) => void;
}

export const AdminApplications: React.FC<AdminApplicationsProps> = ({
  onBackToOverview,
  onSendEmail,
}) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsMigration, setNeedsMigration] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Deletion confirmation state
  const [appToDelete, setAppToDelete] = useState<JobApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadApplications = async () => {
    setIsLoading(true);
    const result = await fetchJobApplications();
    setApplications(result.data);
    setNeedsMigration(!!result.needsMigration);
    setIsLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const success = await updateApplicationStatus(id, newStatus);
    if (success) {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
      toast.success(`Application marked as ${newStatus}`);
    } else {
      toast.error('Failed to update status');
    }
  };

  const confirmDeleteAction = async () => {
    if (!appToDelete) return;
    setIsDeleting(true);
    try {
      const success = await deleteJobApplication(appToDelete.id);
      if (success) {
        setApplications((prev) => prev.filter((a) => a.id !== appToDelete.id));
        if (selectedApp?.id === appToDelete.id) {
          setSelectedApp(null);
        }
        toast.success('Application response permanently deleted');
      } else {
        toast.error('Failed to delete application');
      }
    } finally {
      setIsDeleting(false);
      setAppToDelete(null);
    }
  };

  // Distinct position titles
  const positions = useMemo(() => {
    const set = new Set<string>();
    applications.forEach((a) => {
      if (a.position_title) set.add(a.position_title);
    });
    return Array.from(set);
  }, [applications]);

  // Filter applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase().trim();
      const data = (app.applicant_details || app.application_data || {}) as Record<string, any>;
      const candidateName = (data.full_name || '').toLowerCase();
      const candidateEmail = (data.phone_number || '').toLowerCase();
      const candidateRole = (app.position_title || '').toLowerCase();
      const candidateOrg = (data.organization_institution || '').toLowerCase();
      const candidateSkills = (data.skills || '').toLowerCase();

      const matchesSearch =
        !q ||
        candidateName.includes(q) ||
        candidateEmail.includes(q) ||
        candidateRole.includes(q) ||
        candidateOrg.includes(q) ||
        candidateSkills.includes(q);

      const matchesStatus =
        selectedStatus === 'all' || (app.status || 'pending').toLowerCase() === selectedStatus.toLowerCase();

      const matchesPosition =
        selectedPosition === 'all' || app.position_title === selectedPosition;

      return matchesSearch && matchesStatus && matchesPosition;
    });
  }, [applications, searchQuery, selectedStatus, selectedPosition]);

  // Format date helper in IST
  const formatIST = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  // Status badge styling helper
  const getStatusBadge = (status: string = 'pending') => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'reviewed':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-300">
      {/* Top Navigation Breadcrumb */}
      {onBackToOverview && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToOverview}
            className="group inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-purple-500/40 hover:bg-muted/50 transition-all shadow-xs admin-btn-press"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1 text-purple-500" />
            <span>Back to Dashboard</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span>Executive Console</span>
            <span>/</span>
            <span className="text-foreground font-semibold">Career Applications</span>
          </div>
        </div>
      )}

      {/* Main Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-xs flex-shrink-0">
            <Briefcase className="h-5 w-5 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground truncate">
              Career &amp; Team Applications
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
              Inbound job, internship, and core team candidate dossiers from the Careers portal.
            </p>
          </div>
        </div>

        {/* Stats & Refresh */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 self-start sm:self-center">
          <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/40 px-3 py-1.5 sm:px-4 sm:py-2 text-center shadow-xs">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">
              Total
            </span>
            <p className="font-mono font-extrabold text-foreground text-sm sm:text-base mt-0.5">
              {applications.length}
            </p>
          </div>
          <button
            onClick={loadApplications}
            disabled={isLoading}
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border border-border bg-card text-foreground hover:bg-muted transition-colors disabled:opacity-50 admin-btn-press shadow-xs flex-shrink-0"
            title="Refresh Applications"
          >
            <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLoading ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>
      </div>

      {/* Supabase Permissions Notice if DB Needs Setup */}
      {needsMigration && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-xs text-amber-600 dark:text-amber-400">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm">Database Setup Required for Applications</h4>
              <p className="leading-relaxed">
                Run the script at <code className="font-mono bg-black/10 px-1 py-0.5 rounded">supabase/migrations/20260726000010_admin_portal_channels.sql</code> in your Supabase SQL Editor to grant reading and managing permissions on the <code className="font-mono bg-black/10 px-1 py-0.5 rounded">applications</code> table.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, role, skills, college..."
            className="w-full rounded-xl border border-border bg-input pl-10 pr-4 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-border bg-input px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Position Select */}
          {positions.length > 0 && (
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="rounded-xl border border-border bg-input px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Roles</option>
              {positions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground text-sm flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <p>Loading candidate applications from database...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-foreground">No applications found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery || selectedStatus !== 'all' || selectedPosition !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Candidates applying through the Careers page will appear here.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card Feed (Phone / Small Screens) */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredApps.map((app) => {
                const data = (app.applicant_details || app.application_data || {}) as Record<string, any>;
                const resumeLink = app.resume_url || data.resume_url;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="p-3.5 space-y-2.5 transition-colors active:bg-muted/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-xs sm:text-sm truncate">
                          {data.full_name || 'Candidate'}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono truncate">
                          {data.phone_number || data.email || '—'}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize border flex-shrink-0 ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status || 'pending'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="inline-flex items-center rounded-lg bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
                        {app.position_title || 'Position'}
                      </span>
                      {data.organization_institution && (
                        <span className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                          • {data.organization_institution}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-mono">{formatIST(app.created_at)}</span>
                      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                        {resumeLink && (
                          <a
                            href={resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-7 px-2 items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>CV</span>
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="flex h-7 px-2.5 items-center gap-1 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
                        >
                          <Eye className="h-3 w-3 text-primary" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => setAppToDelete(app)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-border/70 bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Role Applied</th>
                    <th className="py-3 px-4">Organization / Institution</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Resume</th>
                    <th className="py-3 px-4">Applied (IST)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredApps.map((app) => {
                    const data = (app.applicant_details || app.application_data || {}) as Record<string, any>;
                    const resumeLink = app.resume_url || data.resume_url;
                    return (
                      <tr
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="group cursor-pointer transition-colors hover:bg-muted/50"
                      >
                        {/* Candidate Name & Contact */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-foreground">
                            {data.full_name || 'Candidate'}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {data.phone_number || '—'}
                          </p>
                        </td>

                        {/* Role Applied */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary border border-primary/20">
                            {app.position_title || 'Position'}
                          </span>
                        </td>

                        {/* Institution / Role */}
                        <td className="py-3.5 px-4 text-xs text-muted-foreground">
                          <p className="font-medium text-foreground truncate max-w-xs">
                            {data.organization_institution || '—'}
                          </p>
                          <p className="text-[11px] truncate max-w-xs">
                            {data.current_role || data.highest_qualification || ''}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${getStatusBadge(
                              app.status
                            )}`}
                          >
                            {app.status || 'pending'}
                          </span>
                        </td>

                        {/* Resume link */}
                        <td className="py-3.5 px-4 text-xs" onClick={(e) => e.stopPropagation()}>
                          {resumeLink ? (
                            <a
                              href={resumeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-primary hover:underline font-medium"
                            >
                              <span>Resume</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>

                        {/* Timestamp */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                          {formatIST(app.created_at)}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                            {/* Inspect */}
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                              title="Inspect Candidate Dossier"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete with Confirmation Modal */}
                            <button
                              onClick={() => setAppToDelete(app)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Delete Application"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Slide-Over Dossier Modal */}
      {selectedApp && (() => {
        const modalData = (selectedApp.applicant_details || selectedApp.application_data || {}) as Record<string, any>;
        const modalResume = selectedApp.resume_url || modalData.resume_url;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 animate-admin-modal-backdrop">
            <div className="h-full w-full max-w-xl border-l border-border bg-card p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-admin-modal-drawer">
              {/* Modal Header */}
              <div>
                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        Candidate Dossier
                      </h3>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {selectedApp.position_title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status Dropdown */}
                    <select
                      value={selectedApp.status || 'pending'}
                      onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadge(
                        selectedApp.status
                      )} bg-card focus:outline-none`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => setSelectedApp(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Dossier Fields */}
                <div className="mt-6 space-y-4 text-xs sm:text-sm">
                  {/* Full Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-primary" />
                          Candidate Name
                        </span>
                        <button
                          onClick={() => handleCopy(modalData.full_name || '', 'cand-name')}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {copiedField === 'cand-name' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <p className="mt-1 font-bold text-foreground">
                        {modalData.full_name || '—'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-primary" />
                          Phone / Contact
                        </span>
                        <button
                          onClick={() => handleCopy(modalData.phone_number || '', 'cand-phone')}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {copiedField === 'cand-phone' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <p className="mt-1 font-mono font-semibold text-foreground">
                        {modalData.phone_number || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Organization & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-primary" />
                        Organization / College
                      </span>
                      <p className="mt-1 font-medium text-foreground">
                        {modalData.organization_institution || '—'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        City & State
                      </span>
                      <p className="mt-1 font-medium text-foreground">
                        {modalData.city_state || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Qualification & Current Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-primary" />
                        Highest Qualification
                      </span>
                      <p className="mt-1 font-medium text-foreground">
                        {modalData.highest_qualification || '—'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-primary" />
                        Current Role
                      </span>
                      <p className="mt-1 font-medium text-foreground">
                        {modalData.current_role || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Resume Button */}
                  {modalResume && (
                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-primary" />
                          Uploaded Resume Attachment
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">
                          {modalResume}
                        </p>
                      </div>
                      <a
                        href={modalResume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>View Resume</span>
                      </a>
                    </div>
                  )}

                  {/* Why Join */}
                  {modalData.why_join && (
                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Why Join Statement
                      </span>
                      <p className="mt-1.5 whitespace-pre-wrap leading-relaxed text-foreground bg-card p-2.5 rounded-lg border border-border/60">
                        {modalData.why_join}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {modalData.skills && (
                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Skills & Expertise
                      </span>
                      <p className="mt-1 text-foreground">
                        {modalData.skills}
                      </p>
                    </div>
                  )}

                  {/* Previous Experience */}
                  {modalData.previous_experience && (
                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Previous Experience
                      </span>
                      <p className="mt-1 text-foreground whitespace-pre-wrap">
                        {modalData.previous_experience}
                      </p>
                    </div>
                  )}

                  {/* Portfolio / Links */}
                  {modalData.portfolio_links && (
                    <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Portfolio / Profiles
                      </span>
                      <p className="mt-1 text-primary font-mono text-xs break-all">
                        {modalData.portfolio_links}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
                <button
                  onClick={() => setAppToDelete(selectedApp)}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Dossier</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    Close
                  </button>
                  {onSendEmail && (modalData.email || selectedApp.email) && (
                    <button
                      onClick={() => {
                        const email = modalData.email || selectedApp.email;
                        const name = modalData.full_name || selectedApp.full_name || 'Candidate';
                        onSendEmail(email, name);
                        setSelectedApp(null);
                      }}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all admin-btn-press"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Reply via Email Studio</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Explicit Confirmation Modal for Deletion */}
      <ConfirmDeleteModal
        isOpen={!!appToDelete}
        title="Delete Candidate Application"
        itemDescription={
          appToDelete
            ? `${(appToDelete.applicant_details?.full_name || appToDelete.application_data?.full_name) || 'Candidate'} — ${appToDelete.position_title}`
            : undefined
        }
        onConfirm={confirmDeleteAction}
        onCancel={() => setAppToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};
