export interface User {
  id: string
  discord_id: string
  discord_username: string
  discord_avatar?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  title: string
  description: string
  order: number
  is_locked: boolean
  created_at: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  description: string
  content?: string
  video_url?: string
  order: number
  is_locked: boolean
  created_at: string
}

export interface Project {
  id: string
  module_id: string
  title: string
  description: string
  requirements: string[]
  video_url?: string
  is_locked: boolean
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  module_id?: string
  lesson_id?: string
  completed: boolean
  completed_at?: string
  created_at: string
}

export interface DiscordRole {
  id: string
  name: string
  module_completion_required: number
  discord_role_id: string
}
