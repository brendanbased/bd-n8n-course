'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import { CourseDataService } from '@/lib/course-data'
import { Navbar } from '@/components/layout/navbar'
import { LessonCard } from '@/components/course/lesson-card'
import { ProjectCard } from '@/components/course/project-card'
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
      setLoading(true)
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
      
      setModule(moduleData)
      setUserProgress(progressData.progress || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load module data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !module) {
    return null
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
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
            />
          </div>
        )}
      </main>
    </div>
  )
}
