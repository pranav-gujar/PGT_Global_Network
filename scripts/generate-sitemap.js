import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://pgtglobalnetwork.com';
const currentDate = new Date().toISOString().split('T')[0];

const pages = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.9', changefreq: 'weekly' },
  { path: '/programs', priority: '0.9', changefreq: 'weekly' },
  { path: '/impact', priority: '0.8', changefreq: 'weekly' },
  { path: '/timeline', priority: '0.8', changefreq: 'monthly' },
  { path: '/articles', priority: '0.8', changefreq: 'daily' },
  { path: '/careers', priority: '0.8', changefreq: 'weekly' },
  { path: '/ventures', priority: '0.7', changefreq: 'monthly' },
  { path: '/gallery', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { path: '/terms', priority: '0.4', changefreq: 'yearly' },

  // Program Details
  { path: '/programs/d3', priority: '0.8', changefreq: 'monthly' },
  { path: '/programs/voa', priority: '0.8', changefreq: 'monthly' },
  { path: '/programs/hed', priority: '0.8', changefreq: 'monthly' },
  { path: '/programs/motivminds', priority: '0.8', changefreq: 'monthly' },
  { path: '/programs/seminarix', priority: '0.8', changefreq: 'monthly' },

  // Articles Details
  { path: '/articles/transforming-youth-with-technology-learning', priority: '0.7', changefreq: 'monthly' },
  { path: '/articles/sustainable-communities-and-student-impact', priority: '0.7', changefreq: 'monthly' },
  { path: '/articles/global-development-leadership-trends-ahead', priority: '0.7', changefreq: 'monthly' },
  { path: '/articles/graduate-journeys-inspiring-change-stories', priority: '0.7', changefreq: 'monthly' },
  { path: '/articles/innovating-classrooms-for-future-learning', priority: '0.7', changefreq: 'monthly' },
  { path: '/articles/partnerships-driving-greater-student-impact', priority: '0.7', changefreq: 'monthly' }
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(page => `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const targetPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(targetPath, sitemapXml, 'utf8');
console.log(`[SEO] Successfully generated sitemap.xml with ${pages.length} URLs at ${targetPath}`);
