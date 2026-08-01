import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, Check, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import HeroBackground from '../../components/HeroBackground'
import AnimatedCard from '../../components/AnimatedCard'
import { useLanguage } from '../../contexts/LanguageContext'
import SEO from '../../components/SEO'

const SignUp: React.FC = () => {
  const { signUp, signInWithGoogle, user } = useAuth()
  const { resolvedTheme } = useTheme()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.email_confirmed_at) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  // Live password validation checks
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  // Calculate password strength
  let strengthScore = 0
  if (password.length > 0) {
    if (hasMinLength) strengthScore += 1
    if (hasUppercase) strengthScore += 1
    if (hasLowercase) strengthScore += 1
    if (hasNumber) strengthScore += 1
    if (hasSpecial) strengthScore += 1
    if (password.length >= 12 && strengthScore === 5) {
      strengthScore = 6
    }
  }

  const getStrengthLabelAndColor = () => {
    if (password.length === 0) return { label: '', color: 'bg-transparent', text: '' }
    if (strengthScore <= 2) return { label: t('auth.signUp.strengthWeek') === 'auth.signUp.strengthWeek' ? 'Weak' : t('auth.signUp.strengthWeek'), color: 'bg-red-500 w-1/5', text: 'text-red-500' }
    if (strengthScore === 3) return { label: t('auth.signUp.strengthFair') === 'auth.signUp.strengthFair' ? 'Fair' : t('auth.signUp.strengthFair'), color: 'bg-orange-500 w-2/5', text: 'text-orange-500' }
    if (strengthScore === 4) return { label: 'Good', color: 'bg-yellow-500 w-3/5', text: 'text-yellow-600' }
    if (strengthScore === 5) return { label: t('auth.signUp.strengthStrong') === 'auth.signUp.strengthStrong' ? 'Strong' : t('auth.signUp.strengthStrong'), color: 'bg-indigo-500 w-4/5', text: 'text-indigo-655 dark:text-indigo-400' }
    return { label: 'Excellent', color: 'bg-green-500 w-full', text: 'text-green-600 dark:text-green-400' }
  }

  const strength = getStrengthLabelAndColor()
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  // Load Cloudflare Turnstile
  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA' // CF always-pass test key
    let interval: any

    const initializeTurnstile = () => {
      if (window.turnstile && turnstileContainerRef.current) {
        try {
          try {
            window.turnstile.remove(turnstileContainerRef.current)
          } catch (e) {}
          
          window.turnstile.render(turnstileContainerRef.current, {
            sitekey: siteKey,
            theme: resolvedTheme === 'dark' ? 'dark' : 'light',
            callback: (token: string) => {
              setTurnstileToken(token)
            },
          })
          if (interval) clearInterval(interval)
        } catch (e) {
          console.error('Turnstile render error:', e)
        }
      }
    }

    if (!document.getElementById('cloudflare-turnstile-script')) {
      const script = document.createElement('script')
      script.id = 'cloudflare-turnstile-script'
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true;
      script.defer = true;
      script.onload = initializeTurnstile
      document.body.appendChild(script)
    } else if (window.turnstile) {
      initializeTurnstile()
    } else {
      interval = setInterval(() => {
        if (window.turnstile) {
          initializeTurnstile()
        }
      }, 300)
    }

    return () => {
      if (interval) clearInterval(interval)
      if (window.turnstile && turnstileContainerRef.current) {
        try {
          window.turnstile.remove(turnstileContainerRef.current)
        } catch (e) {}
      }
    }
  }, [resolvedTheme])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate fields
    if (!fullName.trim()) {
      setError(t('auth.signUp.requiredName') === 'auth.signUp.requiredName' ? 'Full name is required' : t('auth.signUp.requiredName'))
      return
    }

    if (strengthScore < 4) {
      setError('Please choose a stronger password.')
      return
    }

    if (password !== confirmPassword) {
      setError(t('auth.signUp.noMatch') === 'auth.signUp.noMatch' ? 'Passwords do not match' : t('auth.signUp.noMatch'))
      return
    }

    if (!turnstileToken) {
      setError('Please complete the security check.')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await signUp(email, password, fullName, turnstileToken)
      
      const isDuplicate = (error && (
        error.message.toLowerCase().includes('already') ||
        error.message.toLowerCase().includes('exist') ||
        error.status === 422
      )) || (
        data?.user && (!data.user.identities || data.user.identities.length === 0)
      )

      if (isDuplicate) {
        setError('An account with this email address already exists.')
        if (window.turnstile && turnstileContainerRef.current) {
          window.turnstile.reset(turnstileContainerRef.current)
          setTurnstileToken(null)
        }
      } else if (error) {
        setError(error.message)
        if (window.turnstile && turnstileContainerRef.current) {
          window.turnstile.reset(turnstileContainerRef.current)
          setTurnstileToken(null)
        }
      } else if (!data || !data.user) {
        setError('Failed to create account. Please try again.')
        if (window.turnstile && turnstileContainerRef.current) {
          window.turnstile.reset(turnstileContainerRef.current)
          setTurnstileToken(null)
        }
      } else {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`, { replace: true })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.')
      if (window.turnstile && turnstileContainerRef.current) {
        window.turnstile.reset(turnstileContainerRef.current)
        setTurnstileToken(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Google sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden transition-colors duration-300">
      <SEO title="Create Account" noindex={true} />
      <HeroBackground />

      {/* Back to Website Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 sm:top-8 sm:left-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-indigo-500 transition-colors duration-300 z-20 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 duration-300" />
        {t('common.backToHome') === 'common.backToHome' ? 'Back to Website' : t('common.backToHome')}
      </Link>

      <div className="max-w-md w-full z-10">
        <AnimatedCard animation="fadeIn">
          {/* Logo Heading */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2.5 mb-6">
              <img 
                src="/PGT New Logo Transparent.png" 
                alt="PGT Logo" 
                className="w-11 h-11 object-contain filter drop-shadow-sm"
              />
              <span className="font-extrabold text-2xl tracking-tight text-foreground">
                PGT Global Network
              </span>
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              {t('auth.signUp.title')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('auth.signUp.subtitle')}
            </p>
          </div>

          <div className="bg-card/90 border border-border backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-slate-100/10 dark:shadow-none text-left">
            {error && (
              <div className="mb-5 bg-red-50/10 dark:bg-red-950/20 border border-red-200/25 text-red-755 dark:text-red-400 text-xs py-3 px-4 rounded-xl flex items-start gap-2.5 shadow-sm">
                <span className="font-bold flex-shrink-0">Error:</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                  {t('auth.signUp.fullName')} <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                    placeholder={t('auth.signUp.fullNamePlaceholder')}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                  {t('auth.signUp.email')} <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                    placeholder={t('auth.signUp.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                  {t('auth.signUp.password')} <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                    placeholder={t('auth.signUp.passwordPlaceholder')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-455 hover:text-slate-605 dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2.5">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-muted-foreground font-semibold">{t('auth.signUp.strength')}</span>
                      <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden border border-border/80">
                      <div className={`h-full transition-all duration-500 ${strength.color}`} />
                    </div>
                  </div>
                )}

                {/* Live Checklist */}
                <div className="mt-4 bg-muted/60 border border-border rounded-xl p-3.5 space-y-2">
                  <span className="block text-[10px] font-bold text-muted-foreground/75 uppercase tracking-widest mb-1">
                    {t('auth.signUp.requirements')}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      {hasMinLength ? (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mx-1 flex-shrink-0" />
                      )}
                      <span className={hasMinLength ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground/80'}>{t('auth.signUp.reqLength')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasUppercase ? (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mx-1 flex-shrink-0" />
                      )}
                      <span className={hasUppercase ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground/80'}>{t('auth.signUp.reqUpper')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasLowercase ? (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mx-1 flex-shrink-0" />
                      )}
                      <span className={hasLowercase ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground/80'}>{t('auth.signUp.reqLower')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasNumber ? (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mx-1 flex-shrink-0" />
                      )}
                      <span className={hasNumber ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground/80'}>{t('auth.signUp.reqNum')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasSpecial ? (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mx-1 flex-shrink-0" />
                      )}
                      <span className={hasSpecial ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground/80'}>{t('auth.signUp.reqSpecial')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                  {t('auth.signUp.confirmPassword')} <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-11 pr-11 py-3 bg-background border rounded-xl text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 ${
                      confirmPassword.length > 0
                        ? passwordsMatch
                          ? 'border-green-500 focus:ring-green-550/50'
                          : 'border-red-400 focus:ring-red-450/50'
                        : 'border-border'
                    }`}
                    placeholder={t('auth.signUp.confirmPasswordPlaceholder')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-455 hover:text-slate-655 dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <span className={`block text-xs mt-1.5 font-bold ${
                    passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                  }`}>
                    {passwordsMatch ? `✓ ${t('auth.signUp.match')}` : `✗ ${t('auth.signUp.noMatch')}`}
                  </span>
                )}
              </div>

              {/* Cloudflare Turnstile */}
              <div className="flex justify-center py-1">
                <div ref={turnstileContainerRef} id="turnstile-container"></div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('auth.signUp.creating')}
                  </>
                ) : (
                  <>
                    {t('auth.signUp.btn')}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-semibold tracking-wider transition-colors duration-300">
                  {t('auth.signUp.divider')}
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-card hover:bg-muted border border-border text-foreground font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google Logo" 
                className="h-5 w-5" 
              />
              {t('auth.signUp.google')}
            </button>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              {t('auth.signUp.hasAccount')}{' '}
              <Link 
                to="/signin" 
                className="font-bold text-indigo-650 hover:text-indigo-500 transition-colors underline decoration-dotted"
              >
                {t('auth.signUp.signIn')}
              </Link>
            </div>
          </div>
        </AnimatedCard>

        {/* Minimalist Footer */}
        <div className="mt-8 text-center text-[11px] text-muted-foreground/60 select-none animate-reveal-up" style={{ animationDelay: '500ms' }}>
          <p>© {new Date().getFullYear()} PGT Global Network</p>
          <div className="mt-1.5 flex justify-center gap-3">
            <Link to="/privacy" className="hover:text-indigo-600 hover:underline transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-indigo-600 hover:underline transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
