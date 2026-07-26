import React from 'react';
import { Shield, Eye, Lock, Users, Globe, FileText } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';

import LoadingSpinner from '../components/LoadingSpinner';
import { usePageLoading } from '../hooks/usePageLoading';

const Privacy = () => {
  const loading = usePageLoading();

  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Personal information you provide when registering for programs or contacting us',
        'Usage data and analytics from our website and digital platforms',
        'Communication records including emails, messages, and feedback',
        'Program participation data and progress tracking information'
      ]
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'To deliver our programs and services effectively',
        'To communicate with you about programs, updates, and opportunities',
        'To improve our services and develop new programs',
        'To comply with legal obligations and protect our rights'
      ]
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: [
        'We do not sell, trade, or rent your personal information to third parties',
        'We may share information with trusted partners who help deliver our programs',
        'We may disclose information when required by law or to protect safety',
        'Anonymous, aggregated data may be used for research and impact reporting'
      ]
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures to protect your data',
        'All sensitive information is encrypted during transmission and storage',
        'Access to personal data is restricted to authorized personnel only',
        'Regular security audits and updates are conducted to maintain protection'
      ]
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-28 bg-slate-50/30 overflow-x-hidden">
      <style>
        {`
          @keyframes reveal-up {
            0% { opacity: 0; transform: translateY(24px); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          .animate-reveal-up {
            animation: reveal-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
        `}
      </style>

      {/* Hero Section */}
      <AnimatedCard animation="fadeIn">
        <section className="relative overflow-hidden py-24 sm:py-32">
          <HeroBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Tagline Badge */}
            <div
              className="inline-flex items-center gap-2 bg-white/95 border border-slate-200/60 px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.03)] mb-8 animate-reveal-up backdrop-blur-md hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] hover:border-indigo-400/40 hover:-translate-y-[1px] transform transition-all duration-300 pointer-events-auto cursor-pointer"
              style={{ animationDelay: '100ms' }}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">Legal Information</span>
            </div>

            <h1
              className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              Privacy Policy
            </h1>
            <p
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Last Updated */}
      <section className="py-8 bg-slate-55/40 border-b border-slate-150/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center">
              <p className="text-slate-500 text-xs font-mono tracking-wider uppercase">
                <strong>Last Updated:</strong> July 15, 2026
              </p>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white border-b border-slate-100 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-slate-700 space-y-6">
              <p className="text-lg sm:text-xl text-slate-650 leading-relaxed font-normal">
                At PGT Global Network, your privacy matters to us. This policy explains how we collect, use, and safeguard your personal information when you engage with our website, programs, and services.
                By using our services, you agree to the practices described below.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed font-normal">
                By using our services, you agree to the collection and use of information in accordance with
                this policy. We encourage you to read this policy carefully and contact us if you have any questions.
              </p>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-24 bg-slate-50/20 border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <AnimatedCard key={index} animation="slideUp" delay={index * 100}>
                <div className="relative overflow-hidden bg-white/70 border border-slate-200/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl shadow-slate-100/30 hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/[0.02] hover:-translate-y-1 transform transition-all duration-300 group cursor-pointer h-full">
                  {/* Subtle Theme Radial Glow Overlay */}
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform duration-300">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
                  </div>
                  <ul className="space-y-3 relative z-10">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-24 bg-white relative z-10 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Cookies and Tracking */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-650">
                  <Globe className="h-5 w-5" />
                </div>
                Cookies & Tracking
              </h2>
              <div className="text-slate-600 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  We use cookies to:
                </p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Remember preferences and enhance your experience.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Analyze website traffic and trends.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Improve functionality and content.</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-500 pt-2 font-mono">
                  You may disable cookies in your browser, but some features may not work properly.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-655">
                  <FileText className="h-5 w-5" />
                </div>
                Your Rights
              </h2>
              <div className="text-slate-600 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>You may:</p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Request access, correction, or deletion of your data.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Object to certain uses or withdraw consent.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Request data portability (transfer of your data).</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-500 pt-2 font-mono">
                  Contact us at office@pgtglobalnetwork.com to exercise these rights. We respond within 30 days.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Data Retention</h2>
              <div className="text-slate-600 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  We retain your personal information only for as long as necessary to fulfill the purposes:
                </p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Program records: 7 years</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Communication logs: 3 years</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Financial records: As legally required</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-500 pt-2 font-mono">
                  After this period, data is securely deleted or anonymized.
                </p>
              </div>
            </div>

            {/* International Transfers */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">International Data Transfers</h2>
              <div className="text-slate-600 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  As a global organization, your data may be transferred internationally. We ensure safeguards such as standard contractual clauses and compliance with local regulations:
                </p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Adequacy decisions by relevant data protection authorities</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Standard contractual clauses approved by regulatory bodies</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Certification schemes and codes of conduct</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Binding corporate rules for intra-group transfers</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Children's Privacy</h2>
              <div className="text-slate-655 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  Our services are not directed to children under 13 years of age. We do not knowingly
                  collect personal information from children under 13. If you are a parent or guardian
                  and believe your child has provided us with personal information, please contact us
                  immediately so we can delete such information.
                </p>
                <p>
                  For participants between 13-18 years old, we require parental consent before collecting
                  any personal information or allowing participation in our programs.
                </p>
              </div>
            </div>

            {/* Updates to Policy */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Updates to This Policy</h2>
              <div className="text-slate-655 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices
                  or applicable laws. We will notify you of any material changes by:
                </p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Posting the updated policy on our website</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Sending email notifications to registered users</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Displaying prominent notices on our platforms</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-500 pt-2 font-mono">
                  Your continued use of our services after any changes indicates your acceptance of the
                  updated Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10">
          <Background />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Contact Us About Privacy
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 leading-relaxed font-normal">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>

            <div className="flex justify-center relative z-10">
              <div className="bg-white/95 backdrop-blur border border-slate-200/60 shadow-2xl p-8 rounded-2xl w-80 text-center group cursor-pointer relative overflow-hidden">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.04] to-transparent rounded-2xl pointer-events-none" />

                <h3 className="text-lg font-bold text-slate-900 mb-4">Privacy Query</h3>
                <div className="space-y-2 text-slate-700 text-xs sm:text-sm font-normal">
                  <p>Email: <a href="mailto:office@pgtglobalnetwork.com" className="text-indigo-600 font-semibold hover:underline">office@pgtglobalnetwork.com</a></p>
                  <p>Phone: <a href="tel:+918999902805" className="text-slate-600 hover:underline">+91 8999902805</a></p>
                  <p className="text-[10px] text-slate-400 font-mono pt-2">Response Time: Within 48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Privacy;