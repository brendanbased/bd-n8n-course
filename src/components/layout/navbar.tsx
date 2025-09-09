'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { LogOut, User } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-slate-900/40 backdrop-blur-xl border-b border-purple-500/20 relative overflow-hidden">
      {/* Navbar ambient effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/15 via-violet-500/10 to-indigo-500/15"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/40 to-indigo-400/40 rounded-lg blur-md"></div>
              <Image
                src="/logo.png"
                alt="Build Different Logo"
                width={40}
                height={40}
                className="rounded-lg relative z-10 shadow-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-200 via-violet-100 to-indigo-200 bg-clip-text text-transparent tracking-wide">BUILD DIFFERENT</span>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-purple-100 to-violet-200 bg-clip-text text-transparent -mt-1">n8n Mastery</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user && (
              <>
                <div className="flex items-center space-x-3 bg-slate-800/30 backdrop-blur-lg rounded-xl px-3 py-2 border border-purple-500/20">
                  {session.user.image ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-indigo-400/30 rounded-full blur-sm"></div>
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full relative z-10 border border-purple-400/20"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center border border-purple-400/30 shadow-lg shadow-purple-500/20">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-white font-medium">
                    {session.user.name}
                  </span>
                </div>
                
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white bg-slate-800/30 hover:bg-purple-500/20 rounded-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-400/30 backdrop-blur-lg group"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
