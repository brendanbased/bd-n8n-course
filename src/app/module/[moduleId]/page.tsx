'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import { CourseDataService } from '@/lib/course-data'
import { Navbar } from '@/components/layout/navbar'
import { LessonCard } from '@/components/course/lesson-card'
import { ProjectCard } from '@/components/course/project-card'
import { DeveloperReset } from '@/components/course/developer-reset'
import { ArrowLeft, BookOpen, Code } from 'lucide-react'
import Link from 'next/link'
import { Module, Lesson, Project, UserProgress } from '@/types'

interface ModulePageProps {
  params: Promise<{
    moduleId: string
  }>
}

export default function ModulePage({ params }: ModulePageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [module, setModule] = useState<(Module & { lessons: Lesson[], project: Project | null }) | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const resolvedParams = use(params)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchData()
  }, [session, status, router, resolvedParams.moduleId])

  const fetchData = async () => {
    try {
      // Don't set loading to true - let the page render immediately
      setError(null)

      // Fetch module and user progress in parallel
      const [moduleData, progressResponse] = await Promise.all([
        CourseDataService.getModule(resolvedParams.moduleId),
        fetch('/api/progress')
      ])

      if (!moduleData) {
        router.push('/dashboard')
        return
      }

      if (!progressResponse.ok) {
        throw new Error('Failed to fetch progress')
      }

      const progressData = await progressResponse.json()
      
      console.log('Fetched progress data:', progressData.progress)
      setModule(moduleData)
      setUserProgress(progressData.progress || [])
      setLoading(false) // Only set loading to false when data is ready
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load module data. Please try again.')
      setLoading(false)
    }
  }

  // Refresh progress data without showing loading screen
  const refreshProgressData = async () => {
    try {
      console.log('Refreshing progress data silently...')
      const progressResponse = await fetch('/api/progress')

      if (!progressResponse.ok) {
        throw new Error('Failed to fetch progress')
      }

      const progressData = await progressResponse.json()
      console.log('Silently fetched progress data:', progressData.progress)
      setUserProgress(progressData.progress || [])
    } catch (err) {
      console.error('Error refreshing progress data:', err)
      // Don't show error to user for silent refresh
    }
  }

  const handleLessonComplete = async (lessonId: string, moduleId: string) => {
    try {
      console.log('Attempting to complete lesson:', lessonId, 'in module:', moduleId)
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'lesson',
          itemId: lessonId,
          moduleId: moduleId,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Lesson completion result:', result)
        
        if (result.alreadyCompleted) {
          console.log('Lesson was already completed, no need to refresh')
          return
        }
        
        // Refresh progress data for new completions (silently)
        await refreshProgressData()
      } else {
        try {
          const error = await response.json()
          console.error('Failed to mark lesson complete:', error)
          alert(`Failed to mark lesson as complete: ${error.details || error.error || 'Unknown error'}`)
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
          alert(`Failed to mark lesson as complete: HTTP ${response.status}`)
        }
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error)
      alert('Failed to mark lesson as complete. Please try again.')
    }
  }

  const handleProjectComplete = async (projectId: string, moduleId: string) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'project',
          itemId: projectId,
          moduleId: moduleId,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Project completion result:', result)
        
        if (result.alreadyCompleted) {
          console.log('Project was already completed, no need to refresh')
          return
        }
        
        // Refresh progress data for new completions (silently)
        await refreshProgressData()
      } else {
        const error = await response.json()
        console.error('Failed to mark project complete:', error)
        alert(`Failed to mark project as complete: ${error.details || error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error marking project complete:', error)
      alert('Failed to mark project as complete. Please try again.')
    }
  }

  if (status === 'loading') {
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

  if (!session) {
    return null
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

  // If module data is still loading, show skeleton
  if (!module) {
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
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 text-gray-300 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            
            {/* Module Header Skeleton */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="h-10 bg-white/20 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-6 bg-white/10 rounded-lg mb-4 animate-pulse"></div>
                  <div className="flex items-center space-x-6">
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-white/10 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-8 w-16 bg-white/20 rounded-lg mb-1 animate-pulse"></div>
                  <div className="h-4 w-12 bg-white/10 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Lessons Skeleton */}
          <div className="mb-12">
            <div className="h-8 w-32 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-white/20 rounded-lg animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-white/20 rounded-lg mb-2 animate-pulse"></div>
                        <div className="h-4 bg-white/10 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Skeleton */}
          <div>
            <div className="h-8 w-40 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-16 h-16 bg-white/20 rounded-xl animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-7 bg-white/20 rounded-lg mb-2 animate-pulse"></div>
                    <div className="h-5 bg-white/10 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Count completed regular lessons (not projects)
  const completedLessons = userProgress.filter(p => 
    p.lesson_id && p.completed && 
    module.lessons.some(lesson => lesson.id === p.lesson_id)
  ).length
  
  // Check if project is completed (project is a lesson with order_index 4)
  const projectCompleted = module.project ? 
    userProgress.some(p => p.lesson_id === module.project?.id && p.completed) : false
  
  const totalItems = module.lessons.length + (module.project ? 1 : 0)
  const completedItems = completedLessons + (projectCompleted ? 1 : 0)
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

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
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{module.title}</h1>
                <p className="text-gray-300 text-lg mb-4">{module.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{module.lessons.length} Lessons</span>
                  </div>
                  {module.project && (
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4" />
                      <span>1 Project</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-sm text-gray-300">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Lessons</h2>
          <div className="space-y-4">
            {module.lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                moduleId={module.id}
                isLocked={lesson.is_locked}
                isCompleted={userProgress.some(p => p.lesson_id === lesson.id && p.completed)}
                onComplete={handleLessonComplete}
              />
            ))}
          </div>
        </div>

        {/* Project */}
        {module.project && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Module Project</h2>
            <ProjectCard
              project={module.project}
              moduleId={module.id}
              isLocked={module.project.is_locked}
              isCompleted={userProgress.some(p => p.lesson_id === module.project?.id && p.completed)}
              onComplete={handleProjectComplete}
            />
          </div>
        )}
      </main>
      
      <DeveloperReset onReset={refreshProgressData} />
    </div>
  )
}
