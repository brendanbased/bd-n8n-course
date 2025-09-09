'use client'

import { Code, CheckCircle, Lock, Target, List, ChevronDown, ChevronUp, ExternalLink, Play } from 'lucide-react'
import { useState } from 'react'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    requirements: string[]
    video_url?: string
    youtube_urls?: string[]
  }
  moduleId: string
  isLocked: boolean
  isCompleted: boolean
}

export function ProjectCard({ project, moduleId, isLocked, isCompleted }: ProjectCardProps) {
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
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4 flex-1">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              isCompleted 
                ? 'bg-green-500' 
                : isLocked 
                  ? 'bg-gray-500' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : isLocked ? (
                <Lock className="w-8 h-8 text-white" />
              ) : (
                <Code className="w-8 h-8 text-white" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">
                  Project
                </span>
              </div>
              <p className="text-gray-300 mb-4">{project.description}</p>
            </div>
          </div>

          <div className="ml-4 flex flex-col items-end space-y-2">
            {isLocked ? (
              <div className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg text-sm">
                Locked
              </div>
            ) : (
              <>
                {(project.youtube_urls && project.youtube_urls.length > 0) && (
                  <span className="text-xs text-gray-400">
                    {project.youtube_urls.length === 1 ? 'Video Available' : `${project.youtube_urls.length} Videos Available`}
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

        {/* Requirements - Always visible */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-white">Project Requirements</h4>
          </div>
          <div className="space-y-2">
            {project.requirements.map((requirement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-300">{requirement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <List className="w-3 h-3" />
            <span>{project.requirements.length} Requirements</span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && !isLocked && (
        <div className="px-6 pb-6 border-t border-white/10">
          <div className="pt-4">
            {project.youtube_urls && project.youtube_urls.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white mb-3">
                  {project.youtube_urls.length === 1 ? 'Project Video' : 'Project Videos'}
                </h4>
                <div className="space-y-2">
                  {project.youtube_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-300 hover:text-blue-200 underline text-sm transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.youtube_urls.length === 1 
                        ? `${project.title} - Video` 
                        : `${project.title} - Video ${index + 1}`
                      }
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                No video available for this project yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
