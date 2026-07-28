import React from "react";
import { ExternalLink, Calendar, Building2, Sparkles, Globe } from "lucide-react";
import HeroBackground from "../components/HeroBackground";
import AnimatedCard from "../components/AnimatedCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { usePageLoading } from "../hooks/usePageLoading";
import { useLanguage } from "../contexts/LanguageContext";

// ── Venture data schema ───────────────────────────────────────────────────────
interface Venture {
  id: string;
  name: string;
  motto: string;
  description: string;
  status: "Active" | "Launching Soon" | "Coming Soon";
  /** Human-readable founding / launch label */
  foundedLabel: string;
  /** The date value itself */
  foundedDate: string;
  /** Plain subdomain — no https:// prepended */
  websiteDisplay: string;
  websiteUrl: string;
  /** Path relative to /public */
  logo: string;
  theme: {
    accent: string;        // Tailwind text-* for accent colour
    glowFrom: string;      // gradient-from class for hover glow
    glowBorder: string;    // border class on hover
    badgeBg: string;       // status badge background
    badgeText: string;     // status badge text colour
    logoBg: string;        // logo container background
    logoBorder: string;    // logo container border
    btnBg: string;         // CTA button background
    btnHover: string;      // CTA button hover background
    btnShadow: string;     // CTA button shadow
  };
}

// ── Ordered venture list ──────────────────────────────────────────────────────
// Order: Publications first (oldest), Technologies second (newest)
const VENTURES: Venture[] = [
  {
    id: "pgt-publications",
    name: "PGT Publications",
    motto: "Lasting Ideas",
    description:
      "PGT Publications is the publishing and knowledge division of PGT Global Network. It is dedicated to creating, publishing, and preserving meaningful ideas through books, articles, educational resources, and future research publications. The venture reflects PGT's commitment to lifelong learning, intellectual growth, and knowledge that creates lasting impact.",
    status: "Active",
    foundedLabel: "Founded",
    foundedDate: "1 January 2024",
    websiteDisplay: "publications.pgtglobalnetwork.com",
    websiteUrl: "https://publications.pgtglobalnetwork.com",
    logo: "/ventures/pgt-publications-logo.png",
    theme: {
      accent: "text-violet-600 dark:text-violet-400",
      glowFrom: "from-violet-500/10",
      glowBorder: "group-hover:border-violet-400/35",
      badgeBg: "bg-emerald-50/15 dark:bg-emerald-950/20 border-emerald-300/25",
      badgeText: "text-emerald-700 dark:text-emerald-400",
      logoBg: "bg-white dark:bg-slate-900/60",
      logoBorder: "border-violet-200/30 dark:border-violet-700/30",
      btnBg: "bg-violet-600 hover:bg-violet-700",
      btnHover: "hover:shadow-violet-500/20",
      btnShadow: "shadow-violet-500/10",
    },
  },
  {
    id: "pgt-technologies",
    name: "PGT Technologies",
    motto: "Future Engineered",
    description:
      "PGT Technologies is the technology and innovation division of PGT Global Network. It develops modern digital solutions including websites, software, AI-powered applications, automation systems, and technology services for organizations, businesses, and communities while building products that create meaningful real-world impact.",
    status: "Launching Soon",
    foundedLabel: "Launching",
    foundedDate: "15 August 2026",
    websiteDisplay: "technologies.pgtglobalnetwork.com",
    websiteUrl: "https://technologies.pgtglobalnetwork.com",
    logo: "/ventures/pgt-technologies-logo.png",
    theme: {
      accent: "text-blue-600 dark:text-blue-400",
      glowFrom: "from-blue-500/10",
      glowBorder: "group-hover:border-blue-400/35",
      badgeBg: "bg-amber-50/15 dark:bg-amber-950/20 border-amber-300/25",
      badgeText: "text-amber-700 dark:text-amber-400",
      logoBg: "bg-white dark:bg-slate-900/60",
      logoBorder: "border-blue-200/30 dark:border-blue-700/30",
      btnBg: "bg-blue-600 hover:bg-blue-700",
      btnHover: "hover:shadow-blue-500/20",
      btnShadow: "shadow-blue-500/10",
    },
  },
];

// ── Venture Card ──────────────────────────────────────────────────────────────
interface VentureCardProps {
  venture: Venture;
  index: number;
}

