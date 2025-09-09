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
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 transition-all duration-300 ${
      isLocked ? 'opacity-60' : 'hover:bg-white/15 hover:scale-105'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
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
          <div>
            <h3 className="text-lg font-semibold text-white">{module.title}</h3>
            <p className="text-sm text-gray-300">Module {module.order}</p>
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {module.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-300 mb-1">
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

      {/* Module Content */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-300">
            <BookOpen className="w-4 h-4" />
            <span>{module.lessons.length} Lessons</span>
          </div>
          <span className="text-xs text-gray-400">
            {progress.filter(p => p.lesson_id && p.completed).length}/{module.lessons.length}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-300">
            <Code className="w-4 h-4" />
            <span>1 Project</span>
          </div>
          <span className="text-xs text-gray-400">
            {progress.filter(p => p.project_id && p.completed).length}/1
          </span>
        </div>
      </div>

      {/* Action Button */}
      {isLocked ? (
        <div className="w-full py-2 px-4 bg-gray-600 text-gray-300 rounded-lg text-center text-sm">
          Complete previous module to unlock
        </div>
      ) : (
        <Link
          href={`/module/${module.id}`}
          className="block w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-center text-sm font-medium transition-all duration-200"
        >
          {isCompleted ? 'Review Module' : completedItems > 0 ? 'Continue' : 'Start Module'}
        </Link>
      )}
    </div>
  )
}
