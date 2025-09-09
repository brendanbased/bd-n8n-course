'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { courseModules } from '@/data/course-structure'
import { Navbar } from '@/components/layout/navbar'
import { LessonCard } from '@/components/course/lesson-card'
import { ProjectCard } from '@/components/course/project-card'
import { ArrowLeft, BookOpen, Code } from 'lucide-react'
import Link from 'next/link'

interface ModulePageProps {
  params: {
    moduleId: string
  }
}

export default function ModulePage({ params }: ModulePageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userProgress, setUserProgress] = useState<any[]>([])

  const module = courseModules.find(m => m.id === params.moduleId)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (!module) {
      router.push('/dashboard')
      return
    }

    // TODO: Fetch user progress from Supabase
    setUserProgress([])
  }, [session, status, router, module])

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

  if (!session || !module) {
    return null
  }

  const completedLessons = userProgress.filter(p => p.lesson_id && p.completed).length
  const completedProjects = userProgress.filter(p => p.project_id && p.completed).length
  const totalItems = module.lessons.length + 1
  const completedItems = completedLessons + completedProjects
  const progressPercentage = (completedItems / totalItems) * 100

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
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4" />
                    <span>1 Project</span>
                  </div>
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
                isLocked={index > 0 && !userProgress.some(p => p.lesson_id === module.lessons[index - 1].id && p.completed)}
                isCompleted={userProgress.some(p => p.lesson_id === lesson.id && p.completed)}
              />
            ))}
          </div>
        </div>

        {/* Project */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Module Project</h2>
          <ProjectCard
            project={module.project}
            moduleId={module.id}
            isLocked={completedLessons < module.lessons.length}
            isCompleted={userProgress.some(p => p.project_id === module.project.id && p.completed)}
          />
        </div>
      </main>
    </div>
  )
}
