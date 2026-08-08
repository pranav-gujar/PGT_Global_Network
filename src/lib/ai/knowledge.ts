export interface KnowledgeItem {
  id: string;
  category: 'identity' | 'program' | 'venture' | 'capability' | 'portfolio' | 'contact' | 'unsupported';
  title: string;
  summary: string;
  details: string;
  businessOutcomes: string[];
  pageUrl?: string;
  actionLabel?: string;
  keywords: string[];
}

export const PGT_KNOWLEDGE_BASE: Record<string, KnowledgeItem> = {
  // Identity
  overview: {
    id: 'overview',
    category: 'identity',
    title: 'PGT Global Network Overview',
    summary: 'PGT Global Network is a purpose-driven global organization driving growth, empowerment, digital education, and meaningful transformation.',
    details: 'Founded in 2019, PGT stands for Positivity, Growth, and Transformation. Over 7+ years of dedication, we have impacted 10,000+ lives across 15+ countries through leadership programs, eco-initiatives, tech solutions, and community drives.',
    businessOutcomes: [
      'Empowered 10,000+ students & professionals',
      'Built a global network across 15+ countries',
      '7+ years of sustained community & educational impact'
    ],
    pageUrl: '/about',
    actionLabel: 'Explore About Us',
    keywords: ['pgt', 'overview', 'about', 'positivity', 'growth', 'transformation', 'ceo', 'founder', 'vision', 'mission']
  },

  // Programs
  d3: {
    id: 'd3',
    category: 'program',
    title: 'D3 Program (Daily Discovery Digest)',
    summary: 'A flagship daily inspiration series delivering knowledge, historical milestones, and impactful stories to students and learners.',
    details: 'D3 delivers daily curated knowledge through Instagram & Facebook stories, highlighting national/international days, historical anniversaries, and extraordinary real-life stories.',
    businessOutcomes: [
      '10,000+ daily story viewers engaged',
      'Enhanced daily student awareness & curiosity',
      'Continuous daily knowledge distribution'
    ],
    pageUrl: '/programs/d3',
    actionLabel: 'View D3 Program',
    keywords: ['d3', 'daily discovery digest', 'knowledge', 'stories', 'daily', 'history', 'inspiration']
  },
  voa: {
    id: 'voa',
    category: 'program',
    title: 'VoA Initiative (Voices of Ability)',
    summary: 'A powerful storytelling series highlighting individuals who turned challenges into change and built real-world impact.',
    details: 'VoA records life journey episodes, disability & ability awareness stories, and publishes online videos to foster empathy and inspire social change.',
    businessOutcomes: [
      'Dozens of inspiring journeys shared globally',
      'Strengthened disability & ability awareness',
      'Empowered youth through storytelling'
    ],
    pageUrl: '/programs/voa',
    actionLabel: 'View VoA Initiative',
    keywords: ['voa', 'voices of ability', 'storytelling', 'disability', 'inspiration', 'videos', 'empowerment']
  },
  seminarix: {
    id: 'seminarix',
    category: 'program',
    title: 'Seminarix (Seminar Series for Students)',
    summary: 'On-ground seminar sessions empowering students with academic strategies, motivation, and mental wellness tools.',
    details: 'Seminarix conducts interactive school and hostel workshops focusing on exam preparation techniques, mental health guidance, and real-life success stories.',
    businessOutcomes: [
      'Guided hundreds of school & hostel students',
      'Improved exam confidence & mental wellness',
      'Direct on-ground youth engagement'
    ],
    pageUrl: '/programs/seminarix',
    actionLabel: 'View Seminarix',
    keywords: ['seminarix', 'seminars', 'students', 'school', 'academics', 'motivation', 'mental wellness', 'exams']
  },
  motivminds: {
    id: 'motivminds',
    category: 'program',
    title: 'MotiVMinds (One-Minute Empowerment)',
    summary: 'Interactive short-format video series addressing youth mental health, emotional wellness, and personal growth.',
    details: 'Delivers 1-minute high-impact video insights for personal development, student motivation, and emotional resilience.',
    businessOutcomes: [
      'Engaged digital youth community',
      'Quick daily mental wellness insights',
      'Scalable social media outreach'
    ],
    pageUrl: '/programs/motivminds',
    actionLabel: 'View MotiVMinds',
    keywords: ['motivminds', 'mental health', 'one minute', 'video', 'empowerment', 'youth', 'wellness']
  },
  hed: {
    id: 'hed',
    category: 'program',
    title: 'HED Campaign (Happy Eco Diwali)',
    summary: 'An annual green celebration campaign advocating for eco-friendly practices during festivals.',
    details: 'Includes tree plantation drives, Mission ENOSAVE energy conservation, eco-friendly innovation contests, and community awareness.',
    businessOutcomes: [
      'Thousands engaged annually in eco celebrations',
      'Substantial tree plantation & energy conservation',
      '7 consecutive years of environmental advocacy'
    ],
    pageUrl: '/programs/hed',
    actionLabel: 'View HED Campaign',
    keywords: ['hed', 'happy eco diwali', 'green', 'eco', 'diwali', 'sustainability', 'environment', 'trees']
  },

  // Ventures
  publications: {
    id: 'publications',
    category: 'venture',
    title: 'PGT Publications',
    summary: 'The publishing and knowledge division of PGT Global Network dedicated to books, articles, and educational research.',
    details: 'Motto: "Lasting Ideas". Founded 1 January 2024. Publishes books, research papers, and educational resources fostering lifelong intellectual growth.',
    businessOutcomes: [
      'Active publishing ecosystem',
      'Curated books & educational materials',
      'Preserving meaningful ideas for future generations'
    ],
    pageUrl: '/ventures',
    actionLabel: 'Explore PGT Publications',
    keywords: ['publications', 'books', 'research', 'writing', 'articles', 'lasting ideas', 'publishing']
  },
  technologies: {
    id: 'technologies',
    category: 'venture',
    title: 'PGT Technologies',
    summary: 'The technology and innovation division developing web solutions, software, AI apps, and automation systems.',
    details: 'Motto: "Future Engineered". Launching August 2026. Builds modern web applications, AI-powered automation, digital platforms, and software services for enterprise impact.',
    businessOutcomes: [
      'Custom web & mobile app engineering',
      'AI & automation workflow deployment',
      'Scalable digital transformation solutions'
    ],
    pageUrl: '/ventures',
    actionLabel: 'Explore PGT Technologies',
    keywords: ['technologies', 'software', 'ai', 'web development', 'automation', 'future engineered', 'tech']
  },

  // Capabilities
  services: {
    id: 'services',
    category: 'capability',
    title: 'Service Capabilities & Offerings',
    summary: 'Comprehensive solutions spanning digital engineering, youth empowerment programs, publishing, and sustainability drives.',
    details: 'PGT Global Network offers custom software engineering, student mentorship seminars, eco-friendly campaign execution, research publishing, and leadership workshops.',
    businessOutcomes: [
      'End-to-end program execution',
      'Tailored digital solution development',
      'Impact measurement & community scaling'
    ],
    pageUrl: '/programs',
    actionLabel: 'Explore Capabilities',
    keywords: ['services', 'capabilities', 'offerings', 'solutions', 'what we do', 'consulting']
  },

  // Portfolio
  portfolio: {
    id: 'portfolio',
    category: 'portfolio',
    title: 'Portfolio & Global Impact',
    summary: '7+ years of documented community transformation, student mentorship, and global reach across 15+ countries.',
    details: 'Over 10,000+ lives impacted, 200+ documented success stories, 8+ core programs, and continuous annual eco-initiatives since 2019.',
    businessOutcomes: [
      'Proven track record across 7+ years',
      '200+ success stories documented',
      '15+ countries global reach'
    ],
    pageUrl: '/impact',
    actionLabel: 'View Impact & Timeline',
    keywords: ['portfolio', 'impact', 'milestones', 'timeline', 'achievements', 'success stories', 'reach']
  },

  // Contact
  contact: {
    id: 'contact',
    category: 'contact',
    title: 'Contact & Collaboration',
    summary: 'Connect with PGT Global Network for partnerships, program applications, seminars, or general inquiries.',
    details: 'You can submit an application via our Apply portal or reach out directly using our Contact form for institutional collaborations.',
    businessOutcomes: [
      'Direct response from PGT leadership',
      'Streamlined program application process',
      'Institutional collaboration opportunities'
    ],
    pageUrl: '/contact',
    actionLabel: 'Contact Us',
    keywords: ['contact', 'apply', 'email', 'inquiry', 'collaborate', 'partner', 'connect', 'reach']
  },

  // Explicit Unsupported Services List
  unsupported: {
    id: 'unsupported',
    category: 'unsupported',
    title: 'Unsupported Services',
    summary: 'Explicit list of services PGT Global Network does NOT offer to maintain 100% transparency.',
    details: 'PGT Global Network does NOT provide direct cash loans, cryptocurrency investments, weapons manufacturing, gambling services, heavy industrial hardware fabrication, or medical/surgical procedures.',
    businessOutcomes: [
      'Zero false promises or hallucinations',
      '100% transparent scope boundaries'
    ],
    pageUrl: '/about',
    actionLabel: 'Learn Our Scope',
    keywords: ['unsupported', 'loans', 'crypto', 'gambling', 'medical', 'hardware', 'disclaimer']
  }
};
