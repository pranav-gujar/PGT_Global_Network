import { supabase } from '../../lib/supabase';
import { ContactMessage, UserProfile, JobApplication, DbArticle, EmailStudioLog } from '../types';
import { articles as fallbackArticles } from '../../data/articles';

export interface DataFetchResult<T> {
  data: T[];
  count: number;
  error?: string | null;
  needsMigration?: boolean;
}

/**
 * Fetches all contact form submissions from Supabase.
 */
export async function fetchContactMessages(): Promise<DataFetchResult<ContactMessage>> {
  try {
    const { data, error, count } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      const rpcResult = await supabase.rpc('get_admin_contact_messages');
      if (!rpcResult.error && rpcResult.data) {
        return {
          data: rpcResult.data as ContactMessage[],
          count: rpcResult.data.length,
          error: null,
        };
      }

      console.warn('[AdminDataService] contact_messages query notice:', error.message);
      return {
        data: [],
        count: 0,
        error: error.message,
        needsMigration: error.code === '42P01' || error.message.includes('permission denied'),
      };
    }

    return {
      data: (data || []) as ContactMessage[],
      count: count ?? data?.length ?? 0,
      error: null,
    };
  } catch (err: any) {
    console.error('[AdminDataService] Exception fetching contacts:', err);
    return {
      data: [],
      count: 0,
      error: err?.message || 'Failed to query contact submissions',
    };
  }
}

/**
 * Fetches all registered profiles from Supabase.
 */
export async function fetchRegisteredProfiles(): Promise<DataFetchResult<UserProfile>> {
  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      const rpcResult = await supabase.rpc('get_admin_registered_profiles');
      if (!rpcResult.error && rpcResult.data) {
        return {
          data: rpcResult.data as UserProfile[],
          count: rpcResult.data.length,
          error: null,
        };
      }

      console.warn('[AdminDataService] profiles query notice:', error.message);
      return {
        data: [],
        count: 0,
        error: error.message,
        needsMigration: error.message.includes('permission denied'),
      };
    }

    return {
      data: (data || []) as UserProfile[],
      count: count ?? data?.length ?? 0,
      error: null,
    };
  } catch (err: any) {
    console.error('[AdminDataService] Exception fetching profiles:', err);
    return {
      data: [],
      count: 0,
      error: err?.message || 'Failed to query registered profiles',
    };
  }
}

/**
 * Fetches all career and fellowship applications from Supabase.
 */
export async function fetchJobApplications(): Promise<DataFetchResult<JobApplication>> {
  try {
    const { data, error, count } = await supabase
      .from('applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      const rpcResult = await supabase.rpc('get_admin_applications');
      if (!rpcResult.error && rpcResult.data) {
        return {
          data: rpcResult.data as JobApplication[],
          count: rpcResult.data.length,
          error: null,
        };
      }

      console.warn('[AdminDataService] applications query notice:', error.message);
      return {
        data: [],
        count: 0,
        error: error.message,
        needsMigration: error.code === '42P01' || error.message.includes('permission denied'),
      };
    }

    return {
      data: (data || []) as JobApplication[],
      count: count ?? data?.length ?? 0,
      error: null,
    };
  } catch (err: any) {
    console.error('[AdminDataService] Exception fetching applications:', err);
    return {
      data: [],
      count: 0,
      error: err?.message || 'Failed to query applications',
    };
  }
}

/**
 * Marks a contact message as read or unread.
 */
export async function toggleContactReadStatus(id: string, isRead: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: isRead })
      .eq('id', id);

    if (error) {
      console.error('[AdminDataService] Error updating read status:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[AdminDataService] Exception updating read status:', err);
    return false;
  }
}

/**
 * Permanently deletes a contact message from the database.
 */
export async function deleteContactMessage(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[AdminDataService] Error deleting contact message:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[AdminDataService] Exception deleting contact message:', err);
    return false;
  }
}

/**
 * Updates application review status.
 */
export async function updateApplicationStatus(id: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[AdminDataService] Error updating application status:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[AdminDataService] Exception updating application status:', err);
    return false;
  }
}

/**
 * Permanently deletes an application from the database.
 */
export async function deleteJobApplication(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[AdminDataService] Error deleting application:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[AdminDataService] Exception deleting application:', err);
    return false;
  }
}

/**
 * Fetches all articles from Supabase (with fallback to local data if table doesn't exist yet).
 */
