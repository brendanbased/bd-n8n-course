'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { LogOut, User } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">N8n Mastery</h1>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user && (
              <>
                <div className="flex items-center space-x-3">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-white font-medium">
                    {session.user.name}
                  </span>
                </div>
                
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
