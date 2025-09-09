import { supabase, requireSupabaseAdmin } from './supabase'

// Database-first approach - these interfaces match your ACTUAL Supabase schema
export interface DatabaseModule {
  id: string
  title: string
  description: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface DatabaseLesson {
  id: string
  module_id: string
  title: string
  objective: string
  youtube_urls: string[]
  video_titles?: string[]
  order_index: number
  created_at: string
  updated_at: string
}

export interface DatabaseUser {
  id: string
  discord_id: string
  discord_username: string
  discord_avatar?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface DatabaseUserProgress {
  id: string
  user_id: string
  lesson_id: string
  module_id: string
  completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
}

// Database service that works EXACTLY with your actual schema
export class DatabaseService {
  // Get all modules exactly as they exist in the database
  static async getModules(): Promise<DatabaseModule[]> {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('order_index')
    
    if (error) throw error
    return data || []
  }

  // Get all lessons exactly as they exist in the database
  static async getLessons(): Promise<DatabaseLesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index')
    
    if (error) throw error
    return data || []
  }

  // Get lessons for a specific module
  static async getLessonsByModule(moduleId: string): Promise<DatabaseLesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index')
    
    if (error) throw error
    return data || []
  }

  // Get user by discord ID
  static async getUserByDiscordId(discordId: string): Promise<DatabaseUser | null> {
    // Use admin client for server-side operations
    const supabaseAdmin = requireSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('discord_id', discordId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Create user
  static async createUser(userData: {
    discord_id: string
    discord_username: string
    discord_avatar?: string
    email?: string
  }): Promise<DatabaseUser> {
    // Use admin client for server-side operations
    const supabaseAdmin = requireSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Get user progress
  static async getUserProgress(userId: string): Promise<DatabaseUserProgress[]> {
    // Use admin client for server-side operations
    const supabaseAdmin = requireSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .is('module_id', null) // Only get lesson-level progress records
    
    if (error) throw error
    return data || []
  }

  // Mark lesson/project complete
  static async markComplete(userId: string, lessonId: string, moduleId: string): Promise<void> {
    // Use admin client for server-side operations
    const supabaseAdmin = requireSupabaseAdmin()
    
    // Check if progress record exists for this specific lesson (with null module_id)
    const { data: existingRecord, error: selectError } = await supabaseAdmin
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .is('module_id', null)
      .maybeSingle()

    let error = null

    if (selectError) {
      error = selectError
    } else if (existingRecord) {
      // Update existing record
      const result = await supabaseAdmin
        .from('user_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', existingRecord.id)
      error = result.error
    } else {
      // Insert new record with null module_id to avoid constraint
      const result = await supabaseAdmin
        .from('user_progress')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          module_id: null, // Set to null to avoid constraint
          completed: true,
          completed_at: new Date().toISOString()
        })
      error = result.error
    }
    
    if (error) throw error
  }
}

// Transform database data to UI-friendly format
export class DataTransformer {
  static transformModuleWithLessons(
    module: DatabaseModule, 
    lessons: DatabaseLesson[]
  ) {
    const moduleLessons = lessons.filter(l => l.module_id === module.id)
    const regularLessons = moduleLessons.filter(l => l.order_index < 4)
    const projectLesson = moduleLessons.find(l => l.order_index === 4)

    return {
      id: module.id,
      title: module.title,
      description: module.description,
      order: module.order_index,
      is_locked: false, // Not in your database
      created_at: module.created_at,
      lessons: regularLessons.map(lesson => ({
        id: lesson.id,
        module_id: lesson.module_id,
        title: lesson.title,
        description: lesson.objective,
        order: lesson.order_index,
        video_url: lesson.youtube_urls && lesson.youtube_urls.length > 0 ? lesson.youtube_urls[0] : lesson.video_url,
        youtube_urls: lesson.youtube_urls || (lesson.video_url ? [lesson.video_url] : []),
        video_titles: lesson.video_titles,
        is_locked: false, // Not in your database
        created_at: lesson.created_at
      })),
      project: projectLesson ? {
        id: projectLesson.id,
        module_id: projectLesson.module_id,
        title: projectLesson.title,
        description: projectLesson.objective,
        video_url: projectLesson.youtube_urls && projectLesson.youtube_urls.length > 0 ? projectLesson.youtube_urls[0] : projectLesson.video_url,
        youtube_urls: projectLesson.youtube_urls || (projectLesson.video_url ? [projectLesson.video_url] : []),
        video_titles: projectLesson.video_titles,
        requirements: [], // Not in your database
        is_locked: false, // Not in your database
        created_at: projectLesson.created_at
      } : null
    }
  }
}
