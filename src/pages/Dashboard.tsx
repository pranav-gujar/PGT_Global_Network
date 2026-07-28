import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  User, 
  FileText, 
  Activity, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  MapPin, 
  Globe, 
  Calendar, 
  ArrowRight, 
  Clock, 
  Briefcase,
  Instagram,
  Linkedin,
  Youtube,
  Facebook
} from 'lucide-react'
import { Navigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ImageUploadModal from '../components/ImageUploadModal'
import HeroBackground from '../components/HeroBackground'
import AnimatedCard from '../components/AnimatedCard'
import { useLanguage } from '../contexts/LanguageContext'

const Dashboard = () => {
  const { user, userRole, updateProfile } = useAuth()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [profileImage, setProfileImage] = useState<string>('')
  const [editData, setEditData] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    facebook: ''
  })

  useEffect(() => {
    if (user !== undefined && user !== null) {
      fetchUserData()
    }
  }, [user?.id])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timeout)
  }, [])

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const [
        profileRes,
        applicationsRes,
        activitiesRes
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_activities').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
      ])

      const profileData = profileRes.data
      if (profileData) {
        setProfile(profileData)
        if (!editMode) {
          setEditData({
            full_name: profileData.full_name || '',
            bio: profileData.bio || '',
            location: profileData.location || '',
            website: profileData.website || '',
            avatar_url: profileData.avatar_url || '',
            instagram: profileData.instagram || '',
            linkedin: profileData.linkedin || '',
            youtube: profileData.youtube || '',
            facebook: profileData.facebook || ''
          })
        }
        setProfileImage(profileData.avatar_url || '')
      }

      setApplications(applicationsRes.data || [])
      setActivities(activitiesRes.data || [])

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editData)
      setProfile((prev: any) => ({ ...prev, ...editData }))
      setEditMode(false)
      toast.success(t('dashboard.saveSuccess') === 'dashboard.saveSuccess' ? 'Profile updated successfully!' : t('dashboard.saveSuccess'))
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error(t('dashboard.saveError') === 'dashboard.saveError' ? 'Failed to save profile.' : t('dashboard.saveError'))
    }
  }

  const handleImageUpload = async (file: File, _previewUrl?: string) => {
    try {
      if (!user) throw new Error("Not logged in")

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      // Save URL to profile
      await updateProfile({ avatar_url: publicUrl })

      // Update local state instantly
      setProfileImage(publicUrl)
      setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }))
      toast.success('Profile photo updated successfully!')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(`Failed to update profile photo: ${error.message || error}`)
    }
  }

  const getGreeting = () => {
    const hr = new Date().getHours()
    if (hr >= 5 && hr < 12) return 'Good morning'
    if (hr >= 12 && hr < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return ''
    if (/^https?:\/\//i.test(url)) return url
    return `https://${url}`
  }

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'team_member': return 'Team Member'
      case 'volunteer': return 'Volunteer'
      default: return 'Proud PGTian'
    }
  }

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'admin': return 'from-rose-500/20 to-red-500/20 text-rose-200 border-rose-500/30'
      case 'team_member': return 'from-indigo-500/20 to-blue-500/20 text-indigo-200 border-indigo-500/30'
      case 'volunteer': return 'from-emerald-500/20 to-teal-500/20 text-emerald-200 border-emerald-500/30'
      default: return 'from-indigo-500/20 to-blue-500/20 text-indigo-200 border-indigo-500/30'
    }
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || t('dashboard.noName') || 'PGTian'

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
        <HeroBackground />
        <div className="z-10 text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-semibold text-muted-foreground tracking-wide animate-pulse">Loading Member Workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden transition-colors duration-300">
      <HeroBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {/* Welcome Hero Banner */}
        <AnimatedCard animation="fadeIn" className="mb-8">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 dark:from-indigo-955/40 dark:via-slate-955 dark:to-indigo-900/40 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden border border-border">
            {/* Ambient Lighting Overlay */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                {/* Avatar Display */}
                <div className="relative group">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl group-hover:border-indigo-400/40 transition-all duration-300 transform group-hover:scale-105 bg-indigo-950 flex items-center justify-center">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-2xl md:text-3xl font-extrabold">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 scale-90 group-hover:scale-100 border border-white/10 cursor-pointer"
                    title="Change photo"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <span className="text-slate-400/80 text-sm font-semibold tracking-wide uppercase">
                      {getGreeting()},
                    </span>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold border bg-gradient-to-r ${getRoleBadgeColor(userRole)}`}>
                      {getRoleLabel(userRole)}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                    {t('dashboard.welcome', { name: displayName }) === 'dashboard.welcome' ? `Welcome back, ${displayName}!` : t('dashboard.welcome', { name: displayName })}
                  </h1>
                  <p className="text-slate-400/80 text-sm max-w-xl leading-relaxed">
                    {t('dashboard.status') === 'dashboard.status' ? 'Account Status: Active' : t('dashboard.status')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link 
                  to="/careers" 
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-5 rounded-xl text-sm border border-white/10 transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-lg text-center"
                >
                  {t('careers.apply') === 'careers.apply' ? 'Apply Now' : t('careers.apply')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Dashboard Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card Column */}
          <div className="lg:col-span-1">
            <AnimatedCard animation="slideUp" delay={100}>
              <div className="bg-card border border-border p-8 rounded-2xl shadow-xl shadow-slate-950/10 dark:shadow-none space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2.5">
                    <User className="h-5 w-5 text-indigo-650" />
                    Member Details
                  </h2>
                  {!editMode ? (
                    <button
                      onClick={() => {
                        setEditData({
                          full_name: profile?.full_name || user?.user_metadata?.full_name || '',
                          bio: profile?.bio || '',
                          location: profile?.location || '',
                          website: profile?.website || '',
                          avatar_url: profile?.avatar_url || '',
                          instagram: profile?.instagram || '',
                          linkedin: profile?.linkedin || '',
                          youtube: profile?.youtube || '',
                          facebook: profile?.facebook || ''
                        })
                        setEditMode(true)
                      }}
                      className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/10 rounded-xl transition-all duration-300 cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditMode(false)
                        setEditData({
                          full_name: profile?.full_name || user?.user_metadata?.full_name || '',
                          bio: profile?.bio || '',
                          location: profile?.location || '',
                          website: profile?.website || '',
                          avatar_url: profile?.avatar_url || '',
                          instagram: profile?.instagram || '',
                          linkedin: profile?.linkedin || '',
                          youtube: profile?.youtube || '',
                          facebook: profile?.facebook || ''
                        })
                      }}
                      className="p-2 text-muted-foreground hover:bg-muted/80 rounded-xl transition-all duration-300 cursor-pointer"
                      title="Cancel Edit"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {editMode && (
                    <p className="text-xs text-muted-foreground/60">
                      Fields marked with <span className="text-red-500 font-bold">*</span> are required.
                    </p>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                      {t('apply.form.fullName') === 'apply.form.fullName' ? 'Full Name' : t('apply.form.fullName')} {editMode && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editData.full_name}
                        onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-input border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-foreground text-sm font-semibold">{displayName}</p>
                    )}
                  </div>

                  {/* Registered Email - Locked and Non-Editable */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5 text-muted-foreground/50">
                      {t('dashboard.emailLabel') === 'dashboard.emailLabel' ? 'Email Address' : t('dashboard.emailLabel')} <span className="text-[10px] bg-muted text-muted-foreground/60 px-1.5 py-0.5 rounded font-bold uppercase tracking-normal">Locked</span>
                    </label>
                    <p className="text-foreground text-sm font-semibold select-all cursor-not-allowed opacity-75">{user.email}</p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                      {t('dashboard.bioLabel') === 'dashboard.bioLabel' ? 'Short Bio' : t('dashboard.bioLabel')}
                    </label>
                    {editMode ? (
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        className="w-full px-4 py-2.5 bg-input border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all duration-300"
                        rows={3}
                        placeholder={t('dashboard.bioPlaceholder') === 'dashboard.bioPlaceholder' ? 'Tell the community about yourself...' : t('dashboard.bioPlaceholder')}
                      />
                    ) : (
                      profile?.bio ? (
                        <p className="text-muted-foreground text-sm leading-relaxed font-normal">{profile.bio}</p>
                      ) : (
                        <p className="text-muted-foreground/50 italic text-sm font-normal">Not provided yet</p>
                      )
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" /> Location
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="w-full px-4 py-2.5 bg-input border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all duration-300"
                        placeholder="Enter your current city and country"
                      />
                    ) : (
                      profile?.location ? (
                        <p className="text-foreground text-sm font-semibold">{profile.location}</p>
                      ) : (
                        <p className="text-muted-foreground/50 italic text-sm font-normal">Not provided yet</p>
                      )
                    )}
                  </div>

                  {/* Social & Web Links */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-2">
                      Social & Web Links
                    </label>
                    {editMode ? (
                      <div className="space-y-4 pt-2 border-t border-border">
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground/60 mb-1 flex items-center gap-1">
                            <Globe className="h-3 w-3" /> Website
                          </label>
                          <input
                            type="url"
                            value={editData.website}
                            onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                            className="w-full px-4 py-2 bg-input border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all duration-300"
                            placeholder="Enter your website URL (optional)"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground/60 mb-1 flex items-center gap-1">
                            <Instagram className="h-3 w-3" /> Instagram
                          </label>
                          <input
                            type="url"
                            value={editData.instagram}
                            onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                            className="w-full px-4 py-2 bg-input border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all duration-300"
                            placeholder="Enter your Instagram profile URL (optional)"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground/60 mb-1 flex items-center gap-1">
                            <Linkedin className="h-3 w-3" /> LinkedIn
                          </label>
                          <input
                            type="url"
                            value={editData.linkedin}
                            onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })}
                            className="w-full px-4 py-2 bg-input border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all duration-300"
                            placeholder="Enter your LinkedIn profile URL (optional)"
                          />
                        </div>
                      </div>
                    ) : (
                      (!profile?.website && !profile?.instagram && !profile?.linkedin && !profile?.youtube && !profile?.facebook) ? (
                        <p className="text-muted-foreground/50 italic text-sm font-normal">Not provided yet</p>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3">
                          {profile?.website && (
                            <a 
                              href={ensureAbsoluteUrl(profile.website)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="p-2.5 bg-muted border border-border rounded-xl text-muted-foreground hover:bg-muted/70 hover:text-indigo-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm font-semibold text-xs"
                              title="Website"
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                          {profile?.instagram && (
                            <a 
                              href={ensureAbsoluteUrl(profile.instagram)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="p-2.5 bg-muted border border-border rounded-xl text-muted-foreground hover:bg-muted/70 hover:text-rose-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm font-semibold text-xs"
                              title="Instagram"
                            >
                              <Instagram className="h-4 w-4" />
                            </a>
                          )}
                          {profile?.linkedin && (
                            <a 
                              href={ensureAbsoluteUrl(profile.linkedin)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="p-2.5 bg-muted border border-border rounded-xl text-muted-foreground hover:bg-muted/70 hover:text-blue-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm font-semibold text-xs"
                              title="LinkedIn"
                            >
                              <Linkedin className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  {editMode && (
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border animate-fadeIn">
                      <button
                        onClick={() => {
                          setEditMode(false)
                          setEditData({
                            full_name: profile?.full_name || user?.user_metadata?.full_name || '',
                            bio: profile?.bio || '',
                            location: profile?.location || '',
                            website: profile?.website || '',
                            avatar_url: profile?.avatar_url || '',
                            instagram: profile?.instagram || '',
                            linkedin: profile?.linkedin || '',
                            youtube: profile?.youtube || '',
                            facebook: profile?.facebook || ''
                          })
                        }}
                        className="px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold rounded-xl text-sm transition-all duration-300 active:scale-95 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Main Workspace Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Applications List Card */}
            <AnimatedCard animation="slideUp" delay={200}>
              <div className="bg-card border border-border p-8 rounded-2xl shadow-xl shadow-slate-950/10 dark:shadow-none">
                <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                  <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2.5">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    My Applications
                  </h2>
                  <span className="bg-indigo-50/10 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200/20 text-xs px-2.5 py-1 rounded-full font-bold">
                    {applications.length} Total
                  </span>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-14 h-14 bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/20 rounded-full flex items-center justify-center mx-auto text-indigo-500">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-foreground">No active applications</h3>
                      <p className="text-sm text-muted-foreground">You haven't submitted any program or role applications yet.</p>
                    </div>
                    <Link
                      to="/careers"
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl text-xs shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer text-center"
                    >
                      Browse Open Roles
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div 
                        key={application.id} 
                        className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                            <h3 className="font-bold text-foreground text-base">{application.position_title}</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
                            <span className="flex items-center gap-1 font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50/10 dark:bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-200/20 font-mono">
                              ID: {application.application_id}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                              Submitted: {new Date(application.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                            application.status === 'Submitted' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                            application.status === 'Reviewed' ? 'bg-indigo-50/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/20' :
                            application.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                            'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              application.status === 'Submitted' ? 'bg-amber-500' :
                              application.status === 'Reviewed' ? 'bg-indigo-500' :
                              application.status === 'Accepted' ? 'bg-emerald-500' :
                              'bg-rose-500'
                            }`}></span>
                            {application.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedCard>
 
            {/* Recent Activities Timeline Card */}
            <AnimatedCard animation="slideUp" delay={300}>
              <div className="bg-card border border-border p-8 rounded-2xl shadow-xl shadow-slate-950/10 dark:shadow-none">
                <div className="pb-4 border-b border-border mb-6">
                  <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2.5">
                    <Activity className="h-5 w-5 text-indigo-650" />
                    {t('dashboard.logsTitle') === 'dashboard.logsTitle' ? 'Recent Activity logs' : t('dashboard.logsTitle')}
                  </h2>
                </div>

                {activities.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <div className="w-14 h-14 bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-200/20 rounded-full flex items-center justify-center mx-auto text-indigo-500">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-foreground">{t('dashboard.logsEmpty')}</h3>
                    </div>
                  </div>
                ) : (
                  <div className="relative pl-6 border-l-2 border-border space-y-6">
                    {activities.map((activity) => (
                      <div key={activity.id} className="relative group">
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-indigo-600 bg-background group-hover:bg-indigo-600 transition-all duration-300 shadow-sm animate-pulse"></div>
                        
                        <div className="space-y-1">
                          <p className="text-foreground font-semibold text-sm leading-tight group-hover:text-indigo-600 transition-colors duration-200 text-left">
                            {activity.activity_type}
                          </p>
                          <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(activity.created_at).toLocaleString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>

      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onImageSelect={handleImageUpload}
        currentImage={profileImage}
      />
    </div>
  )
}

export default Dashboard