'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { courseModules } from '@/data/course-structure'
import { ModuleCard } from '@/components/course/module-card'
import { ProgressOverview } from '@/components/course/progress-overview'
import { Navbar } from '@/components/layout/navbar'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userProgress, setUserProgress] = useState<any[]>([])

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // TODO: Fetch user progress from Supabase
    // For now, we'll use mock data
    setUserProgress([])
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {session.user?.name}!
          </h1>
          <p className="text-gray-300 text-lg">
            Continue your journey to N8n mastery
          </p>
        </div>

        <ProgressOverview userProgress={userProgress} />

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Course Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseModules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                isLocked={index > 0 && !userProgress.some(p => p.module_id === courseModules[index - 1].id && p.completed)}
                progress={userProgress.filter(p => p.module_id === module.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
