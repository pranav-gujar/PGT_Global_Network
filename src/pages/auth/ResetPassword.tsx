import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Check, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import HeroBackground from '../../components/HeroBackground'
import AnimatedCard from '../../components/AnimatedCard'
import { useLanguage } from '../../contexts/LanguageContext'

const ResetPassword: React.FC = () => {
  const { updatePassword, user } = useAuth()
  const { resolvedTheme } = useTheme()
  const { t } = useLanguage()
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
    if (strengthScore <= 2) return { label: t('auth.signUp.strengthWeek') === 'auth.signUp.strengthWeek' ? 'Weak' : t('auth.signUp.strengthWeek'), color: 'bg-red-500 w-1/5', text: 'text-red-500' }
    if (strengthScore === 3) return { label: t('auth.signUp.strengthFair') === 'auth.signUp.strengthFair' ? 'Fair' : t('auth.signUp.strengthFair'), color: 'bg-orange-500 w-2/5', text: 'text-orange-500' }
    if (strengthScore === 4) return { label: 'Good', color: 'bg-yellow-500 w-3/5', text: 'text-yellow-600 font-bold' }
    if (strengthScore === 5) return { label: t('auth.signUp.strengthStrong') === 'auth.signUp.strengthStrong' ? 'Strong' : t('auth.signUp.strengthStrong'), color: 'bg-indigo-500 w-4/5', text: 'text-indigo-650 dark:text-indigo-400 font-bold' }
    return { label: 'Excellent', color: 'bg-green-500 w-full', text: 'text-green-600 dark:text-green-400 font-bold' }
  }

  const strength = getStrengthLabelAndColor()
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!user) {
      setError(t('auth.reset.noSession') === 'auth.reset.noSession' ? 'No active recovery session was detected.' : t('auth.reset.noSession'))
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
    <div className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden transition-colors duration-300">
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
              {t('auth.reset.title')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('auth.reset.subtitle')}
            </p>
          </div>

          <div className="bg-card/90 border border-border backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-slate-100/10 dark:shadow-none">
            {success ? (
              <div className="text-center py-4 space-y-4 animate-fadeIn">
                <div className="w-14 h-14 bg-green-50/10 dark:bg-green-950/20 border border-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Password Updated</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your password has been successfully updated. You can now use your new password to sign in.
                </p>
                <div className="pt-4">
                  <Link 
                    to="/signin" 
                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-xs tracking-wide hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {t('auth.reset.signIn')}
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-5 bg-red-50/10 dark:bg-red-950/20 border border-red-200/25 text-red-755 dark:text-red-400 text-xs py-3 px-4 rounded-xl flex items-start gap-2.5 shadow-sm">
                    <span className="font-bold flex-shrink-0">Error:</span>
                    <span>{error}</span>
                  </div>
                )}

                {!user && (
                  <div className="mb-5 bg-amber-50/10 dark:bg-amber-950/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs py-3.5 px-4 rounded-xl shadow-sm">
                    <span className="font-bold">Warning:</span> {t('auth.reset.noSession')}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      {t('auth.reset.password')} <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 shadow-sm"
                        placeholder={t('auth.reset.passwordPlaceholder')}
                        required
                        disabled={!user}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-455 hover:text-slate-600 dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                        disabled={!user}
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

                    {/* Checklist */}
                    {password.length > 0 && (
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
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                      {t('auth.reset.confirmPassword')} <span className="text-red-500 ml-0.5">*</span>
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
                        placeholder={t('auth.reset.confirmPasswordPlaceholder')}
                        required
                        disabled={!user}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-455 hover:text-slate-655 dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                        disabled={!user}
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

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !user}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] hover:scale-[1.02] transform transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t('auth.reset.updating')}
                      </>
                    ) : (
                      <>
                        {t('auth.reset.btn')}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
                  {t('auth.reset.hasAccount')}{' '}
                  <Link 
                    to="/signin" 
                    className="font-bold text-indigo-650 hover:text-indigo-500 transition-colors underline"
                  >
                    {t('auth.reset.signIn')}
                  </Link>
                </div>
              </>
            )}
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

export default ResetPassword
