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
      color: 'bg-purple-500',
      shadowColor: 'shadow-purple-500/25',
    },
    {
      icon: Trophy,
      label: 'Modules Completed',
      value: `${stats.completedModules}/${stats.totalModules}`,
      color: 'bg-amber-500',
      shadowColor: 'shadow-amber-500/25',
    },
    {
      icon: Star,
      label: 'Lessons Completed',
      value: `${stats.completedLessons}/${stats.totalLessons}`,
      color: 'bg-emerald-500',
      shadowColor: 'shadow-emerald-500/25',
    },
    {
      icon: Clock,
      label: 'Projects Completed',
      value: `${stats.completedProjects}/${stats.totalProjects}`,
      color: 'bg-violet-500',
      shadowColor: 'shadow-violet-500/25',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-slate-900/30 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 relative overflow-hidden group hover:bg-slate-800/40 hover:border-purple-400/30 transition-all duration-300"
          >
            {/* Card ambient effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 rounded-xl"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center shadow-lg ${stat.shadowColor} relative overflow-hidden`}>
                  {/* Icon container inner effects */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-lg"></div>
                  <Icon className="w-6 h-6 text-white relative z-10" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-white via-purple-50 to-violet-100 bg-clip-text text-transparent mb-1">{stat.value}</p>
                <p className="text-slate-300 text-sm">{stat.label}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
