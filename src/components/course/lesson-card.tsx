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
    video_titles?: string[]
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
                  {lesson.youtube_urls.map((url, index) => {
                    // INDIVIDUAL VIDEO TITLES - Map each video URL to its own custom title
                    const getIndividualVideoTitle = (videoUrl: string, lessonTitle: string, videoIndex: number) => {
                      // Map each individual video URL to its custom title
                      const individualVideoTitles: { [videoUrl: string]: string } = {
                        'https://youtube.com/watch?v=otUBuV1foLY': 'Build your first NO CODE AI Agent in n8n',
                        'https://youtube.com/watch?v=lK3veuZAg0c': 'Step-by-Step: N8N Webhooks',
                        'https://youtube.com/watch?v=3FfCRbq3XMs': 'n8n Webhook Security',
                        'https://youtube.com/watch?v=tNHVxZ2qvII': 'Master n8n JSON & Data Transformation',
                        'https://youtube.com/watch?v=SAUxo5fcLMs': 'Image Generation API with n8n',
                        'https://youtube.com/watch?v=8haVekgx_lk': 'Connect n8n to Any LLM',
                        'https://youtube.com/watch?v=4o0AJYBEiBo': 'Only 1% of n8n Builders Know This Node Exists',
                        'https://youtube.com/watch?v=wq001sxDTWw': 'Context Engineering Hacks for Smarter No-Code AI Agents',
                        'https://youtube.com/watch?v=5TuHtDTAe0U': 'n8n Authentication Mastery',
                        'https://youtube.com/watch?v=PYkjffkLLZ8': 'How to Scrape Websites Without Paid APIs Using n8n',
                        'https://youtube.com/watch?v=PxQwzoPmP3M': 'Web Scrape Anything Automatically (n8n + Apify)',
                        'https://youtube.com/watch?v=Ee9WtEEd300': 'Turn Any Website Into LLM Ready Data in Seconds with n8n & Firecrawl',
                        'https://youtube.com/watch?v=wtvKL5Y2Nhg': 'How to Set Up Supabase & Postgres for RAG Agents with Memory in n8n',
                        'https://youtube.com/watch?v=R5YHd_C24r4': 'How To Connect MongoDB With n8n',
                        'https://youtube.com/watch?v=F1psr8uFwUU': 'Locally Host n8n AI Agents for FREE',
                        'https://youtube.com/watch?v=bTF3tACqPRU': 'One n8n Workflow for Unlimited Error Handling',
                        'https://youtube.com/watch?v=ndPszMUEBfo': 'A Beginner\'s Guide to Error Handling',
                        'https://youtube.com/watch?v=IKF7Tv9ZD5A': 'Master n8n Queue Mode',
                        'https://youtube.com/watch?v=s8WPy819Hm0': 'Scaling N8N: Setting up a Robust Queue System',
                        'https://youtube.com/watch?v=JjBofKJnYIU': 'How to Set up Supabase and Postgres for RAG Agent with Memory in n8n',
                        'https://youtube.com/watch?v=JrGwVwBEIOI': 'Build Your Own Private GPT-OSS AI Agent',
                        'https://youtube.com/watch?v=vUnG7hsPe5E': 'How to Build an AI Agent for Data Analysis, Visualization, and Reporting',
                        'https://youtube.com/watch?v=9FuNtfsnRNo': 'I Built the Ultimate Team of AI Agents in n8n With No Code',
                        'https://youtube.com/watch?v=d7hNUFrbJxo': 'How to Version Control your n8n Workflows',
                        'https://youtube.com/watch?v=aUr9RBXr5Wo': 'Package Your n8n Workflows Into Full Web Apps',
                        'https://youtube.com/watch?v=EXwNnb6ac7k': 'Turn n8n Workflows Into Full Web Apps',
                        'https://youtube.com/watch?v=kUpTUEwKnrk': 'Build Anything with Lovable + n8n AI Agents',
                        'https://youtube.com/watch?v=A7rmXS-3Wc0': 'My Step-by-Step Automation Agency Delivery Process',
                        'https://youtube.com/watch?v=I7m1bhROmnk': 'How to Price N8N AI Agents & Workflows',
                        'https://youtube.com/watch?v=MzigW7h_p18': 'How to Create a Subscription in Stripe',
                        // Every video gets its own unique title!
                      };
                      
                      // Return custom title if exists, otherwise fallback to default
                      if (individualVideoTitles[videoUrl]) {
                        return individualVideoTitles[videoUrl];
                      }
                      
                      // Fallback to default format if no custom title found
                      return lesson.youtube_urls && lesson.youtube_urls.length === 1 
                        ? `${lessonTitle} - Video` 
                        : `${lessonTitle} - Video ${videoIndex + 1}`;
                    };
                    
                    const videoTitle = getIndividualVideoTitle(url, lesson.title, index);
                    
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
                No video available for this lesson yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
