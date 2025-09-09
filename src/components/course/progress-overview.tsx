'use client'

import { Trophy, Target, Clock, Star } from 'lucide-react'
import { useMemo } from 'react'

interface ProgressOverviewProps {
  userProgress: any[]
  modules: Array<{
    id: string
    lessons: Array<{ id: string }>
    project: { id: string } | null
  }>
}

export function ProgressOverview({ userProgress, modules }: ProgressOverviewProps) {
  // Calculate progress statistics
  const stats = useMemo(() => {
    const totalModules = modules.length
    const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0)
    const totalProjects = modules.filter(module => module.project).length

    // Get completed lesson IDs
    const completedLessonIds = userProgress
      .filter(p => p.completed && p.lesson_id)
      .map(p => p.lesson_id)

    // Count completed lessons and projects
    let completedLessons = 0
    let completedProjects = 0
    let completedModules = 0

    modules.forEach(module => {
      const moduleLessonsCompleted = module.lessons.filter(lesson => 
        completedLessonIds.includes(lesson.id)
      ).length
      
      const moduleProjectCompleted = module.project && 
        completedLessonIds.includes(module.project.id)

      completedLessons += moduleLessonsCompleted
      if (moduleProjectCompleted) completedProjects++

      // Module is complete if all lessons and project are done
      if (moduleLessonsCompleted === module.lessons.length && 
          (!module.project || moduleProjectCompleted)) {
        completedModules++
      }
    })

    const overallProgress = totalLessons + totalProjects > 0 
      ? ((completedLessons + completedProjects) / (totalLessons + totalProjects)) * 100 
      : 0

    return {
      totalModules,
      completedModules,
      totalLessons,
      completedLessons,
      totalProjects,
      completedProjects,
      overallProgress
    }
  }, [userProgress, modules])

  const statItems = [
    {
      icon: Target,
      label: 'Overall Progress',
      value: `${Math.round(stats.overallProgress)}%`,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Trophy,
      label: 'Modules Completed',
      value: `${stats.completedModules}/${stats.totalModules}`,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Star,
      label: 'Lessons Completed',
      value: `${stats.completedLessons}/${stats.totalLessons}`,
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      label: 'Projects Completed',
      value: `${stats.completedProjects}/${stats.totalProjects}`,
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-gray-300 text-sm">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
