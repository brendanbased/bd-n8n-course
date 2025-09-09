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
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 transition-all duration-300 h-[280px] flex flex-col ${
      isLocked ? 'opacity-60' : 'hover:bg-white/15 hover:scale-105'
    }`}>
      {/* Header Section - Fixed Height: 80px */}
      <div className="p-6 pb-0 h-20 flex items-center">
        <div className="flex items-center space-x-3 w-full">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isCompleted 
              ? 'bg-green-500' 
              : isLocked 
                ? 'bg-gray-500' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}>
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-white" />
            ) : isLocked ? (
              <Lock className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-white leading-tight">{module.title}</h3>
            <p className="text-sm text-gray-300">Module {module.order}</p>
          </div>
        </div>
      </div>

      {/* Progress Section - Fixed Height: 50px */}
      <div className="px-6 h-12 flex flex-col justify-center">
        <div className="flex justify-between text-xs text-gray-300 mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Content Section - Fixed Height: 70px */}
      <div className="px-6 h-16 flex flex-col justify-center">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span>{module.lessons.length} Lessons</span>
            </div>
            <span className="text-xs text-gray-400">
              {progress.filter(p => p.lesson_id && p.completed).length}/{module.lessons.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <Code className="w-4 h-4 flex-shrink-0" />
              <span>1 Project</span>
            </div>
            <span className="text-xs text-gray-400">
              {module.project && progress.some(p => p.lesson_id === module.project?.id && p.completed) ? 1 : 0}/1
            </span>
          </div>
        </div>
      </div>

      {/* Button Section - Fixed Height: 80px */}
      <div className="p-6 pt-4 h-20 flex items-center">
        {isLocked ? (
          <div className="w-full py-3 px-4 bg-gray-600 text-gray-300 rounded-lg text-center text-sm font-medium">
            Complete previous module to unlock
          </div>
        ) : (
          <Link
            href={`/module/${module.id}`}
            className="block w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-center text-sm font-medium transition-all duration-200"
          >
            {isCompleted ? 'Review Module' : completedItems > 0 ? 'Continue' : 'Start Module'}
          </Link>
        )}
      </div>
    </div>
  )
}
