'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Youtube } from 'lucide-react'

interface ResourceCardProps {
  title: string
  description: string
  videoUrl: string
}

export function ResourceCard({ title, description, videoUrl }: ResourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Get custom video title for resource cards
  const getCustomResourceVideoTitle = (videoUrl: string, cardTitle: string) => {
    // Map each individual resource video URL to its custom title
    const individualResourceVideoTitles: { [videoUrl: string]: string } = {
      // RESOURCE VIDEO TITLES - Add your custom titles here
      'https://www.youtube.com/watch?v=AURnISajubk': 'Master n8n in 2 Hours',
      'https://www.youtube.com/watch?v=2GZ2SNXWK-c': 'n8n Full Course 8 Hours',
      'https://www.youtube.com/watch?v=TLpGkllBpl4': 'Build Your Own AI SaaS with ZERO Coding',
      
      // ADD MORE RESOURCE VIDEO URLS AND TITLES HERE...
      // Just copy each YouTube URL and give it a custom name
    };
    
    // Return custom title if exists, otherwise fallback to default
    if (individualResourceVideoTitles[videoUrl]) {
      return individualResourceVideoTitles[videoUrl];
    }
    
    // Fallback to default format if no custom title found
    return `${cardTitle} - Resource Video`;
  }

  return (
    <div className="bg-slate-900/30 backdrop-blur-xl rounded-xl border border-purple-500/20 transition-all duration-300 relative overflow-hidden group hover:bg-slate-800/40 hover:border-purple-400/30">
      {/* Card ambient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 rounded-xl"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
      
      {/* Header Section */}
      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-lg bg-purple-500 shadow-purple-500/25">
              {/* Icon container inner effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-lg"></div>
              <Youtube className="w-6 h-6 text-white relative z-10" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-purple-50 to-violet-100 bg-clip-text text-transparent leading-tight mb-1">
                {title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-4 p-2 rounded-lg hover:bg-purple-500/20 transition-colors duration-200 flex-shrink-0"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-purple-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-300" />
            )}
          </button>
        </div>

        {/* Expandable Content */}
        <div className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-16 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-4 border-t border-purple-500/20">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-purple-300 hover:text-purple-200 underline text-sm transition-colors duration-200 hover:bg-purple-500/10 p-2 rounded-lg"
            >
              {getCustomResourceVideoTitle(videoUrl, title)}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
