import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import HeroBackground from '../../components/HeroBackground'
import AnimatedCard from '../../components/AnimatedCard'

const SignIn: React.FC = () => {
  const { signIn, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isUnverified, setIsUnverified] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.email_confirmed_at) {
      navigate(redirect, { replace: true })
    }
  }, [user, navigate, redirect])

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
            theme: 'light',
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
  }, [])

  // Auto-fill email if Remember Me was selected previously
  useEffect(() => {
    const savedEmail = localStorage.getItem('pgt_remembered_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Require human verification
    if (!turnstileToken) {
      setError('Please complete the security check.')
      return
    }

    setLoading(true)

    try {
      await signIn(email, password, turnstileToken)
      if (rememberMe) {
        localStorage.setItem('pgt_remembered_email', email)
      } else {
        localStorage.removeItem('pgt_remembered_email')
      }
      navigate(redirect, { replace: true })
    } catch (err: any) {
      if (err.name === 'EmailNotConfirmed' || err.message.toLowerCase().includes('verified')) {
        setIsUnverified(true)
        setError('Your email address has not yet been verified. Please check your inbox and verify your account before signing in.')
      } else {
        setError(err.message || 'Failed to sign in. Please verify your credentials.')
      }
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
    <div className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden">
      <HeroBackground />

      {/* Back to Website Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 sm:top-8 sm:left-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors duration-300 z-20 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 duration-300" />
        Back to Website
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
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                PGT Global Network
              </span>
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your dashboard and active programs
            </p>
          </div>

          <div className="bg-white/80 border border-slate-200/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-indigo-100/30">
            {error && !isUnverified && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-xs py-3 px-4 rounded-xl flex items-start gap-2.5 shadow-sm animate-fadeIn">
                <span className="font-bold flex-shrink-0">Error:</span>
                <span>{error}</span>
              </div>
            )}

            {isUnverified ? (
              <div className="space-y-6 text-center animate-fadeIn">
                <div className="mx-auto w-12 h-12 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center text-amber-600 shadow-inner">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-900">Verification Required</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Your email address has not yet been verified. Please check your inbox and verify your account before signing in.
                  </p>
                </div>
                
                <div className="pt-2 flex flex-col gap-3">
                  <Link
                    to={`/verify-email?email=${encodeURIComponent(email)}`}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] text-center cursor-pointer"
                  >
                    Resend Verification Email
                  </Link>
                  <button
                    onClick={() => {
                      setIsUnverified(false)
                      setError('')
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 px-4 rounded-xl text-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-xs text-slate-450">
                    Fields marked with <span className="text-red-500 font-bold">*</span> are required.
                  </p>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-550 uppercase tracking-widest mb-1.5">
                      Email Address <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest">
                        Password <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <Link 
                        to="/forgot-password" 
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-450 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-slate-500 cursor-pointer hover:text-slate-700 transition-colors select-none">
                      Remember my email address
                    </label>
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
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/90 px-3 text-slate-400 font-semibold tracking-wider">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google Logo" 
                    className="h-5 w-5" 
                  />
                  Continue with Google
                </button>

                <div className="mt-6 text-center text-xs text-slate-500">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors underline decoration-dotted"
                  >
                    Create account
                  </Link>
                </div>
              </>
            )}
          </div>
        </AnimatedCard>
      </div>
    </div>
  )
}

export default SignIn
