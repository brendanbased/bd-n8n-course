'use client'

import { signIn, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('discord', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-16 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0">
        {/* Central glow effect around the sign-in box */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at center, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0.05) 40%, transparent 70%)`
        }}></div>
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at center, rgba(139, 92, 246, 0.10) 0%, rgba(139, 92, 246, 0.03) 50%, transparent 80%)`
        }}></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(147, 51, 234, 0.3) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      <div className="max-w-lg w-full bg-slate-900/30 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-purple-500/20 relative z-10 overflow-hidden">
        {/* Card inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 rounded-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-violet-500/3 via-transparent to-purple-500/3 rounded-3xl"></div>
        
        <div className="text-center relative z-10">
          {/* Logo and Company Branding */}
          <div className="mb-4">
            <div className="w-32 h-32 mx-auto mb-1 flex items-center justify-center relative">
              {/* Glowing effect around logo */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-violet-500/25 to-indigo-500/30 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/20 via-violet-400/15 to-indigo-400/20 rounded-full blur-lg"></div>
              
              <Image
                src="/logo.png"
                alt="Build Different Logo"
                width={128}
                height={128}
                className="rounded-xl relative z-10 drop-shadow-2xl"
              />
            </div>
            
            <div className="mb-4">
              <h1 className="text-3xl font-black mb-3 tracking-wide relative">
                {/* Glow layer behind text */}
                <span className="absolute inset-0 text-purple-300 font-black blur-sm opacity-60 animate-pulse">
                  BUILD DIFFERENT
                </span>
                {/* Main text with gradient */}
                <span className="relative font-black bg-gradient-to-r from-purple-300 via-white to-indigo-300 bg-clip-text text-transparent">
                  BUILD DIFFERENT
                </span>
              </h1>
              <div className="w-20 h-0.5 bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 mx-auto mb-4 rounded-full shadow-sm shadow-purple-400/50"></div>
              <h2 className="text-4xl font-bold bg-gradient-to-br from-white via-purple-50 to-violet-100 bg-clip-text text-transparent mb-4 leading-tight">
                n8n Mastery Course
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">
                Master AI automation from beginner to expert with comprehensive n8n training
              </p>
            </div>
          </div>
          
          {/* What You'll Access Inside Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-white via-purple-50 to-violet-100 bg-clip-text text-transparent mb-6 text-center">
              What You'll Access Inside
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Box 1 */}
              <div className="bg-gradient-to-br from-purple-500/10 via-violet-500/8 to-indigo-500/10 rounded-xl p-4 border border-purple-400/25 relative overflow-hidden shadow-lg shadow-purple-500/10 hover:shadow-purple-400/20 transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/5 to-transparent rounded-xl"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-8 h-8 mx-auto mb-3 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed text-center font-medium">
                    Full beginner to expert n8n curriculum
                  </p>
                </div>
              </div>
              
              {/* Box 2 */}
              <div className="bg-gradient-to-br from-purple-500/10 via-violet-500/8 to-indigo-500/10 rounded-xl p-4 border border-purple-400/25 relative overflow-hidden shadow-lg shadow-purple-500/10 hover:shadow-purple-400/20 transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/5 to-transparent rounded-xl"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-8 h-8 mx-auto mb-3 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed text-center font-medium">
                    Hands-on real-world projects
                  </p>
                </div>
              </div>
              
              {/* Box 3 */}
              <div className="bg-gradient-to-br from-purple-500/10 via-violet-500/8 to-indigo-500/10 rounded-xl p-4 border border-purple-400/25 relative overflow-hidden shadow-lg shadow-purple-500/10 hover:shadow-purple-400/20 transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/5 to-transparent rounded-xl"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-8 h-8 mx-auto mb-3 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed text-center font-medium">
                    Information packed video resources
                  </p>
                </div>
              </div>
              
              {/* Box 4 */}
              <div className="bg-gradient-to-br from-purple-500/10 via-violet-500/8 to-indigo-500/10 rounded-xl p-4 border border-purple-400/25 relative overflow-hidden shadow-lg shadow-purple-500/10 hover:shadow-purple-400/20 transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/5 to-transparent rounded-xl"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-8 h-8 mx-auto mb-3 bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed text-center font-medium">
                    Progress tracking through Discord account
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-purple-500/25 hover:shadow-purple-400/35 transform hover:scale-[1.02] active:scale-[0.98] border border-purple-400/20 relative overflow-hidden group"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              )}
              <span className="font-semibold tracking-wide">
                {isLoading ? 'Connecting...' : 'Continue with Discord'}
              </span>
            </div>
          </button>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-purple-500/20 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
            <p className="text-sm text-slate-400 leading-relaxed">
              By continuing, you agree to our{' '}
              <span className="text-purple-300 hover:text-purple-200 cursor-pointer transition-colors duration-200">terms of service</span>
              {' '}and{' '}
              <span className="text-purple-300 hover:text-purple-200 cursor-pointer transition-colors duration-200">privacy policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
