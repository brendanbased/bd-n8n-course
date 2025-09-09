'use client'

import { Play, CheckCircle, Lock, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface LessonCardProps {
  lesson: {
    id: string
    title: string
    description: string
    order: number
    video_url?: string
    youtube_urls?: string[]
  }
  moduleId: string
  isLocked: boolean
  isCompleted: boolean
  onComplete?: (lessonId: string, moduleId: string) => Promise<void>
}

export function LessonCard({ lesson, moduleId, isLocked, isCompleted, onComplete }: LessonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)

  const handleToggleExpand = () => {
    if (!isLocked) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleMarkComplete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCompleted || isMarkingComplete || !onComplete) return
    
    setIsMarkingComplete(true)
    try {
      await onComplete(lesson.id, moduleId)
    } catch (error) {
      console.error('Failed to mark lesson complete:', error)
    } finally {
      setIsMarkingComplete(false)
    }
  }

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 transition-all duration-300 ${
      isLocked ? 'opacity-60' : 'hover:bg-white/15'
    }`}>
      <div 
        className={`p-6 cursor-pointer ${!isLocked ? 'hover:bg-white/5' : ''}`}
        onClick={handleToggleExpand}
      >
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

          <div className="ml-4 flex items-center space-x-2">
            {isLocked ? (
              <div className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg text-sm">
                Locked
              </div>
            ) : (
              <>
                {/* Completion Checkbox */}
                <button
                  onClick={handleMarkComplete}
                  disabled={isCompleted || isMarkingComplete}
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 cursor-default'
                      : isMarkingComplete
                      ? 'bg-blue-500/50 border-blue-500 cursor-wait'
                      : 'border-white/30 hover:border-green-400 hover:bg-green-400/20'
                  }`}
                  title={isCompleted ? 'Lesson completed' : 'Mark as complete'}
                >
                  {isCompleted && <CheckCircle className="w-5 h-5 text-white" />}
                  {isMarkingComplete && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
                
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && !isLocked && (
        <div className="px-6 pb-6 border-t border-white/10">
          <div className="pt-4">
            {lesson.youtube_urls && lesson.youtube_urls.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white mb-3">
                  {lesson.youtube_urls.length === 1 ? 'Video Resource' : 'Video Resources'}
                </h4>
                <div className="space-y-2">
                  {lesson.youtube_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-300 hover:text-blue-200 underline text-sm transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {lesson.youtube_urls.length === 1 
                        ? `${lesson.title} - Video` 
                        : `${lesson.title} - Video ${index + 1}`
                      }
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                No video available for this lesson yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
