import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BASE_URL, ORG_NAME, ORG_LOGO } from '../lib/schema';
import { LANGUAGES } from '../contexts/LanguageContext';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  schema?: Record<string, any> | Record<string, any>[];
}

const DEFAULT_TITLE = 'PGT Global Network | Purpose-Driven Learning & Innovation Ecosystem';
const DEFAULT_DESCRIPTION = 'PGT Global Network is a purpose-driven global organization dedicated to driving digital education, community transformation, and global leadership.';
const DEFAULT_KEYWORDS = 'PGT Global Network, PGT, digital education, youth empowerment, community leadership, global organization, sustainable development, learning ecosystem';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = ORG_LOGO,
  type = 'website',
  noindex = false,
  schema
}) => {
  const location = useLocation();
  const canonicalUrl = `${BASE_URL}${location.pathname}`;
  const fullTitle = title ? `${title} | ${ORG_NAME}` : DEFAULT_TITLE;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper function to set or create meta tag
    const setMetaTag = (selector: string, attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${selector}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'name', 'description', description);
    setMetaTag('name', 'name', 'keywords', keywords);
    setMetaTag('name', 'name', 'author', ORG_NAME);
    setMetaTag('name', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Open Graph Tags
    setMetaTag('property', 'property', 'og:site_name', ORG_NAME);
    setMetaTag('property', 'property', 'og:title', fullTitle);
    setMetaTag('property', 'property', 'og:description', description);
    setMetaTag('property', 'property', 'og:url', canonicalUrl);
    setMetaTag('property', 'property', 'og:image', image);
    setMetaTag('property', 'property', 'og:type', type);

    // 4. Twitter Card Tags
    setMetaTag('name', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'name', 'twitter:site', '@pgtglobalnet');
    setMetaTag('name', 'name', 'twitter:title', fullTitle);
    setMetaTag('name', 'name', 'twitter:description', description);
    setMetaTag('name', 'name', 'twitter:image', image);

    // 5. Canonical Link Tag
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    // 6. Hreflang Alternate Links
    LANGUAGES.forEach(lang => {
      let hrefLangElement = document.querySelector(`link[rel="alternate"][hreflang="${lang.code}"]`);
      if (!hrefLangElement) {
        hrefLangElement = document.createElement('link');
        hrefLangElement.setAttribute('rel', 'alternate');
        hrefLangElement.setAttribute('hreflang', lang.code);
        document.head.appendChild(hrefLangElement);
      }
      hrefLangElement.setAttribute('href', canonicalUrl);
    });

    let xDefaultElement = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (!xDefaultElement) {
      xDefaultElement = document.createElement('link');
      xDefaultElement.setAttribute('rel', 'alternate');
      xDefaultElement.setAttribute('hreflang', 'x-default');
      document.head.appendChild(xDefaultElement);
    }
    xDefaultElement.setAttribute('href', canonicalUrl);

    // 7. Schema.org JSON-LD Script
    const schemaId = 'seo-json-ld';
    let scriptElement = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (schema) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = schemaId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      const schemaData = Array.isArray(schema) ? schema : [schema];
      scriptElement.textContent = JSON.stringify(schemaData);
    } else if (scriptElement) {
      scriptElement.remove();
    }
  }, [fullTitle, description, keywords, image, type, noindex, canonicalUrl, schema]);

  return null;
};

export default SEO;
