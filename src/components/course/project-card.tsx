'use client'

import { Code, CheckCircle, Lock, Target, List } from 'lucide-react'
import Link from 'next/link'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    requirements: string[]
  }
  moduleId: string
  isLocked: boolean
  isCompleted: boolean
}

export function ProjectCard({ project, moduleId, isLocked, isCompleted }: ProjectCardProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 transition-all duration-300 ${
      isLocked ? 'opacity-60' : 'hover:bg-white/15'
    }`}>
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
      </div>

      {/* Requirements */}
      <div className="mb-6">
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

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <List className="w-3 h-3" />
            <span>{project.requirements.length} Requirements</span>
          </div>
        </div>
        
        {isLocked ? (
          <div className="px-6 py-3 bg-gray-600 text-gray-300 rounded-lg text-sm">
            Locked
          </div>
        ) : (
          <Link
            href={`/module/${moduleId}/project/${project.id}`}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
          >
            {isCompleted ? 'Review Project' : 'Start Project'}
          </Link>
        )}
      </div>
    </div>
  )
}
