import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Loader2, RefreshCw, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import HeroBackground from '../../components/HeroBackground'
import AnimatedCard from '../../components/AnimatedCard'
import { useLanguage } from '../../contexts/LanguageContext'
import SEO from '../../components/SEO'

const VerifyEmail: React.FC = () => {
  const { user, isEmailVerified, resendVerification, signOut } = useAuth()
  const { resolvedTheme } = useTheme()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const emailParam = searchParams.get('email')
  
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)

  // Redirect if user is verified
  useEffect(() => {
    if (user && isEmailVerified) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, isEmailVerified, navigate])

  // Countdown timer for resending
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

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
      script.async = true
      script.defer = true
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

  const handleResend = async () => {
    if (countdown > 0) return
    setError('')
    setSuccess('')

    // Require human verification
    if (!turnstileToken) {
      setError('Please complete the security check.')
      return
    }

    setLoading(true)

    const email = user?.email || emailParam
    if (!email) {
      setError('Could not identify your email address. Please sign in again.')
      setLoading(false)
      return
    }

    try {
      await resendVerification(email, turnstileToken)
      setSuccess('Verification email resent successfully! Please check your inbox.')
      setCountdown(60) // 60s cooldown
      
      // Reset Turnstile token on success to prepare for next run if needed
      if (window.turnstile && turnstileContainerRef.current) {
        window.turnstile.reset(turnstileContainerRef.current)
        setTurnstileToken(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email. Please try again later.')
      
      // Reset Turnstile on error
      if (window.turnstile && turnstileContainerRef.current) {
        window.turnstile.reset(turnstileContainerRef.current)
        setTurnstileToken(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/signin')
    } catch (e) {}
  }

  const targetEmail = user?.email || emailParam || 'your email'
  const descRaw = t('auth.verify.desc', { email: targetEmail });
  const desc = descRaw === 'auth.verify.desc' ? `We've sent a verification link to ${targetEmail}. Please click the link inside the email to complete your registration.` : descRaw;

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden transition-colors duration-300">
      <SEO title="Verify Email" noindex={true} />
      <HeroBackground />

      {/* Back to Website Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 sm:top-8 sm:left-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-indigo-500 transition-colors duration-300 z-20 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 duration-300" />
        {t('common.backToHome') === 'common.backToHome' ? 'Back to Website' : t('common.backToHome')}
      </Link>

      <div className="max-w-md w-full z-10 text-left">
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
              {t('auth.verify.title')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('auth.verify.subtitle')}
            </p>
          </div>

          <div className="bg-card/90 border border-border backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-slate-100/10 dark:shadow-none">
            <div className="text-center py-4 space-y-5 animate-fadeIn">
              <div className="w-14 h-14 bg-indigo-50/10 dark:bg-indigo-950/20 border border-indigo-500/20 text-indigo-650 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                <Mail className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-bold text-foreground">{t('auth.verify.pending')}</h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                {desc}
              </p>

              {success && (
                <div className="bg-green-50/10 dark:bg-green-950/20 border border-green-200/20 text-green-700 dark:text-green-400 text-xs py-3 px-4 rounded-xl shadow-sm">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-50/10 dark:bg-red-950/20 border border-red-200/25 text-red-700 dark:text-red-400 text-xs py-3 px-4 rounded-xl shadow-sm">
                  {error}
                </div>
              )}

              {/* Cloudflare Turnstile */}
              <div className="flex justify-center py-1">
                <div ref={turnstileContainerRef} id="turnstile-container"></div>
              </div>

              <div className="pt-4 space-y-3">
                {/* Resend Button */}
                <button
                  onClick={handleResend}
                  disabled={loading || countdown > 0}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('auth.verify.resending')}
                    </>
                  ) : countdown > 0 ? (
                    <>
                      {t('auth.verify.cooldown', { seconds: countdown }) === 'auth.verify.cooldown' ? `Resend Link in ${countdown}s` : t('auth.verify.cooldown', { seconds: countdown })}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      {t('auth.verify.btnResend')}
                    </>
                  )}
                </button>

                {/* Sign Out (to switch account) */}
                <button
                  onClick={handleSignOut}
                  className="w-full border border-border hover:bg-accent text-foreground py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  {t('auth.verify.btnSignOut')}
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              {t('auth.verify.alreadyVerified')}{' '}
              <button 
                onClick={() => window.location.reload()} 
                className="font-bold text-indigo-600 hover:text-indigo-500 underline transition-colors cursor-pointer"
              >
                {t('auth.verify.refresh')}
              </button>
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

export default VerifyEmail
