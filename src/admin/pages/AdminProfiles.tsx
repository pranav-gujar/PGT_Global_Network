import React, { useEffect, useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { fetchRegisteredProfiles } from '../services/adminDataService';
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  Copy,
  Check,
  Calendar,
  Mail,
  User,
  Shield,
  MapPin,
  Globe,
  AlertCircle,
  X,
  ExternalLink,
  Send,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminProfilesProps {
  onBackToOverview?: () => void;
  onSendEmail?: (email: string, name: string) => void;
}

export const AdminProfiles: React.FC<AdminProfilesProps> = ({
  onBackToOverview,
  onSendEmail,
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsMigration, setNeedsMigration] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const loadProfiles = async () => {
    setIsLoading(true);
    const result = await fetchRegisteredProfiles();
    setProfiles(result.data);
    setNeedsMigration(!!result.needsMigration);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((user) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        user.full_name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.location?.toLowerCase().includes(q) ||
        user.role?.toLowerCase().includes(q);

      const matchesRole =
        selectedRole === 'all' || (user.role || 'user').toLowerCase() === selectedRole.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [profiles, searchQuery, selectedRole]);

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
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  // Role badge color helper
  const getRoleBadge = (role: string = 'user') => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'team_member':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'volunteer':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-300">
      {/* Top Navigation Breadcrumb */}
      {onBackToOverview && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToOverview}
            className="group inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-cyan-500/40 hover:bg-muted/50 transition-all shadow-xs admin-btn-press"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1 text-cyan-500" />
            <span>Back to Dashboard</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span>Executive Console</span>
            <span>/</span>
            <span className="text-foreground font-semibold">User Directory</span>
          </div>
        </div>
      )}

      {/* Main Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 shadow-xs flex-shrink-0">
            <Users className="h-5 w-5 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground truncate">
              Registered Platform Users
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
              All registered community and dashboard accounts across PGT Global Network.
            </p>
          </div>
        </div>

        {/* Stats & Refresh */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 self-start sm:self-center">
          <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/40 px-3 py-1.5 sm:px-4 sm:py-2 text-center shadow-xs">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">
              Total Members
            </span>
            <p className="font-mono font-extrabold text-foreground text-sm sm:text-base mt-0.5">
              {profiles.length}
            </p>
          </div>
          <button
            onClick={loadProfiles}
            disabled={isLoading}
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border border-border bg-card text-foreground hover:bg-muted transition-colors disabled:opacity-50 admin-btn-press shadow-xs flex-shrink-0"
            title="Refresh Users"
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
            <div className="space-y-2">
              <h4 className="font-bold text-sm">Supabase Database Setup Recommended</h4>
              <p className="leading-relaxed">
                Supabase Row Level Security (RLS) is currently restricting client reads on <code className="font-mono bg-black/10 px-1 py-0.5 rounded">profiles</code>.
                Running the script at <code className="font-mono bg-black/10 px-1 py-0.5 rounded">supabase/migrations/20260726000010_admin_portal_channels.sql</code> in your Supabase SQL Editor will grant the portal full viewing permissions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Role Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by full name, email, role, location..."
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

        {/* Role Filters */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-xl border border-border bg-input px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Standard User</option>
            <option value="admin">Administrator</option>
            <option value="team_member">Team Member</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground text-sm flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <p>Loading user profiles from database...</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-foreground">No registered users found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery || selectedRole !== 'all'
                ? 'Try adjusting your search or role filters.'
                : 'Registered accounts will appear here automatically.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card Feed (Phone / Small Screens) */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredProfiles.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedProfile(user)}
                  className="p-3.5 space-y-2.5 transition-colors active:bg-muted/60"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-primary font-bold text-xs uppercase border border-border">
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                          {user.full_name || 'Anonymous User'}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono truncate">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize border flex-shrink-0 ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role || 'user'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5 truncate mr-2">
                      {user.location ? (
                        <span className="flex items-center gap-1 text-foreground truncate">
                          <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="truncate">{user.location}</span>
                        </span>
                      ) : (
                        <span className="font-mono">{formatIST(user.created_at)}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleCopy(user.email, `m-user-${user.id}`)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
                        title="Copy Email"
                      >
                        {copiedField === `m-user-${user.id}` ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedProfile(user)}
                        className="flex h-7 px-2.5 items-center gap-1 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        <Eye className="h-3 w-3 text-primary" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-border/70 bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredProfiles.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedProfile(user)}
                      className="group cursor-pointer transition-colors hover:bg-muted/50"
                    >
                      {/* User & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-primary font-bold text-xs uppercase border border-border">
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {user.full_name || 'Anonymous User'}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${getRoleBadge(
                            user.role
                          )}`}
                        >
                          {user.role || 'user'}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {user.location ? (
                          <span className="flex items-center gap-1 text-foreground">
                            <MapPin className="h-3 w-3 text-primary" />
                            {user.location}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                        {formatIST(user.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                          {/* Copy Email */}
                          <button
                            onClick={() => handleCopy(user.email, `user-${user.id}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            title="Copy User Email"
                          >
                            {copiedField === `user-${user.id}` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>

                          {/* View Profile Dossier */}
                          <button
                            onClick={() => setSelectedProfile(user)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                            title="Inspect User Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* User Inspection Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 animate-admin-modal-backdrop">
          <div className="h-full w-full max-w-md border-l border-border bg-card p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-admin-modal-drawer">
            {/* Modal Top */}
            <div>
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-primary font-bold text-sm uppercase border border-border">
                    {selectedProfile.full_name?.charAt(0) || selectedProfile.email?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {selectedProfile.full_name || 'Platform User'}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.2 text-[11px] font-semibold capitalize border ${getRoleBadge(
                        selectedProfile.role
                      )}`}
                    >
                      {selectedProfile.role || 'user'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProfile(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Dossier Fields */}
              <div className="mt-6 space-y-4 text-xs sm:text-sm">
                {/* Email Address */}
                <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      Email Address
                    </span>
                    <button
                      onClick={() => handleCopy(selectedProfile.email, 'modal-email')}
                      className="text-muted-foreground hover:text-foreground"
                      title="Copy Email"
                    >
                      {copiedField === 'modal-email' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 font-mono font-semibold text-foreground">
                    {selectedProfile.email}
                  </p>
                </div>

                {/* User ID (UUID) */}
                <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      User UUID
                    </span>
                    <button
                      onClick={() => handleCopy(selectedProfile.id, 'modal-id')}
                      className="text-muted-foreground hover:text-foreground"
                      title="Copy UUID"
                    >
                      {copiedField === 'modal-id' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted-foreground break-all">
                    {selectedProfile.id}
                  </p>
                </div>

                {/* Registration Date */}
                <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Account Created
                  </span>
                  <p className="mt-1 font-mono text-xs font-semibold text-foreground">
                    {formatIST(selectedProfile.created_at)}
                  </p>
                </div>

                {/* Bio / Location / Website if present */}
                {selectedProfile.location && (
                  <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Location
                    </span>
                    <p className="mt-1 font-medium text-foreground">
                      {selectedProfile.location}
                    </p>
                  </div>
                )}

                {selectedProfile.website && (
                  <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-primary" />
                      Website
                    </span>
                    <p className="mt-1">
                      <a
                        href={selectedProfile.website.startsWith('http') ? selectedProfile.website : `https://${selectedProfile.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 font-mono text-xs"
                      >
                        <span>{selectedProfile.website}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedProfile(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>

              <button
                onClick={() => {
                  if (onSendEmail) {
                    onSendEmail(selectedProfile.email, selectedProfile.full_name || 'Member');
                  } else {
                    window.location.href = `mailto:${selectedProfile.email}`;
                  }
                }}
                className="inline-flex items-center space-x-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-102"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Contact Member</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
