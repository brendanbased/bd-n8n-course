'use client'

import { Trophy, Target, Clock, Star } from 'lucide-react'

interface ProgressOverviewProps {
  userProgress: any[]
}

export function ProgressOverview({ userProgress }: ProgressOverviewProps) {
  // Calculate progress statistics
  const totalModules = 6
  const totalLessons = 18 // 6 modules × 3 lessons
  const totalProjects = 6 // 1 project per module

  const completedModules = 0 // TODO: Calculate from userProgress
  const completedLessons = 0 // TODO: Calculate from userProgress
  const completedProjects = 0 // TODO: Calculate from userProgress

  const overallProgress = ((completedLessons + completedProjects) / (totalLessons + totalProjects)) * 100

  const stats = [
    {
      icon: Target,
      label: 'Overall Progress',
      value: `${Math.round(overallProgress)}%`,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Trophy,
      label: 'Modules Completed',
      value: `${completedModules}/${totalModules}`,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Star,
      label: 'Lessons Completed',
      value: `${completedLessons}/${totalLessons}`,
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      label: 'Projects Completed',
      value: `${completedProjects}/${totalProjects}`,
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
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
