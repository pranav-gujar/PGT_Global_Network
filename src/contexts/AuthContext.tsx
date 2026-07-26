import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  userRole: 'admin' | 'team_member' | 'volunteer' | 'user' | null
  isEmailVerified: boolean
  loading: boolean
  signIn: (email: string, password: string, captchaToken: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, captchaToken: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
  resendVerification: (email: string, captchaToken?: string) => Promise<void>
  resetPasswordForEmail: (email: string, captchaToken?: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  signInWithGoogle: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<'admin' | 'team_member' | 'volunteer' | 'user' | null>(null)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchUserRole = async (userId: string) => {
    if (userRole && user?.id === userId) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (data && !error) {
        setUserRole(data.role as any)
      } else {
        setUserRole('user')
      }
    } catch (err) {
      setUserRole('user')
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        const verified = !!currentUser.email_confirmed_at
        setIsEmailVerified(verified)
        if (verified) {
          fetchUserRole(currentUser.id)
        }
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        const verified = !!currentUser.email_confirmed_at
        setIsEmailVerified(verified)
        if (verified) {
          fetchUserRole(currentUser.id)
        } else {
          setUserRole(null)
        }
      } else {
        setIsEmailVerified(false)
        setUserRole(null)
      }
      
      setLoading(false)
    })

    // Cleanup subscription
    return () => {
      if (subscription) subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string, captchaToken: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      }
    })

    if (error) {
      if (error.message.toLowerCase().includes('confirm') || error.message.toLowerCase().includes('verify')) {
        const confirmErr = new Error('Your email address has not yet been verified. Please check your inbox and verify your account before signing in.')
        confirmErr.name = 'EmailNotConfirmed'
        throw confirmErr
      }
      throw error
    }

    const verified = !!data.user?.email_confirmed_at
    setIsEmailVerified(verified)
    
    if (verified) {
      toast.success('Successfully signed in!')
    } else {
      await supabase.auth.signOut()
      const confirmErr = new Error('Your email address has not yet been verified. Please check your inbox and verify your account before signing in.')
      confirmErr.name = 'EmailNotConfirmed'
      throw confirmErr
    }
  }

  const signUp = async (email: string, password: string, fullName: string, captchaToken: string) => {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin + '/signin',
        captchaToken,
      },
    })

    console.log('Supabase signUp response:', response)
    const { error } = response

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created successfully! A verification link has been sent to your email.')
    }
    return response
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    
    // Always clean up client-side authentication states so the user is logged out locally
    // even if the server token has already expired or is invalid.
    setUser(null)
    setSession(null)
    setUserRole(null)
    setIsEmailVerified(false)

    if (error) {
      console.error('Supabase signOut error:', error)
      toast.success('Signed out of local session.')
    } else {
      toast.success('Successfully signed out!')
    }
  }

  const updateProfile = async (data: any) => {
    if (!user) throw new Error('No user logged in')

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && _ !== 'role')
    )

    const { error } = await supabase
      .from('profiles')
      .update({
        ...cleanData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      toast.error(`Error updating profile: ${error.message}`)
      throw error
    } else {
      // Sync changed user metadata to Supabase Auth context
      const metaUpdate: any = {}
      if (cleanData.full_name !== undefined) metaUpdate.full_name = cleanData.full_name
      if (cleanData.avatar_url !== undefined) metaUpdate.avatar_url = cleanData.avatar_url

      if (Object.keys(metaUpdate).length > 0) {
        await supabase.auth.updateUser({
          data: metaUpdate
        })
      }
      toast.success('Profile updated successfully!')
    }
  }

  const resendVerification = async (email: string, captchaToken?: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: window.location.origin + '/signin',
        captchaToken,
      }
    })
    if (error) {
      toast.error(error.message)
      throw error
    } else {
      toast.success('Verification email resent successfully!')
    }
  }

  const resetPasswordForEmail = async (email: string, captchaToken?: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
      captchaToken,
    })
    if (error) {
      toast.error(error.message)
      throw error
    } else {
      toast.success('Password reset link sent to your email!')
    }
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toast.error(error.message)
      throw error
    } else {
      toast.success('Password updated successfully!')
    }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      }
    })
    if (error) {
      toast.error(error.message)
      throw error
    }
    return data
  }

  const value = {
    user,
    session,
    userRole,
    isEmailVerified,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resendVerification,
    resetPasswordForEmail,
    updatePassword,
    signInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

