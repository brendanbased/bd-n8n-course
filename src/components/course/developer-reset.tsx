'use client'

import { useState } from 'react'
import { RotateCcw, AlertTriangle } from 'lucide-react'

interface DeveloperResetProps {
  onReset?: () => void
}

export function DeveloperReset({ onReset }: DeveloperResetProps) {
  const [isResetting, setIsResetting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [resetKey, setResetKey] = useState('')

  const handleReset = async () => {
    if (!resetKey) {
      alert('Please enter the reset key')
      return
    }

    setIsResetting(true)
    try {
      const response = await fetch(`/api/progress?resetKey=${encodeURIComponent(resetKey)}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Progress reset successfully!')
        setShowConfirm(false)
        setResetKey('')
        onReset?.()
      } else {
        const error = await response.json()
        alert(`Failed to reset progress: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Reset error:', error)
      alert('Failed to reset progress. Check console for details.')
    } finally {
      setIsResetting(false)
    }
  }

  // Only show in development or with special flag
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SHOW_DEV_TOOLS) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          title="Developer Tool: Reset Progress"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Dev Reset</span>
        </button>
      ) : (
        <div className="bg-gray-900/95 backdrop-blur-lg border border-red-500/50 rounded-xl p-4 max-w-sm">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-red-300 font-semibold">Reset Progress</h3>
          </div>
          
          <p className="text-gray-300 text-sm mb-3">
            This will delete ALL your progress. This action cannot be undone.
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Reset Key:</label>
              <input
                type="password"
                value={resetKey}
                onChange={(e) => setResetKey(e.target.value)}
                placeholder="Enter reset key"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setResetKey('')
                }}
                className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={isResetting || !resetKey}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white rounded-lg text-sm transition-colors disabled:cursor-not-allowed"
              >
                {isResetting ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
