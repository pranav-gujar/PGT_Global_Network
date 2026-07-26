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
import HeroBackground from "../components/HeroBackground";
import AnimatedCard from "../components/AnimatedCard";

const Apply: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const positionTitle = searchParams.get("position");

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
    if (!user) {
      toast.error("You must be logged in to apply.");
      return;
    }
    if (!resumeFile) {
      toast.error("Please upload your PDF resume.");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept the terms and declaration.");
      return;
    }

    setSubmitting(true);
    setUploadProgress(10);

    try {
      // 1. Upload Resume
      const fileExt = resumeFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      setUploadProgress(30);
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile, { upsert: true });

      if (uploadError) throw uploadError;
      setUploadProgress(60);

      // 2. Get Public URL
      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(filePath);
      const resumeUrl = urlData.publicUrl;
      setUploadProgress(80);

      // 3. Save application details to DB
      const { data: appData, error: dbError } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          position_title: positionTitle || "",
          applicant_details: {
            full_name: fullName,
            email: user.email,
            phone,
            organization_institution: organizationInstitution,
            current_role: currentRole,
            highest_qualification: highestQualification,
            // Legacy fallbacks for backward compatibility
            college: organizationInstitution,
            year_qualification: highestQualification,
            city_state: cityState,
            why_join: whyJoin,
            skills,
            previous_experience: previousExperience,
            portfolio_links: portfolioLinks,
            availability,
            terms_accepted: termsAccepted,
          },
          resume_url: resumeUrl,
          status: "Submitted",
        })
        .select()
        .single();

      if (dbError) throw dbError;
      setUploadProgress(100);

      if (appData) {
        setSuccessData(appData);
        toast.success("Application submitted successfully!");
      }
    } catch (err: any) {
      console.error("Application submission failed:", err);
      toast.error(err.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden">
        <HeroBackground />

        <div className="max-w-md w-full z-10">
          <AnimatedCard animation="fadeIn">
            <div className="bg-white/95 border border-slate-200/60 backdrop-blur-md rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.04] to-transparent rounded-3xl pointer-events-none" />

              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 hover:scale-105 transition-all duration-300">
                <CheckCircle2 className="h-8 w-8 animate-reveal-up" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Application Submitted!</h2>
              <p className="text-sm text-slate-500 mb-6">
                Thank you for applying to join the PGT Core Team. Your application has been logged successfully.
              </p>

              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 mb-8 text-left space-y-3.5 relative z-10 font-normal">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Application ID</span>
                  <span className="font-bold text-indigo-600 font-mono bg-indigo-50/50 px-2.5 py-0.5 rounded border border-indigo-100/40 select-all">
                    {successData.application_id}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Position</span>
                  <span className="font-semibold text-slate-700">{successData.position_title}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Status</span>
                  <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200 text-[10px]">
                    {successData.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Submitted On</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(successData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Go to Applications Dashboard
                </Link>
                <Link
                  to="/careers"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-550 hover:text-slate-700 hover:bg-slate-100 py-3.5 px-4 rounded-xl font-semibold text-sm inline-flex items-center justify-center transition-all duration-300 cursor-pointer"
                >
                  Return to Careers Page
                </Link>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-32 px-4 sm:px-6 lg:px-8 bg-slate-50/50 overflow-hidden">
      <HeroBackground />

      <div className="max-w-2xl mx-auto z-10 relative">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold text-xs tracking-wide uppercase transition-colors duration-300 mb-6 bg-white/80 border border-slate-200/50 rounded-xl px-4 py-2 hover:shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Positions
        </button>

        <AnimatedCard animation="slideUp">
          <div className="bg-white/95 border border-slate-200/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-3xl pointer-events-none" />

            {/* Header */}
            <div className="border-b border-slate-100 pb-6 mb-8">
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Application Form
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-1.5">
                Core Team Application
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-400" />
                Applying for: <strong className="text-slate-800">{positionTitle}</strong>
              </p>
            </div>

            {fetchingProfile ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-xs text-slate-455">
                  Fields marked with <span className="text-red-500 font-bold">*</span> are required.
                </p>

                {/* Visual Group: Personal Details */}
                <div className="space-y-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-450" /> Personal Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
                        Full Name <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 focus:outline-none text-sm transition-all duration-300 cursor-not-allowed select-none shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
                        Phone Number <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                          placeholder="Enter your mobile number"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
                        City / State <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={cityState}
                          onChange={(e) => setCityState(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                          placeholder="Enter your current city and state"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Group: Background Information */}
                <div className="space-y-5 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-455" /> Background Information
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
                        Organization / Institution <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={organizationInstitution}
                          onChange={(e) => setOrganizationInstitution(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-855 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                          placeholder='Enter your current organisation, institution, or "Independent"'
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
                        Current Role / Occupation <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={currentRole}
                          onChange={(e) => setCurrentRole(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-855 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                          placeholder="e.g. Student, Software Engineer, Founder, Teacher, Freelancer"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
                        Highest Qualification <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={highestQualification}
                          onChange={(e) => setHighestQualification(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-855 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                          placeholder="e.g. HSC, Diploma, B.Tech, MBA, PhD"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Group: Questionnaire */}
                <div className="space-y-5 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-slate-450" /> Motivation & Experience
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
                      Why do you want to join PGT Global Network? <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <textarea
                      value={whyJoin}
                      onChange={(e) => setWhyJoin(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm font-normal"
                      rows={4}
                      placeholder="Explain why you want to join and how you can contribute..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
                      Relevant Skills <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                      placeholder="Enter your key skills (separated by commas)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      Previous Experience <span className="text-[10px] font-bold text-slate-400 lowercase italic tracking-wide">(Optional)</span>
                    </label>
                    <textarea
                      value={previousExperience}
                      onChange={(e) => setPreviousExperience(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm font-normal"
                      rows={3}
                      placeholder="Describe any prior leadership, work, or volunteer experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      Portfolio / LinkedIn / GitHub links <span className="text-[10px] font-bold text-slate-400 lowercase italic tracking-wide">(Optional)</span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="url"
                        value={portfolioLinks}
                        onChange={(e) => setPortfolioLinks(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                        placeholder="Enter your URL (optional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Visual Group: Logistics & Resume */}
                <div className="space-y-5 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-450" /> Availability & Resume
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" /> Availability (Hours per week / Start Date) <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                      placeholder="Enter your availability (e.g. hours per week, start date)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      Upload Resume (PDF format, under 5MB) <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl hover:border-indigo-400 transition-colors duration-300 relative bg-slate-50/50 cursor-pointer block">
                      <div className="space-y-1.5 text-center">
                        <Upload className="mx-auto h-10 w-10 text-slate-400" />
                        <div className="flex text-sm text-slate-650 justify-center">
                          <span className="relative rounded-md font-bold text-indigo-650 hover:text-indigo-550 focus-within:outline-none">
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
                        <p className="text-xs text-slate-400 font-normal">PDF files up to 5MB</p>
                        {resumeFile && (
                          <div className="pt-2">
                            <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-150 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold">
                              Selected: {resumeFile.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Terms and declaration */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <label className="relative flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                      required
                    />
                    <span className="text-xs text-slate-550 leading-relaxed font-normal">
                      I declare that the information provided in this application is true and complete to the best of my knowledge. I understand that any false statements may disqualify my application.
                    </span>
                  </label>
                </div>

                {/* Submitting progress bar */}
                {submitting && (
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
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
                      Submitting Application... ({uploadProgress}%)
                    </>
                  ) : (
                    <>
                      Submit Application
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
