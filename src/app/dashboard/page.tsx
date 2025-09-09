'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DatabaseService, DataTransformer } from '@/lib/database'
import { ModuleCard } from '@/components/course/module-card'
import { ProgressOverview } from '@/components/course/progress-overview'
import { Navbar } from '@/components/layout/navbar'
import { Module, Lesson, Project, UserProgress } from '@/types'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [modules, setModules] = useState<(Module & { lessons: Lesson[], project: Project | null })[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchData()
  }, [session, status, router])

  // Prevent rendering if no session
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
    return null // Don't render anything while redirecting
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch modules, lessons, and user progress using database service
      const [dbModules, dbLessons, progressResponse] = await Promise.all([
        DatabaseService.getModules(),
        DatabaseService.getLessons(),
        fetch('/api/progress')
      ])

      if (!progressResponse.ok) {
        throw new Error('Failed to fetch progress')
      }

      const progressData = await progressResponse.json()
      
      // Transform database data to UI format
      const transformedModules = dbModules.map(module => 
        DataTransformer.transformModuleWithLessons(module, dbLessons)
      )
      
      setModules(transformedModules)
      setUserProgress(progressData.progress || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load course data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-white text-lg mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
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
            {modules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                isLocked={module.is_locked}
                progress={userProgress.filter(p => p.module_id === module.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
