'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DatabaseService, DataTransformer } from '@/lib/database'
import { ModuleCard } from '@/components/course/module-card'
import { ProgressOverview } from '@/components/course/progress-overview'
import { DeveloperReset } from '@/components/course/developer-reset'
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
      // Don't set loading to true - let the page render immediately
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
      setLoading(false) // Only set loading to false when data is ready
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load course data. Please try again.')
      setLoading(false)
    }
  }

  // Only show loading screen for session loading, not data loading
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

  // If modules are still loading, show skeleton
  if (modules.length === 0 && !error) {
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

          {/* Progress Overview Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg animate-pulse"></div>
                </div>
                <div>
                  <div className="h-8 bg-white/20 rounded-lg mb-1 animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Course Modules Skeleton */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Course Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg animate-pulse"></div>
                      <div>
                        <div className="h-6 w-32 bg-white/20 rounded-lg mb-1 animate-pulse"></div>
                        <div className="h-4 w-20 bg-white/10 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="h-4 bg-white/10 rounded-lg mb-4 animate-pulse"></div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <div className="h-3 w-16 bg-white/10 rounded animate-pulse"></div>
                      <div className="h-3 w-8 bg-white/10 rounded animate-pulse"></div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-white/20 h-2 rounded-full w-1/3 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
                      <div className="h-4 w-8 bg-white/10 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-20 bg-white/10 rounded animate-pulse"></div>
                      <div className="h-4 w-8 bg-white/10 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-white/20 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        <DeveloperReset onReset={fetchData} />
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

        <ProgressOverview userProgress={userProgress} modules={modules} />

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Course Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => {
              // Get progress for lessons in this module (lesson records have module_id = null)
              const allLessonIds = [...module.lessons.map(l => l.id), ...(module.project ? [module.project.id] : [])]
              const moduleProgress = userProgress.filter(p => 
                p.lesson_id && allLessonIds.includes(p.lesson_id)
              )
              
              return (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isLocked={module.is_locked}
                  progress={moduleProgress}
                />
              )
            })}
          </div>
        </div>

        {/* Additional Resources Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Additional Resources</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <div className="space-y-2">
              <a
                href="https://www.youtube.com/watch?v=example1"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-300 hover:text-blue-200 underline text-sm transition-colors duration-200"
              >
                Getting Started with N8n
              </a>
              <a
                href="https://www.youtube.com/watch?v=example2"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-300 hover:text-blue-200 underline text-sm transition-colors duration-200"
              >
                Advanced N8n Workflows
              </a>
              <a
                href="https://www.youtube.com/watch?v=example3"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-300 hover:text-blue-200 underline text-sm transition-colors duration-200"
              >
                N8n Integration Patterns
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <DeveloperReset onReset={fetchData} />
    </div>
  )
}
