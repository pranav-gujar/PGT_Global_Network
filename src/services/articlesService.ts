import { supabase } from '../lib/supabase';
import { articles as localArticles, Article } from '../data/articles';

/**
 * Maps database article format to client Article interface.
 */
function mapDbArticleToArticle(db: any): Article {
  return {
    id: db.id || db.slug,
    slug: db.slug,
    title: db.title,
    excerpt: db.excerpt || '',
    content: db.content || '',
    author: db.author || 'Pranav Gujar',
    date: db.published_date || db.date || new Date().toISOString().split('T')[0],
    category: db.category || 'General',
    readTime: db.read_time || db.readTime || '5 min read',
    image: db.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: Array.isArray(db.tags) ? db.tags : [],
  };
}

function getLocalCustomArticles(): Article[] {
  try {
    const raw = localStorage.getItem('pgt_custom_articles');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: any) => ({
      id: item.id || item.slug,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt || '',
      content: item.content || '',
      author: item.author || 'Pranav Gujar',
      date: item.published_date || item.date || new Date().toISOString().split('T')[0],
      category: item.category || 'General',
      readTime: item.read_time || item.readTime || '5 min read',
      image: item.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: Array.isArray(item.tags) ? item.tags : [],
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches all public articles from Supabase with automatic fallback to local data.
 */
export async function getPublicArticles(): Promise<Article[]> {
  const customLocal = getLocalCustomArticles();
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_date', { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn('[ArticlesService] Supabase read notice, using fallback articles:', error.message);
      }
      const merged = [...customLocal];
      localArticles.forEach((la) => {
        if (!merged.some((m) => m.slug === la.slug)) {
          merged.push(la);
        }
      });
      return merged;
    }

    const dbArticles = data.map(mapDbArticleToArticle);
    const merged = [...customLocal];
    dbArticles.forEach((da) => {
      if (!merged.some((m) => m.slug === da.slug)) {
        merged.push(da);
      }
    });
    return merged;
  } catch (err) {
    console.warn('[ArticlesService] Exception reading articles, using fallback:', err);
    const merged = [...customLocal];
    localArticles.forEach((la) => {
      if (!merged.some((m) => m.slug === la.slug)) {
        merged.push(la);
      }
    });
    return merged;
  }
}

/**
 * Fetches a single public article by its unique slug with fallback.
 */
export async function getPublicArticleBySlug(slug: string): Promise<Article | null> {
  const custom = getLocalCustomArticles().find((a) => a.slug === slug);
  if (custom) return custom;

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      const local = localArticles.find((a) => a.slug === slug);
      return local || null;
    }

    return mapDbArticleToArticle(data);
  } catch (err) {
    console.warn('[ArticlesService] Exception reading article by slug, using fallback:', err);
    const local = localArticles.find((a) => a.slug === slug);
    return local || null;
  }
}

