-- =====================================================================
-- PGT GLOBAL NETWORK: ARTICLES & KNOWLEDGE HUB SYSTEM MIGRATION
-- Run this in your Supabase Project -> SQL Editor
-- Safe to execute multiple times (idempotent)
-- =====================================================================

-- 1. Create articles table if it does not exist
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  author text DEFAULT 'Pranav Gujar',
  category text DEFAULT 'Education',
  read_time text DEFAULT '5 min read',
  image text,
  tags text[] DEFAULT '{}',
  published_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure all columns exist in case table was created earlier with fewer columns
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS excerpt text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS content text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author text DEFAULT 'Pranav Gujar';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS category text DEFAULT 'Education';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS read_time text DEFAULT '5 min read';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS card_image text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS published_date date DEFAULT CURRENT_DATE;

-- Enforce unique constraint on slug if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'articles_slug_key'
  ) THEN
    ALTER TABLE public.articles ADD CONSTRAINT articles_slug_key UNIQUE (slug);
  END IF;
END $$;

-- 2. Enable Row Level Security (RLS) on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Allow public and authenticated visitors to read articles
DROP POLICY IF EXISTS "Public can view articles" ON public.articles;
CREATE POLICY "Public can view articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow administrative portal insert
DROP POLICY IF EXISTS "Portal can insert articles" ON public.articles;
CREATE POLICY "Portal can insert articles"
  ON public.articles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow administrative portal update
DROP POLICY IF EXISTS "Portal can update articles" ON public.articles;
CREATE POLICY "Portal can update articles"
  ON public.articles FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow administrative portal delete
DROP POLICY IF EXISTS "Portal can delete articles" ON public.articles;
CREATE POLICY "Portal can delete articles"
  ON public.articles FOR DELETE
  TO anon, authenticated
  USING (true);

