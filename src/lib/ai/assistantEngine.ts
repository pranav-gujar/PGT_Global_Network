import { PGT_KNOWLEDGE_BASE, KnowledgeItem } from './knowledge';

export interface SubItem {
  id: string;
  label: string;
  description: string;
  knowledgeKey: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  description: string;
  iconName: string;
  subItems: SubItem[];
}

export interface ActionButton {
  label: string;
  pageUrl: string;
}

export interface EngineResponse {
  type: 'main_menu' | 'sub_menu' | 'answer' | 'unsupported';
  title: string;
  text: string;
  activeCategoryId?: string;
  knowledgeItem?: KnowledgeItem;
  categories?: MenuCategory[];
  subItems?: SubItem[];
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'services',
    label: 'Services & Capabilities',
    description: 'Digital solutions, education, publishing & sustainability',
    iconName: 'Sparkles',
    subItems: [
      {
        id: 'tech-solutions',
        label: 'Digital Engineering & AI Apps',
        description: 'Web development, AI software & automation',
        knowledgeKey: 'technologies'
      },
      {
        id: 'education-mentorship',
        label: 'Education & Mentorship',
        description: 'Student seminars, workshops & motivation',
        knowledgeKey: 'seminarix'
      },
      {
        id: 'publishing-knowledge',
        label: 'Publishing & Knowledge',
        description: 'Books, articles & educational resources',
        knowledgeKey: 'publications'
      },
      {
        id: 'sustainability-campaigns',
        label: 'Eco & Sustainability Drives',
        description: 'Green Diwali, tree planting & ENOSAVE',
        knowledgeKey: 'hed'
      }
    ]
  },
  {
    id: 'programs',
    label: 'Programs & Initiatives',
    description: 'Explore D3, VoA, Seminarix, MotiVMinds & HED',
    iconName: 'BookOpen',
    subItems: [
      {
        id: 'prog-d3',
        label: 'D3 Program (Daily Digest)',
        description: 'Daily knowledge & milestone highlights',
        knowledgeKey: 'd3'
      },
      {
        id: 'prog-voa',
        label: 'VoA Initiative (Voices of Ability)',
        description: 'Inspiring journey storytelling series',
        knowledgeKey: 'voa'
      },
      {
        id: 'prog-seminarix',
        label: 'Seminarix Series',
        description: 'School & hostel student workshops',
        knowledgeKey: 'seminarix'
      },
      {
        id: 'prog-motivminds',
        label: 'MotiVMinds (1-Min Videos)',
        description: 'Youth mental health & growth videos',
        knowledgeKey: 'motivminds'
      },
      {
        id: 'prog-hed',
        label: 'HED Campaign (Eco Diwali)',
        description: 'Annual green festival initiative',
        knowledgeKey: 'hed'
      }
    ]
  },
  {
    id: 'ventures',
    label: 'Ventures & Divisions',
    description: 'PGT Publications & PGT Technologies',
    iconName: 'Building2',
    subItems: [
      {
        id: 'vent-pub',
        label: 'PGT Publications',
        description: 'Publishing, books & research division',
        knowledgeKey: 'publications'
      },
      {
        id: 'vent-tech',
        label: 'PGT Technologies',
        description: 'Future engineered software & AI',
        knowledgeKey: 'technologies'
      }
    ]
  },
  {
    id: 'portfolio',
    label: 'Portfolio & Impact',
    description: '7-Year milestone timeline & global reach',
    iconName: 'Award',
    subItems: [
      {
        id: 'port-milestones',
        label: '7-Year Milestones (2019-2025)',
        description: 'Evolution from grassroots to global network',
        knowledgeKey: 'portfolio'
      },
      {
        id: 'port-overview',
        label: 'PGT Organization Overview',
        description: 'Identity, CEO message & principles',
        knowledgeKey: 'overview'
      }
    ]
  },
  {
    id: 'contact',
    label: 'Contact & Apply',
    description: 'Schedule consultation or apply for programs',
    iconName: 'MessageSquare',
    subItems: [
      {
        id: 'cnt-inquiry',
        label: 'Institutional Collaboration',
        description: 'Submit an inquiry to PGT leadership',
        knowledgeKey: 'contact'
      },
      {
        id: 'cnt-apply',
        label: 'Program Application Portal',
        description: 'Apply for PGT programs & student initiatives',
        knowledgeKey: 'contact'
      }
    ]
  }
];

