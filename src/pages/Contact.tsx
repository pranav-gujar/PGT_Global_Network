import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ChevronDown, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import AnimatedCard from '../components/AnimatedCard';
import HeroBackground from '../components/HeroBackground';
import Background from '../components/Background';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePageLoading } from '../hooks/usePageLoading';

const Contact = () => {
  const loading = usePageLoading();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'office@pgtglobalnetwork.com',
      description: "Send us an email and we'll respond within 24 hours",
      action: 'mailto:office@pgtglobalnetwork.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 8999902805',
      description: 'Speak directly with our team during business hours',
      action: 'tel:+918999902805'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon-Fri: 9AM-6PM IST',
      description: "We're available during these hours for immediate assistance",
      action: '#'
    }
  ];

  const enquiryCategories = [
    'General Inquiry',
    'Partnership / Collaboration',
    'Volunteer Opportunities',
    'Core Team Recruitment',
    'Event / Seminar Request',
    'Technical Support',
    'Media / Press',
    'Feedback / Suggestions',
    'Report an Issue',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validate category is selected
    if (!category) {
      toast.error('Please select an enquiry category.');
      setSubmitting(false);
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      setSubmitting(false);
      return;
    }

    try {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({
          full_name: fullName.trim(),
          email: email.trim(),
          category,
          subject: category === 'Other' ? customSubject.trim() : null,
          message: message.trim(),
        });

      if (dbError) throw dbError;

      setSuccess(true);
      toast.success('Message sent successfully!');

      // Reset form fields
      setFullName('');
      setEmail('');
      setCategory('');
      setCustomSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Contact submission failed:', err);
      const errMsg = err.message || 'Failed to send message. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

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
          @keyframes shimmer-btn {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-reveal-up {
            animation: reveal-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
          .animate-shimmer-btn {
            animation: shimmer-btn 1.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          }
        `}
      </style>

      {/* Hero Section */}
      <AnimatedCard animation="fadeIn">
        <section className="relative overflow-hidden pt-12 pb-24 sm:pt-16 sm:pb-32">
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
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase font-mono">PGT Global Support</span>
            </div>

            <h1 
              className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6 font-sans max-w-4xl mx-auto animate-reveal-up"
              style={{ animationDelay: '250ms' }}
            >
              Get In Touch
            </h1>
            <p 
              className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal animate-reveal-up"
              style={{ animationDelay: '400ms' }}
            >
              Have questions, ideas, or feedback? Drop us a message below.
            </p>
          </div>
        </section>
      </AnimatedCard>

      {/* Main Grid: Form and Contact Info */}
      <section className="py-24 bg-white border-b border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Contact Form (1st in markup for mobile-top display) */}
            <div className="lg:col-span-7 animate-reveal-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-slate-50/45 border border-slate-200/60 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-100/40">
                {success ? (
                  <div className="text-center py-12 px-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border border-green-100 mb-6 text-green-500 animate-bounce">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Thank You!</h3>
                    <p className="text-slate-600 mb-8 max-w-sm mx-auto leading-relaxed text-sm sm:text-base font-normal">
                      Your message has been successfully received. We've sent a confirmation email to you, and our team will get back to you shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-btn pointer-events-none" />
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Send Us a Message</h2>
                      <p className="text-sm text-slate-500 font-normal">Fill out the fields below and we'll respond directly.</p>
                      <p className="text-xs text-slate-455 mt-2">
                        Fields marked with <span className="text-red-500 font-bold">*</span> are required.
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-100 text-red-650 px-4 py-3 rounded-xl text-sm font-medium">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-755 mb-2">
                          Full Name <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-455 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm font-normal"
                          placeholder="Enter your full name"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-750 mb-2">
                          Email Address <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-455 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm font-normal"
                          placeholder="Enter your email address"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-slate-755 mb-2">
                        Enquiry Category <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <select
                          className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 appearance-none text-sm font-normal ${
                            category === '' ? 'text-slate-400' : 'text-slate-800'
                          }`}
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select Enquiry Category...</option>
                          {enquiryCategories.map((cat, idx) => (
                            <option key={idx} value={cat} className="text-slate-800">
                              {cat}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Conditional Custom Subject Field with height and opacity transition */}
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        category === 'Other' ? 'max-h-28 opacity-100 visible' : 'max-h-0 opacity-0 invisible pointer-events-none'
                      }`}
                    >
                      <div className="pt-2">
                        <label className="block text-sm font-semibold text-slate-755 mb-2">
                          Custom Subject <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm font-normal"
                          placeholder="Please specify your subject"
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          required={category === 'Other'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-755 mb-2">
                        Message <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <textarea
                        rows={5}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-450 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm font-normal resize-none"
                        placeholder="Tell us how we can help..."
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative overflow-hidden w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.01] transform transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-btn pointer-events-none" />
                      {submitting ? 'Sending Message...' : 'Send Message'}
                      <Send className={`h-4 w-4 transition-transform ${submitting ? 'translate-x-1' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'} duration-300`} />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Contact Methods & Info (2nd in markup for mobile-bottom display) */}
            <div className="lg:col-span-5 space-y-8 animate-reveal-up" style={{ animationDelay: '400ms' }}>
              <div>
                <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">Reach out</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">Contact Information</h2>
                <p className="text-slate-550 leading-relaxed font-normal text-sm sm:text-base">
                  Have questions, collaboration ideas, or feedback? Use the form to get in touch with our team, or reach out directly through any of our channels.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <AnimatedCard key={index} animation="slideUp" delay={index * 100}>
                    <a 
                      href={info.action !== '#' ? info.action : undefined}
                      className="relative overflow-hidden bg-slate-50/40 border border-slate-100 p-6 rounded-2xl hover:bg-white hover:shadow-2xl hover:shadow-slate-100 hover:border-indigo-500/20 hover:-translate-y-1.5 transform transition-all duration-300 group cursor-pointer flex items-center gap-6 text-left block"
                    >
                      {/* Subtle Theme Radial Glow Overlay */}
                      <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.03] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="flex-shrink-0 w-12 h-12 bg-slate-100 border border-slate-150 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 text-indigo-600 relative z-10">
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-0.5 group-hover:text-indigo-650 transition-colors duration-300 relative z-10">{info.title}</h4>
                        <p className="text-sm font-semibold text-indigo-600 mb-1 relative z-10">{info.details}</p>
                        <p className="text-slate-500 text-xs leading-normal font-normal relative z-10">{info.description}</p>
                      </div>
                    </a>
                  </AnimatedCard>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-slate-50/20 border-b border-slate-150/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedCard animation="slideUp">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">support</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              Looking for quick answers? Check out our comprehensive FAQ section.
            </p>
            <a
              href="/faq"
              className="group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer-btn pointer-events-none" />
              View FAQ
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </a>
          </AnimatedCard>
        </div>
      </section>

      {/* Connection Banner */}
      <AnimatedCard animation="fadeIn">
        <section className="relative py-28 bg-slate-950 text-white overflow-hidden z-10">
          <Background />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              We’d Love to Hear From You
            </h2>
            <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto text-slate-400 leading-relaxed font-normal">
              Whether you have questions, ideas, or feedback, your voice matters.  
              Reach out and connect with our team to take the next step toward meaningful impact.
            </p>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto font-mono">
              Together, we can create change and make a difference.
            </p>
          </div>
        </section>
      </AnimatedCard>
    </div>
  );
};

export default Contact;