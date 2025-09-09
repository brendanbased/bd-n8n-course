'use client'

import { Code, CheckCircle, Lock, ExternalLink, Play } from 'lucide-react'
import { useState } from 'react'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    requirements: string[]
    video_url?: string
    youtube_urls?: string[]
    video_titles?: string[]
  }
  moduleId: string
  isLocked: boolean
  isCompleted: boolean
  onComplete?: (projectId: string, moduleId: string) => Promise<void>
}

export function ProjectCard({ project, moduleId, isLocked, isCompleted, onComplete }: ProjectCardProps) {
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
      await onComplete(project.id, moduleId)
    } catch (error) {
      console.error('Failed to mark project complete:', error)
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
                {/* Completion Checkbox */}
                <button
                  onClick={handleMarkComplete}
                  disabled={isCompleted || isMarkingComplete}
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 cursor-default'
                      : isMarkingComplete
                      ? 'bg-orange-500/50 border-orange-500 cursor-wait'
                      : 'border-white/30 hover:border-green-400 hover:bg-green-400/20'
                  }`}
                  title={isCompleted ? 'Project completed' : 'Mark as complete'}
                >
                  {isCompleted && <CheckCircle className="w-6 h-6 text-white" />}
                  {isMarkingComplete && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
            {project.youtube_urls && project.youtube_urls.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white mb-3">
                  {project.youtube_urls.length === 1 ? 'Project Resource' : 'Project Resources'}
                </h4>
                <div className="space-y-2">
                  {project.youtube_urls.map((url, index) => {
                    // INDIVIDUAL PROJECT VIDEO TITLES - Map each video URL to its own custom title
                    const getIndividualProjectVideoTitle = (videoUrl: string, projectTitle: string, videoIndex: number) => {
                      // Map each individual project video URL to its custom title
                      const individualProjectVideoTitles: { [videoUrl: string]: string } = {
                        'https://youtube.com/watch?v=4cQWJViybAQ&t=70s': 'n8n Quick Start Tutorial',
                        'https://youtube.com/watch?v=l8NoMgd8lG4': 'The Best Way to Give AI Agents Tools in n8n',
                        'https://youtube.com/watch?v=R36bpNPPIMs': 'How to Build a Google Scraping AI Agent with n8n',
                        'https://youtube.com/watch?v=F1psr8uFwUU': 'Locally Host n8n AI Agents for Free',
                        'https://youtube.com/watch?v=DcEMf2K6cPQ': 'Local n8n AI Agents in 5 Minutes',
                        'https://youtube.com/watch?v=vUnG7hsPe5E': 'How to Build an AI Agent for Data Analysis, Visualization, and Reporting',
                        'https://youtube.com/watch?v=HNKlFTd1maM': 'How I Sold These 4 AI Agents for $23,000',
                        'https://youtube.com/watch?v=Ey18PDiaAYI&t=13s': 'Build & Sell n8n AI Agents',
                        // Every video gets its own unique title!
                      };
                      
                      // Return custom title if exists, otherwise fallback to default
                      if (individualProjectVideoTitles[videoUrl]) {
                        return individualProjectVideoTitles[videoUrl];
                      }
                      
                      // Fallback to default format if no custom title found
                      return project.youtube_urls && project.youtube_urls.length === 1 
                        ? `${projectTitle} - Video` 
                        : `${projectTitle} - Video ${videoIndex + 1}`;
                    };
                    
                    const videoTitle = getIndividualProjectVideoTitle(url, project.title, index);
                    
                    return (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-300 hover:text-blue-200 underline text-sm transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {videoTitle}
                      </a>
                    );
                  })}
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
