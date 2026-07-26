import React from 'react';
import { FileText, Scale, Shield, AlertTriangle, Users, Globe } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';

import LoadingSpinner from '../components/LoadingSpinner';
import { usePageLoading } from '../hooks/usePageLoading';


const Terms = () => {
  const loading = usePageLoading();

  const sections = [
    {
      icon: Users,
      title: 'User Responsibilities',
      items: [
        'Provide accurate and complete information during registration',
        'Maintain confidentiality of account credentials',
        'Use our services in compliance with applicable laws',
        'Respect intellectual property rights of PGT and others'
      ]
    },
    {
      icon: Shield,
      title: 'Prohibited Activities',
      items: [
        'Harassment, discrimination, or harmful behavior toward others',
        'Sharing false, misleading, or inappropriate content',
        'Attempting to gain unauthorized access to our systems',
        'Using our services for illegal or unethical purposes'
      ]
    },
    {
      icon: Globe,
      title: 'Intellectual Property',
      items: [
        'All content and materials are owned by PGT Global Network',
        'Users retain rights to their original contributions',
        'Limited license granted for personal, non-commercial use',
        'Respect for third-party intellectual property rights'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      items: [
        'Services provided "as is" without warranties',
        'No liability for indirect or consequential damages',
        'Maximum liability limited to fees paid (if any)',
        'Users responsible for their own decisions and actions'
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
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">Legal Terms</span>
            </div>

            <h1
              className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              Terms & Conditions
            </h1>
            <p
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              Please read these terms carefully before using our services and participating in our programs.
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
                <strong>Last Updated:</strong> July 15, 2026 | <strong>Effective Date:</strong> September 15, 2025
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
                Welcome to PGT Global Network. These Terms and Conditions ("Terms") govern your use of our
                website, programs, and services. By accessing or using our services, you agree to be bound
                by these Terms and our Privacy Policy.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed font-normal">
                If you do not agree with any part of these Terms, please do not use our services.
                We reserve the right to modify these Terms at any time, and your continued use constitutes
                acceptance of any changes.
              </p>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Key Terms Grid */}
      <section className="py-24 bg-slate-50/20 border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="slideUp">
            <div className="text-center mb-20">
              <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">overview</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
                Key Terms Overview
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Understanding your rights and responsibilities when using our services
              </p>
            </div>
          </AnimatedCard>

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
                    <h3 className="text-xl font-bold text-slate-800">{section.title}</h3>
                  </div>
                  <ul className="space-y-3 relative z-10">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-655 text-xs sm:text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="py-24 bg-white relative z-10 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Acceptance of Terms */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">1. Acceptance of Terms</h2>
              <div className="text-slate-600 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  By accessing and using PGT Global Network's website, programs, and services, you acknowledge
                  that you have read, understood, and agree to be bound by these Terms and Conditions, as well
                  as our Privacy Policy.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and PGT Global Network.
                  If you are using our services on behalf of an organization, you represent that you have
                  the authority to bind that organization to these Terms.
                </p>
              </div>
            </div>

            {/* Services Description */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">2. Description of Services</h2>
              <div className="text-slate-600 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>PGT Global Network provides:</p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Educational programs and workshops (D3, VoA, Seminarix, MotivMinds, HED)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Online learning platforms and resources</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Community networking and mentorship opportunities</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Career development and placement assistance</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Research and impact measurement services</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-505 pt-2">
                  We reserve the right to modify, suspend, or discontinue any service at any time without
                  prior notice. We are not liable for any modification, suspension, or discontinuation of services.
                </p>
              </div>
            </div>

            {/* User Accounts */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">3. User Accounts and Registration</h2>
              <div className="text-slate-600 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>To access certain services, you may need to create an account. You agree to:</p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide accurate, current, and complete information during registration</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Maintain and update your information to keep it accurate and current</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Maintain the security and confidentiality of your account credentials</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Notify us immediately of any unauthorized use of your account</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Accept responsibility for all activities under your account</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-505 pt-2">
                  We reserve the right to suspend or terminate accounts that violate these Terms or
                  engage in prohibited activities.
                </p>
              </div>
            </div>

            {/* Program Participation */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">4. Program Participation</h2>
              <div className="text-slate-600 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>Participation in our programs is subject to:</p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Meeting eligibility criteria and application requirements</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Completing any required assessments or interviews</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Adhering to program schedules and attendance requirements</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Maintaining respectful and professional conduct</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Completing program evaluations and feedback requests</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-505 pt-2">
                  Program completion certificates are awarded based on meeting specified requirements.
                  We reserve the right to remove participants who violate program guidelines or these Terms.
                </p>
              </div>
            </div>

            {/* Content and Conduct */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">5. Content and Conduct Guidelines</h2>
              <div className="text-slate-600 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>When using our services, you agree not to:</p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Post or share content that is illegal, harmful, threatening, or discriminatory</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Infringe on intellectual property rights of others</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Engage in harassment, bullying, or inappropriate behavior</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Attempt to gain unauthorized access to our systems or other users' accounts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use our services for commercial purposes without prior written consent</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Distribute spam, malware, or other harmful content</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-505 pt-2">
                  We reserve the right to remove content and suspend users who violate these guidelines.
                </p>
              </div>
            </div>

            {/* Privacy and Data Protection */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">6. Privacy and Data Protection</h2>
              <div className="text-slate-600 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  Your privacy is important to us. Our collection, use, and protection of your personal
                  information is governed by our Privacy Policy, which is incorporated into these Terms
                  by reference.
                </p>
                <p>
                  By using our services, you consent to the collection and use of your information as
                  described in our Privacy Policy. You also agree that we may use anonymized, aggregated
                  data for research, impact measurement, and service improvement purposes.
                </p>
              </div>
            </div>

            {/* Disclaimers and Warranties */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">7. Disclaimers and Warranties</h2>
              <div className="text-slate-605 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  Our services are provided "as is" and "as available" without warranties of any kind,
                  either express or implied. We disclaim all warranties, including but not limited to:
                </p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Merchantability and fitness for a particular purpose</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Non-infringement of third-party rights</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Accuracy, completeness, or reliability of content</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Uninterrupted or error-free operation of services</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-505 pt-2">
                  While we strive to provide high-quality programs and services, we cannot guarantee
                  specific outcomes or results from participation in our programs.
                </p>
              </div>
            </div>

            {/* Termination */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">8. Termination</h2>
              <div className="text-slate-605 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  Either party may terminate this agreement at any time. We may suspend or terminate
                  your access to our services immediately, without prior notice, for any reason, including:
                </p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Violation of these Terms or our policies</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Fraudulent, abusive, or illegal activity</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Extended periods of inactivity</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Technical or security reasons</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-505 pt-2">
                  Upon termination, your right to use our services ceases immediately, but these Terms
                  will continue to apply to any prior use of our services.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">9. Governing Law and Dispute Resolution</h2>
              <div className="text-slate-605 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  These Terms are governed by the laws of Canada, without regard to conflict of law principles.
                  Any disputes arising from these Terms or your use of our services will be resolved through:
                </p>
                <ol className="list-decimal space-y-2 pl-4">
                  <li className="flex items-start gap-2.5">
                    <span className="font-semibold text-slate-800">1.</span>
                    <span>Good faith negotiations between the parties</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-semibold text-slate-800">2.</span>
                    <span>Mediation, if negotiations are unsuccessful</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-semibold text-slate-800">3.</span>
                    <span>Binding arbitration, if mediation fails</span>
                  </li>
                </ol>
                <p className="text-xs text-slate-505 pt-2">
                  You agree to submit to the jurisdiction of the courts in Toronto, Ontario, Canada,
                  for any legal proceedings related to these Terms.
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">10. Changes to Terms</h2>
              <div className="text-slate-605 space-y-4 leading-relaxed font-normal text-sm sm:text-base">
                <p>
                  We reserve the right to modify these Terms at any time. When we make changes, we will:
                </p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Update the "Last Updated" date at the top of this page</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Notify users via email or prominent website notice for material changes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide a reasonable notice period before changes take effect</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-505 pt-2">
                  Your continued use of our services after any changes constitutes acceptance of the
                  modified Terms. If you do not agree with the changes, you should discontinue use of our services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10 border-t border-white/[0.04]">
          <Background />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Questions About These Terms?
            </h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 leading-relaxed font-normal">
              If you have questions about these Terms and Conditions, please contact us:
            </p>

            <div className="flex justify-center relative z-10">
              <div className="bg-white/95 backdrop-blur border border-slate-200/60 shadow-2xl p-8 rounded-2xl w-80 text-center group cursor-pointer relative overflow-hidden">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.04] to-transparent rounded-2xl pointer-events-none" />

                <h3 className="text-lg font-bold text-slate-900 mb-4">T&C Query</h3>
                <div className="space-y-2 text-slate-700 text-xs sm:text-sm font-normal">
                  <p>Email: <a href="mailto:office@pgtglobalnetwork.com" className="text-indigo-600 font-semibold hover:underline">office@pgtglobalnetwork.com</a></p>
                  <p>Phone: <a href="tel:+918999902805" className="text-slate-600 hover:underline">+91 8999902805</a></p>
                  <p className="text-[10px] text-slate-400 font-mono pt-2">Response Time: Within 5 business days</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Terms;