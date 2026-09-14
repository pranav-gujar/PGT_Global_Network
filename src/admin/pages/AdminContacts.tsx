import React, { useEffect, useState, useMemo } from 'react';
import { ContactMessage } from '../types';
import {
  fetchContactMessages,
  toggleContactReadStatus,
  deleteContactMessage,
} from '../services/adminDataService';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import {
  Inbox,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  Circle,
  Trash2,
  Copy,
  Check,
  Send,
  Calendar,
  Mail,
  User,
  Tag,
  AlertCircle,
  FileText,
  X,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminContactsProps {
  onBackToOverview?: () => void;
  onReplyEmail?: (email: string, name: string) => void;
}

export const AdminContacts: React.FC<AdminContactsProps> = ({
  onBackToOverview,
  onReplyEmail,
}) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsMigration, setNeedsMigration] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Safe delete confirmation state
  const [msgToDelete, setMsgToDelete] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadContacts = async () => {
    setIsLoading(true);
    const result = await fetchContactMessages();
    setMessages(result.data);
    setNeedsMigration(!!result.needsMigration);
    setIsLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleToggleRead = async (msg: ContactMessage, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newStatus = !msg.is_read;
    const success = await toggleContactReadStatus(msg.id, newStatus);
    if (success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: newStatus } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, is_read: newStatus });
      }
      toast.success(newStatus ? 'Marked as read' : 'Marked as unread');
    } else {
      toast.error('Failed to update status');
    }
  };

  const confirmDeleteAction = async () => {
    if (!msgToDelete) return;
    setIsDeleting(true);
    try {
      const success = await deleteContactMessage(msgToDelete.id);
      if (success) {
        setMessages((prev) => prev.filter((m) => m.id !== msgToDelete.id));
        if (selectedMessage?.id === msgToDelete.id) {
          setSelectedMessage(null);
        }
        toast.success('Inquiry permanently deleted');
      } else {
        toast.error('Failed to delete inquiry');
      }
    } finally {
      setIsDeleting(false);
      setMsgToDelete(null);
    }
  };

  // Categories extracted dynamically from messages
  const categories = useMemo(() => {
    const set = new Set<string>();
    messages.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [messages]);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        msg.full_name?.toLowerCase().includes(q) ||
        msg.email?.toLowerCase().includes(q) ||
        msg.subject?.toLowerCase().includes(q) ||
        msg.message?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'all' || msg.category === selectedCategory;

      const matchesUnread = !filterUnreadOnly || !msg.is_read;

      return matchesSearch && matchesCategory && matchesUnread;
    });
  }, [messages, searchQuery, selectedCategory, filterUnreadOnly]);

  const unreadCount = useMemo(() => messages.filter((m) => !m.is_read).length, [messages]);

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

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-300">
      {/* Top Navigation Breadcrumb */}
      {onBackToOverview && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToOverview}
            className="group inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-blue-500/40 hover:bg-muted/50 transition-all shadow-xs admin-btn-press"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1 text-blue-500" />
            <span>Back to Dashboard</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span>Executive Console</span>
            <span>/</span>
            <span className="text-foreground font-semibold">Contact Inquiries</span>
          </div>
        </div>
      )}

      {/* Main Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-xs flex-shrink-0">
            <Inbox className="h-5 w-5 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-foreground truncate">
              Contact Form Submissions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
              Inbound website inquiries received from the public Contact page.
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
              {messages.length}
            </p>
          </div>
          <div className="rounded-xl sm:rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 sm:px-4 sm:py-2 text-center shadow-xs">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold block">
              Unread
            </span>
            <p className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm sm:text-base mt-0.5">
              {unreadCount}
            </p>
          </div>
          <button
            onClick={loadContacts}
            disabled={isLoading}
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border border-border bg-card text-foreground hover:bg-muted transition-colors disabled:opacity-50 admin-btn-press shadow-xs flex-shrink-0"
            title="Refresh Inquiries"
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
                Supabase Row Level Security (RLS) is currently restricting client reads on <code className="font-mono bg-black/10 px-1 py-0.5 rounded">contact_messages</code>.
                A ready-to-run SQL migration has been created at <code className="font-mono bg-black/10 px-1 py-0.5 rounded">supabase/migrations/20260726000010_admin_portal_channels.sql</code>.
                Running this script in your Supabase SQL Editor will grant the portal full viewing and management permissions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender name, email, or message..."
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

        {/* Unread Toggle & Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`inline-flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
              filterUnreadOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>Unread Only</span>
            {unreadCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterUnreadOnly ? 'bg-white/20' : 'bg-amber-500/10 text-amber-500'}`}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Category Dropdown/Pills */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-border bg-input px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiries Table / List */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground text-sm flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <p>Loading contact submissions from database...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            <Inbox className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-foreground">No contact submissions found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery || selectedCategory !== 'all' || filterUnreadOnly
                ? 'Try adjusting your search or category filters.'
                : 'New inquiries submitted via /contact will appear here in real-time.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card Feed (Phone / Small Screens) */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-3.5 space-y-2 transition-colors active:bg-muted/60 ${
                    !msg.is_read ? 'bg-primary/[0.03]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={(e) => handleToggleRead(msg, e)}
                        title={msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                        className="text-muted-foreground hover:text-foreground flex-shrink-0"
                      >
                        {msg.is_read ? (
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground/50" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        )}
                      </button>
                      <span className="font-semibold text-foreground text-xs sm:text-sm truncate">
                        {msg.full_name}
                      </span>
                      {!msg.is_read && (
                        <span className="rounded-full bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-bold text-amber-500 border border-amber-500/20 flex-shrink-0">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-lg bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground border border-border/80 flex-shrink-0">
                      {msg.category || 'General'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono text-[11px] truncate max-w-[210px]">{msg.email}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(msg.email, `m-list-${msg.id}`);
                      }}
                      className="text-muted-foreground hover:text-foreground p-1"
                      title="Copy Email"
                    >
                      {copiedField === `m-list-${msg.id}` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {msg.subject && (
                    <p className="text-xs font-semibold text-foreground truncate">
                      {msg.subject}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-mono">{formatIST(msg.created_at)}</span>
                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="flex h-7 px-2.5 items-center gap-1 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMsgToDelete(msg);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
                    <th className="py-3 px-4 w-8">Status</th>
                    <th className="py-3 px-4">Sender & Email</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Subject / Message</th>
                    <th className="py-3 px-4">Received (IST)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`group cursor-pointer transition-colors hover:bg-muted/50 ${
                        !msg.is_read ? 'bg-primary/[0.02] font-medium' : ''
                      }`}
                    >
                      {/* Status Dot */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => handleToggleRead(msg, e)}
                          title={msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {msg.is_read ? (
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground/50" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          )}
                        </button>
                      </td>

                      {/* Sender & Email */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-foreground flex items-center gap-1.5">
                          <span>{msg.full_name}</span>
                          {!msg.is_read && (
                            <span className="rounded-full bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-bold text-amber-500 border border-amber-500/20">
                              NEW
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">{msg.email}</p>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground border border-border/80">
                          {msg.category || 'General'}
                        </span>
                      </td>

                      {/* Subject / Message Snippet */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {msg.subject && (
                          <p className="text-xs font-semibold text-foreground truncate">
                            {msg.subject}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {msg.message}
                        </p>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground font-mono">
                        {formatIST(msg.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                          {/* Copy Email */}
                          <button
                            onClick={() => handleCopy(msg.email, `list-${msg.id}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            title="Copy Email"
                          >
                            {copiedField === `list-${msg.id}` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>

                          {/* View Dossier */}
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                            title="Inspect Dossier"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMsgToDelete(msg);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete Permanently"
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
          </>
        )}
      </div>

      {/* Slide-Over Dossier Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 animate-admin-modal-backdrop">
          <div className="h-full w-full max-w-xl border-l border-border bg-card p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-admin-modal-drawer">
            {/* Modal Header */}
            <div>
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Inquiry Dossier</h3>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      ID: {selectedMessage.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Dossier Fields */}
              <div className="mt-6 space-y-4 text-xs sm:text-sm">
                {/* Sender Full Name */}
                <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                      Sender Full Name
                    </span>
                    <button
                      onClick={() => handleCopy(selectedMessage.full_name, 'name')}
                      className="text-muted-foreground hover:text-foreground"
                      title="Copy Name"
                    >
                      {copiedField === 'name' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 font-bold text-foreground text-base">
                    {selectedMessage.full_name}
                  </p>
                </div>

                {/* Sender Email */}
                <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      Email Address
                    </span>
                    <button
                      onClick={() => handleCopy(selectedMessage.email, 'email')}
                      className="text-muted-foreground hover:text-foreground"
                      title="Copy Email"
                    >
                      {copiedField === 'email' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 font-mono font-semibold text-primary">
                    {selectedMessage.email}
                  </p>
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-primary" />
                      Category
                    </span>
                    <p className="mt-1 font-semibold text-foreground">
                      {selectedMessage.category || 'General'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      Received (IST)
                    </span>
                    <p className="mt-1 font-mono text-xs font-semibold text-foreground">
                      {formatIST(selectedMessage.created_at)}
                    </p>
                  </div>
                </div>

                {/* Subject (if present) */}
                {selectedMessage.subject && (
                  <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Subject
                    </span>
                    <p className="mt-1 font-semibold text-foreground">
                      {selectedMessage.subject}
                    </p>
                  </div>
                )}

                {/* Full Message Body */}
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Inquiry Message Body
                    </span>
                    <button
                      onClick={() => handleCopy(selectedMessage.message, 'body')}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[11px]"
                      title="Copy Message"
                    >
                      {copiedField === 'body' ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded-lg bg-card p-3.5 border border-border/60 text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
              <button
                onClick={() => setMsgToDelete(selectedMessage)}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Inquiry</span>
              </button>

              <button
                onClick={() => {
                  if (onReplyEmail) {
                    onReplyEmail(selectedMessage.email, selectedMessage.full_name);
                  } else {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'PGT Global Network Inquiry')}`;
                  }
                }}
                className="inline-flex items-center space-x-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-102"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Reply to Sender</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explicit Confirmation Modal for Safe Deletion */}
      <ConfirmDeleteModal
        isOpen={!!msgToDelete}
        title="Delete Contact Inquiry"
        itemDescription={
          msgToDelete
            ? `${msgToDelete.full_name} (${msgToDelete.email}) — ${msgToDelete.category || 'General'}`
            : undefined
        }
        onConfirm={confirmDeleteAction}
        onCancel={() => setMsgToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};
