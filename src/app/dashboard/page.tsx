'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DatabaseService, DataTransformer } from '@/lib/database'
import { ModuleCard } from '@/components/course/module-card'
import { ProgressOverview } from '@/components/course/progress-overview'
import { DeveloperReset } from '@/components/course/developer-reset'
import { ResourceCard } from '@/components/course/resource-card'
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
  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Ambient loading effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <Navbar />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-6 text-center backdrop-blur-xl shadow-lg">
            <p className="text-white text-lg mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/25"
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
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(147, 51, 234, 0.3) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-br from-white via-purple-50 to-violet-100 bg-clip-text text-transparent mb-2">
              Welcome back, {session.user?.name}!
            </h1>
            <p className="text-slate-300 text-lg">
              Continue your journey to n8n mastery
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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0">
        {/* Primary ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(147, 51, 234, 0.3) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
        
        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-indigo-900/10"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-violet-900/5 via-transparent to-purple-900/5"></div>
      </div>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-br from-white via-purple-50 to-violet-100 bg-clip-text text-transparent mb-2">
            Welcome back, {session.user?.name}!
          </h1>
            <p className="text-slate-300 text-lg">
              Continue your journey to n8n mastery
            </p>
        </div>

        <ProgressOverview userProgress={userProgress} modules={modules} />

        <div className="mt-12">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-50 to-violet-100 bg-clip-text text-transparent mb-6">Course Modules</h2>
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-50 to-violet-100 bg-clip-text text-transparent mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard
              title="Master N8N in 2 Hours"
              description="A comprehensive beginner's guide that takes you from novice to proficient in n8n, covering essential concepts, triggers, actions, and building AI agents."
              videoUrl="https://www.youtube.com/watch?v=AURnISajubk"
            />
            <ResourceCard
              title="N8N Full Course 8 Hours"
              description="An in-depth 8-hour course teaching you how to build and sell AI-powered automations using n8n, with step-by-step instructions and real-world applications."
              videoUrl="https://www.youtube.com/watch?v=2GZ2SNXWK-c"
            />
            <ResourceCard
              title="Build Your Own AI SaaS"
              description="Learn to develop and sell AI agents and automations that solve business problems, focusing on practical implementation and monetization strategies."
              videoUrl="https://www.youtube.com/watch?v=TLpGkllBpl4"
            />
          </div>
        </div>
      </main>
      
      <DeveloperReset onReset={fetchData} />
    </div>
  )
}