export async function fetchArticles(): Promise<DataFetchResult<DbArticle>> {
  try {
    const { data, error, count } = await supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .order('published_date', { ascending: false });

    if (error) {
      console.warn('[AdminDataService] articles query notice:', error.message);
      // Map fallback articles so admin sees initial content immediately
      const mappedFallbacks: DbArticle[] = fallbackArticles.map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        author: a.author,
        category: a.category,
        read_time: a.readTime,
        image: a.image,
        tags: a.tags,
        published_date: a.date,
      }));

      return {
        data: mappedFallbacks,
        count: mappedFallbacks.length,
        error: error.message,
        needsMigration: error.code === '42P01' || error.message.includes('permission denied'),
      };
    }

    const customLocal = getLocalCustomArticles();

    // If table exists but is empty, fallback to seeded data
    if (!data || data.length === 0) {
      const mappedFallbacks: DbArticle[] = fallbackArticles.map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        author: a.author,
        category: a.category,
        read_time: a.readTime,
        image: a.image,
        tags: a.tags,
        published_date: a.date,
      }));

      const merged = [...customLocal];
      mappedFallbacks.forEach((mf) => {
        if (!merged.some((m) => m.slug === mf.slug || m.id === mf.id)) {
          merged.push(mf);
        }
      });

      return {
        data: merged,
        count: merged.length,
        error: null,
      };
    }

    const merged = [...customLocal];
    (data as DbArticle[]).forEach((da) => {
      if (!merged.some((m) => m.slug === da.slug || m.id === da.id)) {
        merged.push(da);
      }
    });

    return {
      data: merged,
      count: merged.length,
      error: null,
    };
  } catch (err: any) {
    console.error('[AdminDataService] Exception fetching articles:', err);
    const customLocal = getLocalCustomArticles();
    return {
      data: customLocal,
      count: customLocal.length,
      error: err?.message || 'Failed to query articles',
    };
  }
}

function getLocalCustomArticles(): DbArticle[] {
  try {
    const raw = localStorage.getItem('pgt_custom_articles');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalCustomArticle(article: DbArticle) {
  try {
    const list = getLocalCustomArticles();
    const idx = list.findIndex((a) => a.id === article.id || a.slug === article.slug);
    if (idx >= 0) {
      list[idx] = article;
    } else {
      list.unshift(article);
    }
    localStorage.setItem('pgt_custom_articles', JSON.stringify(list));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('pgt-articles-updated'));
    }
  } catch (e) {
    console.error('Failed to save custom article to localStorage', e);
  }
}

function removeLocalCustomArticle(id: string) {
  try {
    const list = getLocalCustomArticles().filter((a) => a.id !== id && a.slug !== id);
    localStorage.setItem('pgt_custom_articles', JSON.stringify(list));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('pgt-articles-updated'));
    }
  } catch (e) {
    console.error('Failed to remove custom article from localStorage', e);
  }
}

/**
 * Creates a new article in Supabase and syncs with resilient local cache.
 */
export async function createArticle(article: Omit<DbArticle, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: DbArticle; error?: string }> {
  const localNew: DbArticle = {
    id: 'local-' + Date.now(),
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    author: article.author || 'Pranav Gujar',
    category: article.category || 'Education',
    read_time: article.read_time || '5 min read',
    image: article.image,
    card_image: article.card_image,
    tags: article.tags || [],
    published_date: article.published_date || new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const payload: any = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author || 'Pranav Gujar',
      category: article.category || 'Education',
      read_time: article.read_time || '5 min read',
      image: article.image,
      tags: article.tags || [],
      published_date: article.published_date || new Date().toISOString().split('T')[0],
    };
    if (article.card_image) {
      payload.card_image = article.card_image;
    }

    let { data, error } = await supabase
      .from('articles')
      .insert(payload)
      .select()
      .single();

    // If card_image column is not in DB yet, gracefully retry without it
    if (error && error.message?.toLowerCase().includes('card_image')) {
      delete payload.card_image;
      const retry = await supabase.from('articles').insert(payload).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.warn('[AdminDataService] Supabase insert note, persisting to local storage:', error.message);
      saveLocalCustomArticle(localNew);
      return { success: true, data: localNew };
    }

    const saved = { ...(data as DbArticle), card_image: article.card_image || (data as any)?.card_image };
    saveLocalCustomArticle(saved);
    return { success: true, data: saved };
  } catch (err: any) {
    console.warn('[AdminDataService] Exception creating article, persisting locally:', err);
    saveLocalCustomArticle(localNew);
    return { success: true, data: localNew };
  }
}

/**
 * Updates an existing article in Supabase and syncs with resilient local cache.
 */