const VentureCard: React.FC<VentureCardProps> = ({ venture, index }) => {
  const { t } = useLanguage();

  const statusLabel =
    venture.status === "Launching Soon"
      ? t("ventures.launchingSoon") === "ventures.launchingSoon"
        ? "Launching Soon"
        : t("ventures.launchingSoon")
      : venture.status === "Coming Soon"
      ? t("ventures.comingSoon") === "ventures.comingSoon"
        ? "Coming Soon"
        : t("ventures.comingSoon")
      : "Active";

  return (
    <AnimatedCard animation="slideUp" delay={index * 120}>
      <article
        className={`relative overflow-hidden bg-card border border-border rounded-3xl shadow-xl shadow-slate-950/8 dark:shadow-none transition-all duration-400 group ${venture.theme.glowBorder}`}
      >
        {/* Hover radial glow */}
        <div
          className={`absolute -inset-[1px] bg-gradient-to-br ${venture.theme.glowFrom} to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        />

        <div className="relative z-10 p-8 sm:p-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">

          {/* ── Logo block ── */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl ${venture.theme.logoBg} border ${venture.theme.logoBorder} flex items-center justify-center p-3 shadow-sm group-hover:scale-105 transition-transform duration-300 overflow-hidden`}
            >
              <img
                src={venture.logo}
                alt={`${venture.name} logo`}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
            {/* Status badge — centred under logo */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${venture.theme.badgeBg} ${venture.theme.badgeText}`}
            >
              {venture.status === "Active" && (
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
              )}
              {statusLabel}
            </span>
          </div>

          {/* ── Content block ── */}
          <div className="flex-1 space-y-4 text-left">

            {/* Name + Motto */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight mb-1">
                {venture.name}
              </h3>
              <p className={`text-xs font-bold uppercase tracking-[0.18em] font-mono ${venture.theme.accent}`}>
                {venture.motto}
              </p>
            </div>

            {/* Divider */}
            <div className="w-12 h-px bg-border" />

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {venture.description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              {/* Founded / Launch date */}
              <span className="inline-flex items-center gap-1.5 bg-muted border border-border px-3 py-1.5 rounded-xl font-semibold text-foreground">
                <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                {venture.foundedLabel}: {venture.foundedDate}
              </span>

              {/* Website */}
              <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground/70 hover:text-foreground transition-colors duration-200 cursor-default select-all">
                <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                {venture.websiteDisplay}
              </span>
            </div>

            {/* Visit Website CTA */}
            <div className="pt-2">
              <a
                href={venture.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-2.5 ${venture.theme.btnBg} text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-md ${venture.theme.btnShadow} ${venture.theme.btnHover} hover:scale-[1.03] active:scale-[0.97]`}
              >
                {t("ventures.visitWebsite") === "ventures.visitWebsite"
                  ? "Visit Website"
                  : t("ventures.visitWebsite")}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </article>
    </AnimatedCard>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────
const Ventures = () => {
  const loading = usePageLoading();
  const { t } = useLanguage();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pt-28 bg-background overflow-x-hidden transition-colors duration-300">
      <style>{`
        @keyframes reveal-up {
          0%   { opacity: 0; transform: translateY(24px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
        .animate-reveal-up {
          animation: reveal-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {/* ── Hero ── */}
      <AnimatedCard animation="fadeIn">
        <section className="relative overflow-hidden py-24 sm:py-32">
          <HeroBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Tagline badge */}
            <div
              className="inline-flex items-center gap-2 bg-card/90 border border-border px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.03)] mb-8 animate-reveal-up backdrop-blur-md hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] hover:border-indigo-400/40 hover:-translate-y-[1px] transform transition-all duration-300 cursor-pointer"
              style={{ animationDelay: "100ms" }}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              <span className="text-xs font-bold text-foreground/80 tracking-wide uppercase">
                {t("ventures.tagline")}
              </span>
            </div>

            <h1
              className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: "250ms" }}
            >
              {t("ventures.title")}
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: "400ms" }}
            >
              {t("ventures.description")}
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* ── Ventures list ── */}
      <section className="py-24 bg-card/25 border-b border-border relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <AnimatedCard animation="slideUp">
            <div className="flex items-center gap-3 mb-10 border-b border-border pb-4">
              <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-foreground uppercase tracking-widest">
                {t("ventures.heading")}
              </h2>
            </div>
          </AnimatedCard>

          {/* Cards */}
          <div className="space-y-8">
            {VENTURES.map((venture, i) => (
              <VentureCard key={venture.id} venture={venture} index={i} />
            ))}
          </div>

          {/* Future ventures placeholder */}
          <div className="mt-20">
            <AnimatedCard animation="slideUp" delay={300}>
              <div className="bg-card border border-border backdrop-blur-sm p-8 sm:p-10 rounded-3xl text-center shadow-sm relative overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors duration-500" />
                <div className="w-12 h-12 bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/25 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-all duration-300">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground tracking-tight mb-2">
                  {t("ventures.futureTitle")}
                </h3>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed font-medium">
                  {t("ventures.futureDesc")}
                </p>
              </div>
            </AnimatedCard>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Ventures;
