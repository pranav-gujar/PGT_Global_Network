import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Upload,
  CheckCircle2,
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  MapPin,
  Sparkles,
  Link as LinkIcon,
  Briefcase,
  FileText,
  Clock,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { usePageLoading } from "../hooks/usePageLoading";
import { useLanguage } from "../contexts/LanguageContext";
import SEO from "../components/SEO";
import HeroBackground from "../components/HeroBackground";
import AnimatedCard from "../components/AnimatedCard";

const Apply: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const positionTitle = searchParams.get("position");
  const { t } = useLanguage();

  const [profile, setProfile] = useState<any>(null);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successData, setSuccessData] = useState<any>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationInstitution, setOrganizationInstitution] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [highestQualification, setHighestQualification] = useState("");
  const [cityState, setCityState] = useState("");
  const [whyJoin, setWhyJoin] = useState("");
  const [skills, setSkills] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState("");
  const [availability, setAvailability] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const getTranslation = (key: string, fallback: any) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  // Redirect if no position specified
  useEffect(() => {
    if (!positionTitle) {
      toast.error("No position selected. Redirecting to careers page.");
      navigate("/careers", { replace: true });
    }
  }, [positionTitle, navigate]);

  // Fetch profile details for auto-fill
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setFetchingProfile(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data) {
          setProfile(data);
          setFullName(data.full_name || user.user_metadata?.full_name || "");
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setFetchingProfile(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Only PDF format resumes are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Resume file size should be less than 5MB.");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !positionTitle || !resumeFile) return;

    setSubmitting(true);
    setUploadProgress(10);

    try {
      // 1. Upload Resume PDF file to Supabase Storage
      const fileExt = resumeFile.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}_resume.${fileExt}`;
      setUploadProgress(30);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile, {
          cacheControl: "3600",
          upsert: true
        });

      if (uploadError) throw uploadError;
      setUploadProgress(60);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);
      
      const resumeUrl = urlData.publicUrl;
      setUploadProgress(80);

      // 2. Insert Application details into Database (handles both modern applicant_details and legacy schema)
      const payloadDetails = {
        full_name: fullName,
        phone_number: phone,
        organization_institution: organizationInstitution,
        current_role: currentRole,
        highest_qualification: highestQualification,
        city_state: cityState,
        why_join: whyJoin,
        skills: skills,
        previous_experience: previousExperience,
        portfolio_links: portfolioLinks,
        availability: availability,
        resume_url: resumeUrl,
        applied_at: new Date().toISOString()
      };

      let { error: insertError } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          position_title: positionTitle,
          resume_url: resumeUrl,
          status: "Submitted",
          applicant_details: payloadDetails
        });

      // If database has legacy application_data column instead of applicant_details
      if (insertError && insertError.message?.includes("applicant_details")) {
        console.warn("[Apply] Retrying with legacy application_data schema...", insertError.message);
        const retry = await supabase
          .from("applications")
          .insert({
            user_id: user.id,
            position_title: positionTitle,
            resume_url: resumeUrl,
            status: "Submitted",
            application_data: payloadDetails
          });
        insertError = retry.error;
      }

      if (insertError) throw insertError;
      setUploadProgress(100);

      // 3. Log user activity
      await supabase.from("user_activities").insert({
        user_id: user.id,
        activity_type: "Job Application",
        activity_data: {
          position_title: positionTitle,
          applied_at: new Date().toISOString()
        }
      });

      toast.success("Application submitted successfully!");
      setSuccessData({
        position: positionTitle,
        appliedAt: new Date().toLocaleDateString()
      });
    } catch (error: any) {
      toast.error(error.message || "Error submitting application");
      console.error("Application submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-background overflow-x-hidden min-h-screen transition-colors duration-300">
      <SEO title="Job Application" noindex={true} />
      <HeroBackground />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back navigation */}
        <AnimatedCard animation="slideUp" delay={50}>
          <div className="mb-8 text-left">
            <Link
              to="/careers"
              className="group inline-flex items-center text-muted-foreground hover:text-indigo-650 text-sm font-semibold tracking-wide transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              {t('apply.form.backToCareers')}
            </Link>
          </div>
        </AnimatedCard>

        {/* Form Container */}
        <AnimatedCard animation="slideUp" delay={150}>
          <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-2xl shadow-slate-950/10 dark:shadow-none">
            {successData ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                  {t('apply.form.successTitle')}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto font-normal">
                  {t('apply.form.successDesc')}
                </p>
                <div className="bg-muted p-5 rounded-2xl border border-border max-w-sm mx-auto text-left space-y-2.5">
                  <p className="text-xs text-muted-foreground"><strong>Position:</strong> {successData.position}</p>
                  <p className="text-xs text-muted-foreground"><strong>Applied On:</strong> {successData.appliedAt}</p>
                </div>
                <div className="pt-6">
                  <Link
                    to="/careers"
                    className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors duration-300"
                  >
                    {t('apply.form.backToCareers')}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 text-left">
                <div>
                  <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                    {t('apply.title')}
                  </h1>
                  <p className="text-muted-foreground text-sm mt-2 font-normal">
                    {t('apply.subtitle')}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/20 text-indigo-700 dark:text-indigo-400 text-xs px-3.5 py-1.5 rounded-xl font-bold select-none">
                    <ShieldCheck className="h-4 w-4" />
                    <strong>Position:</strong> {positionTitle}
                  </div>
                </div>

                {/* Visual Group: Personal Details */}
                <div className="space-y-5 pt-6 border-t border-border">
                  <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground/50" /> Personal Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5">
                        {t('apply.form.fullName')} <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                        placeholder={t('apply.form.fullNamePlaceholder')}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5">
                        {t('apply.form.email')}
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground/55 focus:outline-none text-sm transition-all duration-300 cursor-not-allowed select-none shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5">
                        {getTranslation('apply.form.phone', 'Phone Number')} <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                          placeholder="Enter your mobile number"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5">
                        {getTranslation('apply.form.cityState', 'City / State')} <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <input
                          type="text"
                          value={cityState}
                          onChange={(e) => setCityState(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                          placeholder="Enter your current city and state"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Group: Background Information */}
                <div className="space-y-5 pt-4 border-t border-border">
                  <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground/50" /> Background Information
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5">
                        {getTranslation('apply.form.org', 'Organization / Institution')} <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <input
                          type="text"
                          value={organizationInstitution}
                          onChange={(e) => setOrganizationInstitution(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                          placeholder='Enter your current organisation, institution, or "Independent"'
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5">
                        {t('careers.role') === 'careers.role' ? 'Current Role / Occupation' : t('careers.role')} <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <input
                          type="text"
                          value={currentRole}
                          onChange={(e) => setCurrentRole(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                          placeholder="e.g. Student, Software Engineer, Founder, Teacher, Freelancer"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5">
                        {getTranslation('apply.form.qualification', 'Highest Qualification')} <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <input
                          type="text"
                          value={highestQualification}
                          onChange={(e) => setHighestQualification(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                          placeholder="e.g. HSC, Diploma, B.Tech, MBA, PhD"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Group: Questionnaire */}
                <div className="space-y-5 pt-4 border-t border-border">
                  <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground/50" /> Motivation & Experience
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5">
                      {t('apply.form.coverLetter')} <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <textarea
                      value={whyJoin}
                      onChange={(e) => setWhyJoin(e.target.value)}
                      className="w-full px-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm font-normal"
                      rows={4}
                      placeholder={t('apply.form.coverLetterPlaceholder')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5">
                      {getTranslation('apply.form.skills', 'Relevant Skills')} <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full px-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                      placeholder="Enter your key skills (separated by commas)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      {getTranslation('apply.form.prevExp', 'Previous Experience')} <span className="text-[10px] font-bold text-muted-foreground/50 lowercase italic tracking-wide">(Optional)</span>
                    </label>
                    <textarea
                      value={previousExperience}
                      onChange={(e) => setPreviousExperience(e.target.value)}
                      className="w-full px-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm font-normal"
                      rows={3}
                      placeholder="Describe any prior leadership, work, or volunteer experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      {getTranslation('apply.form.portfolio', 'Portfolio / LinkedIn / GitHub links')} <span className="text-[10px] font-bold text-muted-foreground/50 lowercase italic tracking-wide">(Optional)</span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      <input
                        type="url"
                        value={portfolioLinks}
                        onChange={(e) => setPortfolioLinks(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                        placeholder="Enter your URL (optional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Visual Group: Logistics & Resume */}
                <div className="space-y-5 pt-4 border-t border-border">
                  <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground/50" /> Availability & Resume
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/60" /> {getTranslation('apply.form.availability', 'Availability (Hours per week / Start Date)')} <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-4 py-3 bg-input border border-input rounded-xl text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                      placeholder="Enter your availability (e.g. hours per week, start date)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      {getTranslation('apply.form.resume', 'Upload Resume (PDF format, under 5MB)')} <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-2xl hover:border-indigo-400 transition-colors duration-300 relative bg-muted/40 cursor-pointer block">
                      <div className="space-y-1.5 text-center">
                        <Upload className="mx-auto h-10 w-10 text-muted-foreground/60" />
                        <div className="flex text-sm text-muted-foreground justify-center">
                          <span className="relative rounded-md font-bold text-indigo-700 dark:text-indigo-400 hover:text-indigo-550 focus-within:outline-none">
                            Upload a PDF file
                          </span>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="sr-only"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground/50 font-normal">PDF files up to 5MB</p>
                        {resumeFile && (
                          <div className="pt-2">
                            <span className="inline-flex items-center gap-1 bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/20 text-indigo-700 dark:text-indigo-400 text-xs px-3 py-1 rounded-full font-bold">
                              Selected: {resumeFile.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Terms and declaration */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <label className="relative flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 h-4.5 w-4.5 text-indigo-650 dark:text-indigo-400 focus:ring-indigo-500 border-border rounded cursor-pointer"
                      required
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed font-normal">
                      {getTranslation('apply.form.terms', 'I declare that the information provided in this application is true and complete to the best of my knowledge. I understand that any false statements may disqualify my application.')}
                    </span>
                  </label>
                </div>

                {/* Submitting progress bar */}
                {submitting && (
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('common.submitting')} ({uploadProgress}%)
                    </>
                  ) : (
                    <>
                      {t('apply.form.submit')}
                      <Sparkles className="h-4 w-4" />
                    </>
                  )}
                </button>

              </form>
            )}
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default Apply;
