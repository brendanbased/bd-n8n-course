'use client'

import { Play, CheckCircle, Lock } from 'lucide-react'
import Link from 'next/link'

interface LessonCardProps {
  lesson: {
    id: string
    title: string
    description: string
    order: number
  }
  moduleId: string
  isLocked: boolean
  isCompleted: boolean
}

export function LessonCard({ lesson, moduleId, isLocked, isCompleted }: LessonCardProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 transition-all duration-300 ${
      isLocked ? 'opacity-60' : 'hover:bg-white/15'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isCompleted 
              ? 'bg-green-500' 
              : isLocked 
                ? 'bg-gray-500' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
          }`}>
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-white" />
            ) : isLocked ? (
              <Lock className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                Lesson {lesson.order}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-2">{lesson.description}</p>
          </div>
        </div>

        <div className="ml-4">
          {isLocked ? (
            <div className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg text-sm">
              Locked
            </div>
          ) : (
            <Link
              href={`/module/${moduleId}/lesson/${lesson.id}`}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
            >
              {isCompleted ? 'Review' : 'Start'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
