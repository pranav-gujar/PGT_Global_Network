import React from "react";
import { Cpu, ExternalLink, Calendar, Building2, Sparkles } from "lucide-react";
import HeroBackground from "../components/HeroBackground";
import AnimatedCard from "../components/AnimatedCard";

// Define the schema for a Venture card to ensure clean configuration scale
interface Venture {
  id: string;
  name: string;
  motto: string;
  description: string;
  status: "Launching Soon" | "Coming Soon" | "Active";
  launchDate: string;
  websiteUrl: string;
  theme: {
    glow: string;      // Radial background gradient hover glow
    border: string;    // Hover border color
    shadow: string;    // Custom shadow hover effect
    iconBg: string;    // Background color for logo wrapper
  };
}

// ----------------------------------------------------
// ECOSYSTEM CONFIGURATION DATA
// Scalability: Add new ventures to this array to dynamically render them on the page
// ----------------------------------------------------
const VENTURES_DATA: Venture[] = [
  {
    id: "pgt-technologies",
    name: "PGT Technologies",
    // TEMPORARY MOTTO PLACEHOLDER: Can be modified/replaced when branding is finalized
    motto: "Empowering communities through next-generation digital platforms.",
    // TEMPORARY DESCRIPTION PLACEHOLDER: Update with final services, tagline, and copy later
    description: "Developing state-of-the-art technological solutions and digital tools built to streamline network operations and empower students worldwide.",
    status: "Launching Soon",
    launchDate: "1 August 2026",
    // TEMPORARY URL PLACEHOLDER: Update to the final live subdomain when launched
    websiteUrl: "https://technologies.pgtglobalnetwork.com",
    theme: {
      glow: "from-blue-500/10",
      border: "group-hover:border-blue-400/40",
      shadow: "group-hover:shadow-blue-500/5",
      iconBg: "bg-blue-50 border-blue-100 text-blue-600",
    }
  }
];

interface VentureCardProps {
  venture: Venture;
}

// Reusable Venture Card Component
const VentureCard: React.FC<VentureCardProps> = ({ venture }) => {
  return (
    <AnimatedCard animation="slideUp">
      <div
        className={`relative overflow-hidden bg-white/70 border border-slate-200/50 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-100/40 transition-all duration-350 group flex flex-col md:flex-row gap-8 items-center ${venture.theme.shadow} ${venture.theme.border}`}
      >
        {/* Hover Theme Radial Glow */}
        <div className={`absolute -inset-[1px] bg-gradient-to-br ${venture.theme.glow} to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

        {/* Custom SVG / Icon Placeholder Logo */}
        {/* TEMPORARY LOGO CONTAINER: Replace this element or Cpu icon with the final logo image asset */}
        <div className="relative z-10 flex-shrink-0">
          <div className={`w-20 h-20 rounded-2xl ${venture.theme.iconBg} border flex items-center justify-center shadow-sm relative group-hover:scale-105 transition-all duration-300`}>
            <Cpu className="h-10 w-10 animate-pulse" />
            {/* Small label marker for developer review */}
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </div>
          <div className="text-[9px] font-bold text-center text-slate-400 uppercase tracking-widest mt-2 block sm:hidden">
            Temp Logo
          </div>
        </div>

        {/* Venture Details Content */}
        <div className="flex-1 space-y-4 relative z-10 w-full text-center md:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-3">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {venture.name}
            </h3>
            <span className="inline-flex items-center justify-center px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-full tracking-wide">
              {venture.status}
            </span>
          </div>

          {/* Tagline / Motto */}
          <p className="text-xs font-bold text-indigo-650 uppercase tracking-wider font-mono">
            {venture.motto}
          </p>

          {/* Description */}
          <p className="text-sm text-slate-550 leading-relaxed max-w-2xl">
            {venture.description}
          </p>

          {/* Metadata Block (Launch details & website target) */}
          <div className="pt-2 flex flex-col sm:flex-row justify-center md:justify-start items-center gap-5 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Launching {venture.launchDate}
            </span>
            <span className="text-[10px] font-bold text-slate-350 uppercase tracking-wider hidden sm:inline">|</span>
            <span className="text-slate-450 hover:text-indigo-650 transition-colors">
              Target: technologies.pgtglobalnetwork.com
            </span>
          </div>

          {/* Visit Website CTA */}
          <div className="pt-3 flex justify-center md:justify-start">
            <a
              href={venture.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:scale-103"
            >
              Visit Website
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

// Main Ventures Ecosystem Page Component
const Ventures = () => {
  return (
    <div className="relative min-h-screen py-32 px-4 sm:px-6 lg:px-8 bg-slate-50/50 overflow-hidden">
      <HeroBackground />

      <div className="max-w-5xl mx-auto z-10 relative">
        {/* Header Section */}
        <AnimatedCard animation="fadeIn">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> PGT umbrella
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mt-3 mb-6 font-sans">
              The PGT Ecosystem
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
              PGT Global Network is building an ecosystem of ventures across different domains,
              each working toward the broader mission of creating positive impact and driving global
              community transformation.
            </p>
          </div>
        </AnimatedCard>

        {/* Current Active Ventures Group */}
        <div className="space-y-8">
          <AnimatedCard animation="slideUp">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200/50 pb-3">
              <Building2 className="h-5 w-5 text-indigo-650" />
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-widest">
                Our Ventures
              </h2>
            </div>
          </AnimatedCard>

          <div className="space-y-6">
            {VENTURES_DATA.map((venture) => (
              <VentureCard key={venture.id} venture={venture} />
            ))}
          </div>
        </div>

        {/* Future Ventures Placeholder Section */}
        <div className="mt-20">
          <AnimatedCard animation="slideUp" delay={200}>
            <div className="bg-slate-50/40 border border-slate-200/60 backdrop-blur-sm p-8 sm:p-10 rounded-3xl text-center shadow-sm relative overflow-hidden group">
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-indigo-50/20 rounded-full blur-2xl group-hover:bg-indigo-50/40 transition-colors duration-500"></div>

              <div className="w-12 h-12 bg-indigo-50/60 border border-indigo-100/60 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-600 group-hover:scale-105 transition-all duration-300">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-850 tracking-tight mb-2">
                Future Ventures
              </h3>

              <p className="text-sm text-slate-555 max-w-lg mx-auto leading-relaxed font-medium">
                More ventures are currently under development and will be announced soon.
                We are actively designing solutions in education, creative media, and networking domains.
              </p>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default Ventures;
