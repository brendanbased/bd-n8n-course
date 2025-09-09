'use client'

import { Lock, Play, CheckCircle, BookOpen, Code } from 'lucide-react'
import Link from 'next/link'

interface ModuleCardProps {
  module: {
    id: string
    title: string
    description: string
    order: number
    lessons: any[]
    project: any
  }
  isLocked: boolean
  progress: any[]
}

export function ModuleCard({ module, isLocked, progress }: ModuleCardProps) {
  const totalItems = module.lessons.length + 1 // lessons + project
  const completedItems = progress.filter(p => p.completed).length
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0
  const isCompleted = completedItems === totalItems

  return (
    <div className={`bg-slate-900/30 backdrop-blur-xl rounded-xl border border-purple-500/20 transition-all duration-300 h-[280px] flex flex-col relative overflow-hidden group ${
      isLocked ? 'opacity-60' : 'hover:bg-slate-800/40 hover:scale-105 hover:border-purple-400/30'
    }`}>
      {/* Card ambient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 rounded-xl"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
      
      {/* Header Section - Fixed Height: 80px */}
      <div className="p-6 pb-0 h-20 flex items-center relative z-10">
        <div className="flex items-center space-x-3 w-full">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-lg ${
            isCompleted 
              ? 'bg-emerald-500 shadow-emerald-500/25' 
              : isLocked 
                ? 'bg-slate-600 shadow-slate-500/25' 
                : 'bg-purple-500 shadow-purple-500/25'
          }`}>
            {/* Icon container inner effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-lg"></div>
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-white relative z-10" />
            ) : isLocked ? (
              <Lock className="w-6 h-6 text-white relative z-10" />
            ) : (
              <Play className="w-6 h-6 text-white relative z-10" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-purple-50 to-violet-100 bg-clip-text text-transparent leading-tight">{module.title}</h3>
            <p className="text-sm text-slate-400">Module {module.order}</p>
          </div>
        </div>
      </div>

      {/* Progress Section - Fixed Height: 50px */}
      <div className="px-6 h-12 flex flex-col justify-center relative z-10">
        <div className="flex justify-between text-xs text-slate-300 mb-2">
          <span>Progress</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-500 shadow-sm shadow-purple-500/30"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Content Section - Fixed Height: 70px */}
      <div className="px-6 h-16 flex flex-col justify-center relative z-10">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-slate-300">
              <BookOpen className="w-4 h-4 flex-shrink-0 text-purple-400" />
              <span>{module.lessons.length} Lessons</span>
            </div>
            <span className="text-xs text-slate-400 font-medium bg-slate-800/50 px-2 py-1 rounded-md">
              {progress.filter(p => p.lesson_id && p.completed).length}/{module.lessons.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-slate-300">
              <Code className="w-4 h-4 flex-shrink-0 text-indigo-400" />
              <span>1 Project</span>
            </div>
            <span className="text-xs text-slate-400 font-medium bg-slate-800/50 px-2 py-1 rounded-md">
              {module.project && progress.some(p => p.lesson_id === module.project?.id && p.completed) ? 1 : 0}/1
            </span>
          </div>
        </div>
      </div>

      {/* Button Section - Fixed Height: 80px */}
      <div className="p-6 pt-4 h-20 flex items-center relative z-10">
        {isLocked ? (
          <div className="w-full py-3 px-4 bg-slate-700/50 text-slate-400 rounded-xl text-center text-sm font-medium border border-slate-600/50">
            Complete previous module to unlock
          </div>
        ) : (
          <Link
            href={`/module/${module.id}`}
            className="block w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-center text-sm font-medium transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-400/35 border border-purple-400/20 relative overflow-hidden group"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
            <span className="relative z-10 font-semibold">
              {isCompleted ? 'Review Module' : completedItems > 0 ? 'Continue' : 'Start Module'}
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
