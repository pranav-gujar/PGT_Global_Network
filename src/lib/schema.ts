export const BASE_URL = 'https://pgtglobalnetwork.com';
export const ORG_NAME = 'PGT Global Network';
export const ORG_LOGO = `${BASE_URL}/PGT%20New%20Logo%20Transparent.png`;

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface FAQItemSchema {
  question: string;
  answer: string;
}

export interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}

export interface CourseSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}

export interface JobPostingSchemaProps {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
}

/**
 * Generates Schema.org Organization structured data
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'EducationalOrganization'],
  '@id': `${BASE_URL}/#organization`,
  name: ORG_NAME,
  alternateName: 'PGT',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: ORG_LOGO,
    width: '512',
    height: '512'
  },
  image: ORG_LOGO,
  description: 'A purpose-driven global organization dedicated to driving digital education, community transformation, and global leadership.',
  foundingDate: '2019',
  email: 'office@pgtglobalnetwork.com',
  sameAs: [
    'https://www.linkedin.com/company/pgtglobalnetwork',
    'https://www.instagram.com/pgtglobalnetwork',
    'https://www.youtube.com/@pgtglobalnetwork'
  ]
});

/**
 * Generates Schema.org WebSite structured data with Sitelinks Searchbox
 */
export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: ORG_NAME,
  description: 'Empowering individuals through digital education, community projects, and leadership development.',
  publisher: {
    '@id': `${BASE_URL}/#organization`
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/articles?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

/**
 * Generates Schema.org BreadcrumbList structured data
 */
export const getBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.item.startsWith('http') ? item.item : `${BASE_URL}${item.item}`
  }))
});

/**
 * Generates Schema.org FAQPage structured data
 */
export const getFAQSchema = (faqs: FAQItemSchema[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

/**
 * Generates Schema.org Article / BlogPosting structured data
 */
export const getArticleSchema = (props: ArticleSchemaProps) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: props.title,
  description: props.description,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': props.url
  },
  url: props.url,
  image: props.imageUrl,
  datePublished: props.datePublished,
  dateModified: props.dateModified || props.datePublished,
  author: {
    '@type': 'Person',
    name: props.authorName || 'Pranav Gujar'
  },
  publisher: {
    '@type': 'Organization',
    name: ORG_NAME,
    logo: {
      '@type': 'ImageObject',
      url: ORG_LOGO
    }
  }
});

/**
 * Generates Schema.org EducationalProgram / Course structured data
 */
export const getCourseSchema = (props: CourseSchemaProps) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: props.title,
  description: props.description,
  provider: {
    '@type': 'Organization',
    name: ORG_NAME,
    sameAs: BASE_URL
  },
  url: props.url,
  ...(props.imageUrl ? { image: props.imageUrl } : {})
});

/**
 * Generates Schema.org JobPosting structured data
 */
export const getJobPostingSchema = (props: JobPostingSchemaProps) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: props.title,
  description: props.description,
  datePosted: props.datePosted,
  validThrough: props.validThrough || '2026-12-31',
  employmentType: props.employmentType || 'VOLUNTEER',
  hiringOrganization: {
    '@type': 'Organization',
    name: ORG_NAME,
    sameAs: BASE_URL,
    logo: ORG_LOGO
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Global'
    }
  },
  jobLocationType: 'TELECOMMUTE'
});