export const assistantEngine = {
  /** Returns the main menu state */
  getMainMenu(): EngineResponse {
    return {
      type: 'main_menu',
      title: 'How can I assist you today?',
      text: 'Select a category below or type your inquiry to explore PGT Global Network solutions, programs, and services:',
      categories: MENU_CATEGORIES
    };
  },

  /** Returns sub-items for a selected category */
  getSubMenu(categoryId: string): EngineResponse {
    const category = MENU_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return this.getMainMenu();

    return {
      type: 'sub_menu',
      title: category.label,
      text: `Select an item under ${category.label} for instant details:`,
      activeCategoryId: category.id,
      subItems: category.subItems
    };
  },

  /** Returns deterministic answer for a specific knowledge item */
  getAnswer(knowledgeKey: string): EngineResponse {
    const item = PGT_KNOWLEDGE_BASE[knowledgeKey];
    if (!item) return this.getMainMenu();

    if (item.category === 'unsupported') {
      return {
        type: 'unsupported',
        title: item.title,
        text: item.details,
        knowledgeItem: item,
        primaryAction: { label: 'Explore About PGT', pageUrl: '/about' },
        secondaryAction: { label: 'Contact Us', pageUrl: '/contact' }
      };
    }

    return {
      type: 'answer',
      title: item.title,
      text: `${item.summary}\n\nKey Outcomes:\n• ${item.businessOutcomes.join('\n• ')}`,
      knowledgeItem: item,
      primaryAction: {
        label: `${item.actionLabel || 'View Page'} →`,
        pageUrl: item.pageUrl || '/about'
      },
      secondaryAction: {
        label: 'Discuss Requirement →',
        pageUrl: '/contact'
      }
    };
  },

  /** Hybrid text matching against knowledge base & menu nodes */
  query(text: string): EngineResponse {
    const raw = text.trim().toLowerCase();
    if (!raw) return this.getMainMenu();

    // Check for unsupported service keywords
    const unsupportedKeywords = ['loan', 'cash', 'crypto', 'bitcoin', 'gamble', 'betting', 'weapon', 'medical', 'surgery'];
    if (unsupportedKeywords.some(k => raw.includes(k))) {
      return this.getAnswer('unsupported');
    }

    // Direct match against category labels/ids
    const categoryMatch = MENU_CATEGORIES.find(c =>
      c.id === raw || c.label.toLowerCase().includes(raw) || raw.includes(c.id)
    );
    if (categoryMatch) {
      return this.getSubMenu(categoryMatch.id);
    }

    // Fuzzy search knowledge base items
    const knowledgeKeys = Object.keys(PGT_KNOWLEDGE_BASE);
    let bestKey: string | null = null;
    let maxScore = 0;

    for (const key of knowledgeKeys) {
      const item = PGT_KNOWLEDGE_BASE[key];
      let score = 0;

      if (raw.includes(item.id)) score += 10;
      if (item.title.toLowerCase().includes(raw)) score += 8;

      for (const kw of item.keywords) {
        if (raw.includes(kw) || kw.includes(raw)) {
          score += 5;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestKey = key;
      }
    }

    if (bestKey && maxScore >= 4) {
      return this.getAnswer(bestKey);
    }

    // Fallback response if no confident match
    return {
      type: 'main_menu',
      title: 'Explore PGT Global Network',
      text: `I couldn't find an exact match for "${text}". Please choose from the main categories below:`,
      categories: MENU_CATEGORIES
    };
  }
};
