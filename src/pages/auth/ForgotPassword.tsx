import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import HeroBackground from '../../components/HeroBackground'
import AnimatedCard from '../../components/AnimatedCard'

const ForgotPassword: React.FC = () => {
  const { resetPasswordForEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Require human verification
    if (!turnstileToken) {
      setError('Please complete the security check.')
      return
    }

    setLoading(true)

    try {
      await resetPasswordForEmail(email, turnstileToken)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery email. Please verify your email and try again.')
      if (window.turnstile && turnstileContainerRef.current) {
        window.turnstile.reset(turnstileContainerRef.current)
        setTurnstileToken(null)
      }
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
              Recover Password
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Receive a secure reset link in your registered email inbox
            </p>
          </div>

          <div className="bg-white/80 border border-slate-200/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-indigo-100/30">
            {success ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Recovery Email Sent</h3>
                <p className="text-sm text-slate-650 leading-relaxed">
                  We've sent a secure password reset link to <strong className="text-indigo-600">{email}</strong>. Please check your inbox and spam folders.
                </p>
                <div className="pt-4">
                  <Link 
                    to="/signin" 
                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-xs tracking-wide hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-xs py-3 px-4 rounded-xl flex items-start gap-2.5 shadow-sm">
                    <span className="font-bold flex-shrink-0">Error:</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-xs text-slate-455">
                    Fields marked with <span className="text-red-500 font-bold">*</span> are required.
                  </p>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
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
                        Sending link...
                      </>
                    ) : (
                      <>
                        Send Recovery Link
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
                  <Link 
                    to="/signin" 
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Sign In
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

export default ForgotPassword