-- 3. Seed Initial 6 Hardcoded Articles (Idempotent: skips if slug already exists)
INSERT INTO public.articles (slug, title, excerpt, content, author, category, read_time, image, tags, published_date)
VALUES
(
  'transforming-youth-with-technology-learning',
  'Transforming Youth with Technology Learning',
  'Digital programs equip youth with skills, confidence, and opportunities.',
  '<p>Technology has rapidly become the foundation of modern society, shaping the way people learn, work, and interact. For today’s youth, digital learning is not just a privilege but a necessity. In communities across the globe, students are increasingly embracing digital tools that equip them with knowledge, confidence, and life-changing opportunities.</p><br> <p>One of the greatest advantages of technology in education is accessibility. Online platforms, mobile applications, and interactive tools allow students in rural or underserved areas to connect with high-quality learning resources. This democratization of knowledge ensures that no young person is left behind, regardless of geography or socio-economic background.</p><br> <p>Beyond accessibility, technology also fosters creativity and critical thinking. Through project-based learning, coding programs, and digital collaboration, youth can solve real-world problems and innovate with confidence. These skills extend beyond the classroom, empowering them to become leaders, entrepreneurs, and changemakers in their communities.</p><br> <p>Moreover, technology is reshaping career paths. With industries demanding digital literacy, coding, data analysis, and AI knowledge, young people who embrace technology stand out in the workforce. By equipping youth with these future-ready skills, we prepare them for sustainable careers and enable them to contribute meaningfully to global development.</p><br> <p>However, the journey is not without challenges. Many regions face issues such as limited internet connectivity, lack of devices, or inadequate training for educators. Overcoming these hurdles requires a collaborative effort between governments, NGOs, and private sectors to build infrastructure, provide training, and ensure equitable access.</p><br> <p>Ultimately, transforming youth through technology learning is about more than just academic success. It’s about building resilience, nurturing confidence, and creating opportunities for young people to thrive in an interconnected world. As we invest in digital education, we invest in a brighter, more inclusive future for all.</p>',
  'Pranav Gujar',
  'Education',
  '6 min read',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Technology', 'Youth', 'Education'],
  '2024-03-12'
),
(
  'sustainable-communities-and-student-impact',
  'Sustainable Communities and Student Impact',
  'Eco-campaigns and awareness build sustainable student communities globally.',
  '<p>Sustainability is no longer a buzzword; it is a call to action. Around the world, students are leading the charge in building eco-conscious communities and reshaping the way we think about the environment. From reducing plastic use to spearheading renewable energy campaigns, young people are proving that small steps can create meaningful global change.</p><br> <p>One of the most powerful tools for sustainability lies in awareness. Students organizing campaigns, workshops, and green clubs are raising awareness about pressing issues such as climate change, waste reduction, and conservation. This peer-to-peer learning not only educates but also inspires entire communities to adopt eco-friendly practices.</p><br> <p>Beyond awareness, action is critical. Many community-driven and youth initiatives focus on recycling programs, tree-planting drives, and energy conservation projects. In doing so, students learn valuable lessons about leadership and responsibility while directly impacting their local environment. These grassroots projects ripple outward, influencing families, neighborhoods, and policy discussions.</p><br> <p>Technology also plays a significant role. Social media allows young activists to amplify their messages, connect with global networks, and advocate for systemic changes. Platforms like Instagram and TikTok have become spaces where sustainability movements gain momentum, empowering youth voices to reach policymakers and businesses alike.</p><br> <p>Building sustainable communities requires collaboration. Students who work hand-in-hand with educators, local governments, and NGOs can scale their impact and create lasting change. Whether through eco-hackathons, clean energy prototypes, or awareness campaigns, their contributions highlight the creativity and determination of the next generation.</p><br> <p>The ultimate impact of youth-driven sustainability is not only environmental but also social. By fostering responsibility, empathy, and a sense of collective purpose, students are cultivating communities that thrive on shared values. Their leadership proves that sustainability is not an option but an essential path toward a healthier and more equitable future.</p>',
  'Pranav Gujar',
  'Impact',
  '7 min read',
  'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Sustainability', 'Community', 'Impact'],
  '2023-11-05'
),
(
  'global-development-leadership-trends-ahead',
  'Global Development: Next-Generation Leadership Trends',
  'Emerging leadership trends reshape global development with innovation and impact.',
  '<p>The future of global development is being shaped not only by policymakers and organizations but also by students. With innovation, determination, and digital fluency, today’s youth are redefining the way societies address issues such as poverty, education, and equality. Their leadership is setting new trends that promise long-lasting impact worldwide.</p><br> <p>One trend is the rise of social entrepreneurship. Students are launching startups that address local and global challenges, from clean water initiatives to sustainable farming solutions. These ventures not only solve pressing issues but also generate employment and foster innovation at the grassroots level.</p><br> <p>Another trend is digital advocacy. Students are using online platforms to voice concerns about climate change, human rights, and gender equality. Their ability to mobilize audiences quickly has turned grassroots movements into global campaigns, influencing decision-makers and shaping public opinion.</p><br> <p>Collaborative learning is also gaining traction. International student exchange programs, hackathons, and global forums are giving young people platforms to share ideas, challenge perspectives, and co-create solutions. These experiences broaden their worldview and prepare them to be inclusive leaders in diverse communities.</p><br> <p>Technology plays a central role in amplifying these trends. With access to AI, data analysis, and virtual learning, students are building tools that predict problems and propose innovative solutions. Their ability to merge technology with social impact is redefining what development looks like in the 21st century.</p><br> <p>As these trends gain momentum, it becomes clear that the role of students in global development is not marginal—it is essential. By empowering them with resources, mentorship, and opportunities, society can unlock the full potential of youth leadership. The future of development is bright, and it is driven by purpose, innovation, and next-generation leadership.</p>',
  'Pranav Gujar',
  'Development',
  '5 min read',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Future', 'Development', 'Trends'],
  '2025-02-18'
),
(
  'graduate-journeys-inspiring-change-stories',
  'Graduate Journeys: Inspiring Change Stories',
  'Graduates’ resilience sparks community inspiration and positive change.',
  '<p>Graduating is more than earning a degree; it’s the beginning of a journey that often inspires change within communities. Around the world, graduates are using their skills, resilience, and stories of perseverance to spark meaningful transformation, proving that education is one of the most powerful tools for change.</p><br> <p>Many graduates return to their hometowns with a vision to uplift their communities. Some open schools to provide better education for local children, while others launch social enterprises that address pressing issues like unemployment or healthcare. Their actions showcase how education extends beyond personal growth to collective advancement.</p><br> <p>Stories of resilience also inspire others. Graduates who overcame poverty, discrimination, or other challenges often share their journeys, encouraging younger students to dream big and pursue education. These narratives not only motivate but also build a culture of persistence and hope.</p><br> <p>Moreover, graduates play a crucial role in mentoring. By guiding younger students through internships, workshops, and volunteer programs, they ensure that the next generation has the tools and confidence to succeed. This cycle of mentorship strengthens community bonds and creates a ripple effect of progress.</p><br> <p>In many cases, graduate journeys also contribute to global networks. By joining international organizations or research collaborations, they bring back knowledge and connections that further enrich local communities. Their ability to bridge the local and global fosters innovation and inclusion.</p><br> <p>Ultimately, graduate stories highlight that success is not measured solely by personal achievement but by the positive change one brings to society. Their journeys inspire us to believe in the transformative power of education and to continue supporting learners at every stage of their path.</p>',
  'Pranav Gujar',
  'Success Stories',
  '4 min read',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Success', 'Graduates', 'Community'],
  '2023-12-28'
),
(
  'innovating-classrooms-for-future-learning',
  'Innovating Classrooms for Future Learning',
  'Blending innovation and tech makes learning inclusive and impactful.',
  '<p>Classrooms today are undergoing a significant transformation. With innovation and technology at the forefront, the traditional image of chalkboards and lecture-style teaching is giving way to interactive, inclusive, and impactful learning spaces. The classrooms of the future are not defined by four walls but by limitless opportunities to explore, engage, and grow.</p><br> <p>One major shift is the integration of digital tools. From smart boards and learning apps to virtual labs, these tools make lessons more engaging and accessible. Students can visualize complex concepts, collaborate in real time, and access resources that were once unimaginable in conventional education.</p><br> <p>Inclusivity is another powerful benefit of classroom innovation. Adaptive technologies allow students with disabilities to learn alongside their peers with greater ease. Voice recognition software, screen readers, and AI-driven tutors are ensuring that every learner, regardless of their abilities, can actively participate and succeed.</p><br> <p>Future classrooms also prioritize creativity and critical thinking. Instead of memorization-heavy models, project-based and experiential learning encourage students to innovate and apply knowledge to real-life problems. This hands-on approach not only boosts engagement but also prepares learners for the demands of the modern workforce.</p><br> <p>Teachers, too, are embracing new roles as facilitators rather than traditional lecturers. By guiding discussions, encouraging collaboration, and integrating technology, they help students take ownership of their learning journeys. This shift empowers learners to be self-driven and adaptable in rapidly changing environments.</p><br> <p>As classrooms continue to innovate, the goal remains clear: to create learning spaces that are inclusive, dynamic, and impactful. The future of education lies in embracing change, fostering creativity, and ensuring that every student is prepared for the challenges and opportunities of tomorrow.</p>',
  'Pranav Gujar',
  'Education',
  '8 min read',
  'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Innovation', 'Education', 'Technology'],
  '2025-07-09'
),
(
  'partnerships-driving-greater-student-impact',
  'Partnerships Driving Greater Student Impact',
  'Collaboration expands student growth, leadership, and learning opportunities.',
  '<p>Partnerships are at the heart of meaningful student impact. When educational institutions, organizations, and communities come together, they create opportunities that extend far beyond the classroom. These collaborations empower students to grow, lead, and contribute to society in profound ways.</p><br> <p>One of the most important benefits of partnerships is access to resources. NGOs, businesses, and universities often provide scholarships, mentorship programs, and training workshops that give students exposure to new skills and experiences. This access bridges the gap between learning and real-world application.</p><br> <p>Partnerships also strengthen leadership. Collaborative projects allow students to take on responsibilities, solve challenges, and work with diverse teams. These experiences foster resilience, problem-solving, and communication skills that prepare them for future careers and community leadership.</p><br> <p>Global partnerships open even more doors. International exchanges, joint research initiatives, and cross-border collaborations give students a platform to understand different cultures and perspectives. This global exposure builds empathy, adaptability, and a sense of shared responsibility in addressing global challenges.</p><br> <p>Moreover, partnerships benefit entire communities. When students bring back knowledge, innovations, and solutions, they uplift local economies, improve social well-being, and inspire others to engage in collaborative growth. It creates a cycle of impact where students not only benefit but also become catalysts of positive change.</p><br> <p>In the long run, partnerships are not just about temporary projects—they are investments in the future. By creating ecosystems of collaboration, we empower students to be changemakers who drive innovation, inclusion, and progress worldwide.</p>',
  'Pranav Gujar',
  'Partnerships',
  '6 min read',
  'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['Partnership', 'Collaboration', 'Impact'],
  '2024-08-22'
)
ON CONFLICT (slug) DO NOTHING;
