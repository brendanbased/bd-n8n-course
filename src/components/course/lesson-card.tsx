'use client'

import { Play, CheckCircle, Lock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
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
}

export function LessonCard({ lesson, moduleId, isLocked, isCompleted }: LessonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggleExpand = () => {
    if (!isLocked) {
      setIsExpanded(!isExpanded)
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
                {(lesson.youtube_urls && lesson.youtube_urls.length > 0) && (
                  <span className="text-xs text-gray-400">
                    {lesson.youtube_urls.length === 1 ? 'Video Available' : `${lesson.youtube_urls.length} Videos Available`}
                  </span>
                )}
                <div className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-white" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white" />
                  )}
                </div>
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
                  {lesson.youtube_urls.length === 1 ? 'Video Lesson' : 'Video Lessons'}
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
