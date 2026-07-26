import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Check, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import HeroBackground from '../../components/HeroBackground'
import AnimatedCard from '../../components/AnimatedCard'

const ResetPassword: React.FC = () => {
  const { updatePassword, user } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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
    if (strengthScore <= 2) return { label: 'Weak', color: 'bg-red-500 w-1/5', text: 'text-red-500' }
    if (strengthScore === 3) return { label: 'Fair', color: 'bg-orange-500 w-2/5', text: 'text-orange-500' }
    if (strengthScore === 4) return { label: 'Good', color: 'bg-yellow-500 w-3/5', text: 'text-yellow-600' }
    if (strengthScore === 5) return { label: 'Strong', color: 'bg-indigo-500 w-4/5', text: 'text-indigo-600' }
    return { label: 'Excellent', color: 'bg-green-500 w-full', text: 'text-green-600' }
  }

  const strength = getStrengthLabelAndColor()
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!user) {
      setError('No active session found. Please click the reset link in your email again.')
      return
    }

    if (strengthScore < 4) {
      setError('Please choose a stronger password that meets most requirements.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await updatePassword(password)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired or is invalid.')
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

      <div className="max-w-lg w-full z-10">
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
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your new secure password below to regain access
            </p>
          </div>

          <div className="bg-white/80 border border-slate-200/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-indigo-100/30">
            {success ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Password Updated</h3>
                <p className="text-sm text-slate-650 leading-relaxed">
                  Your password has been successfully updated. You can now use your new password to sign in.
                </p>
                <div className="pt-4">
                  <Link 
                    to="/signin" 
                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-xs tracking-wide hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    Go to Sign In
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

                {!user && (
                  <div className="mb-5 bg-amber-50 border border-amber-200 text-amber-850 text-xs py-3.5 px-4 rounded-xl shadow-sm">
                    <span className="font-bold">Warning:</span> No active recovery session was detected. If you just clicked a link, wait a second for the session to initialize, or request a new reset link.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-xs text-slate-455">
                    Fields marked with <span className="text-red-500 font-bold">*</span> are required.
                  </p>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
                      New Password <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                        placeholder="Enter your new password"
                        required
                        disabled={!user}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-455 hover:text-slate-600 transition-colors"
                        disabled={!user}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password.length > 0 && (
                      <div className="mt-2.5">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="text-slate-500 font-semibold">Password strength:</span>
                          <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                          <div className={`h-full transition-all duration-500 ${strength.color}`} />
                        </div>
                      </div>
                    )}

                    {/* Checklist */}
                    {password.length > 0 && (
                      <div className="mt-4 bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-2">
                        <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1">
                          Requirements
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            {hasMinLength ? (
                              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mx-1 flex-shrink-0" />
                            )}
                            <span className={hasMinLength ? 'text-green-700' : 'text-slate-500'}>8+ Characters</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasUppercase ? (
                              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mx-1 flex-shrink-0" />
                            )}
                            <span className={hasUppercase ? 'text-green-700' : 'text-slate-500'}>Uppercase Letter</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasLowercase ? (
                              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mx-1 flex-shrink-0" />
                            )}
                            <span className={hasLowercase ? 'text-green-700' : 'text-slate-500'}>Lowercase Letter</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasNumber ? (
                              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mx-1 flex-shrink-0" />
                            )}
                            <span className={hasNumber ? 'text-green-700' : 'text-slate-500'}>Number</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasSpecial ? (
                              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mx-1 flex-shrink-0" />
                            )}
                            <span className={hasSpecial ? 'text-green-700' : 'text-slate-500'}>Special Character</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-555 uppercase tracking-widest mb-1.5">
                      Confirm New Password <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-11 pr-11 py-3 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 ${
                          confirmPassword.length > 0
                            ? passwordsMatch
                              ? 'border-green-500 focus:ring-green-550/50'
                              : 'border-red-400 focus:ring-red-450/50'
                            : 'border-slate-200'
                        }`}
                        placeholder="Confirm your new password"
                        required
                        disabled={!user}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-455 hover:text-slate-655 transition-colors"
                        disabled={!user}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && (
                      <span className={`block text-xs mt-1.5 font-bold ${
                        passwordsMatch ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </span>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !user}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      <>
                        Update Password
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                  Know your password?{' '}
                  <Link 
                    to="/signin" 
                    className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors underline"
                  >
                    Sign In
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

export default ResetPassword