export async function updateArticle(
  id: string,
  article: Partial<DbArticle>
): Promise<{ success: boolean; data?: DbArticle; error?: string }> {
  try {
    const updatePayload: any = {
      ...article,
      updated_at: new Date().toISOString(),
    };

    let { data, error } = await supabase
      .from('articles')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error && error.message?.toLowerCase().includes('card_image')) {
      delete updatePayload.card_image;
      const retry = await supabase.from('articles').update(updatePayload).eq('id', id).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.warn('[AdminDataService] Supabase update note, updating in local storage:', error.message);
      const list = getLocalCustomArticles();
      const existing = list.find((a) => a.id === id);
      if (existing) {
        const updated = { ...existing, ...article, updated_at: new Date().toISOString() };
        saveLocalCustomArticle(updated);
        return { success: true, data: updated };
      }
      return { success: false, error: error.message };
    }

    const saved = data as DbArticle;
    saveLocalCustomArticle(saved);
    return { success: true, data: saved };
  } catch (err: any) {
    console.error('[AdminDataService] Exception updating article:', err);
    return { success: false, error: err?.message || 'Failed to update article' };
  }
}

/**
 * Permanently deletes an article from Supabase and local cache.
 */
export async function deleteArticle(id: string): Promise<boolean> {
  removeLocalCustomArticle(id);
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[AdminDataService] Supabase delete note:', error.message);
      return true; // Already removed from local cache
    }
    return true;
  } catch (err) {
    console.warn('[AdminDataService] Exception deleting article from Supabase:', err);
    return true;
  }
}

// ==============================================================================
// EXECUTIVE EMAIL STUDIO LOGS & PERSISTENCE
// ==============================================================================

const LOCAL_EMAIL_LOGS_KEY = 'pgt_admin_email_studio_logs_vault_v1';

export function getLocalEmailLogs(): EmailStudioLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_EMAIL_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[AdminDataService] Error reading local email logs:', err);
    return [];
  }
}

export function saveLocalEmailLog(log: EmailStudioLog): void {
  try {
    const current = getLocalEmailLogs();
    const filtered = current.filter((item) => item.id !== log.id);
    const updated = [log, ...filtered].slice(0, 200); // retain last 200 dispatches
    localStorage.setItem(LOCAL_EMAIL_LOGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[AdminDataService] Error saving local email log:', err);
  }
}

export function deleteLocalEmailLog(id: string): void {
  try {
    const current = getLocalEmailLogs();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_EMAIL_LOGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[AdminDataService] Error deleting local email log:', err);
  }
}

/**
 * Fetches all sent email studio logs from Supabase with local fallback.
 */
export async function fetchEmailLogs(): Promise<DataFetchResult<EmailStudioLog>> {
  const localList = getLocalEmailLogs();
  try {
    const { data, error, count } = await supabase
      .from('pgt_email_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      // Try fallback RPC
      const rpc = await supabase.rpc('get_admin_email_logs');
      if (!rpc.error && rpc.data) {
        return {
          data: rpc.data as EmailStudioLog[],
          count: rpc.data.length,
          error: null,
        };
      }

      console.warn('[AdminDataService] pgt_email_logs query note:', error.message);
      return {
        data: localList,
        count: localList.length,
        error: null,
        needsMigration: error.code === '42P01' || error.message.includes('permission denied'),
      };
    }

    // Merge remote and local logs uniquely
    const remote = (data || []) as EmailStudioLog[];
    const idMap = new Map<string, EmailStudioLog>();
    remote.forEach((r) => idMap.set(r.id, r));
    localList.forEach((l) => {
      if (!idMap.has(l.id)) {
        idMap.set(l.id, l);
      }
    });

    const combined = Array.from(idMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      data: combined,
      count: combined.length,
      error: null,
    };
  } catch (err: any) {
    console.error('[AdminDataService] Exception querying email logs:', err);
    return {
      data: localList,
      count: localList.length,
      error: null,
    };
  }
}

/**
 * Records a dispatched email into Supabase and local cache.
 */
export async function recordEmailLog(
  logData: Omit<EmailStudioLog, 'id' | 'created_at'>
): Promise<{ success: boolean; data?: EmailStudioLog; error?: string }> {
  const newId = crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const record: EmailStudioLog = {
    ...logData,
    id: newId,
    created_at: now,
  };

  // Always save immediately to local storage
  saveLocalEmailLog(record);

  try {
    const { data, error } = await supabase
      .from('pgt_email_logs')
      .insert([record])
      .select()
      .single();

    if (error) {
      console.warn('[AdminDataService] Supabase email log insert note:', error.message);
      return { success: true, data: record };
    }

    return { success: true, data: (data as EmailStudioLog) || record };
  } catch (err: any) {
    console.warn('[AdminDataService] Exception inserting email log into Supabase:', err);
    return { success: true, data: record };
  }
}

/**
 * Permanently deletes an email studio log from Supabase and local storage.
 */
export async function deleteEmailLog(id: string): Promise<boolean> {
  deleteLocalEmailLog(id);
  try {
    const { error } = await supabase
      .from('pgt_email_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[AdminDataService] Supabase delete email log note:', error.message);
      return true;
    }
    return true;
  } catch (err) {
    console.warn('[AdminDataService] Exception deleting email log:', err);
    return true;
  }
}

