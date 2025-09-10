import { supabase } from './supabase'
import { Module, Lesson, Project, UserProgress } from '@/types'

export class CourseDataService {
  // Get all modules with their lessons and projects
  static async getAllModules(): Promise<(Module & { lessons: Lesson[], project: Project | null })[]> {
    try {
      // Fetch modules
      const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .order('order_index')

      if (modulesError) throw modulesError

      // Fetch all lessons (including projects which are lessons with order_index 4)
      const { data: allLessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index')

      if (lessonsError) throw lessonsError

      // Combine the data
      return modules.map(module => {
        const moduleLessons = allLessons.filter(lesson => lesson.module_id === module.id)
        
        // Find project lesson first (look for lessons with "project" in title or order_index >= 4)
        const projectLesson = moduleLessons.find(lesson => 
          lesson.order_index === 4 || 
          lesson.title.toLowerCase().includes('project') ||
          lesson.order_index === Math.max(...moduleLessons.map(l => l.order_index))
        )
        
        // Regular lessons are everything except the project
        const lessons = moduleLessons.filter(lesson => lesson.id !== projectLesson?.id)
        
        return {
          ...module,
          order: module.order_index,
          is_locked: false, // Field doesn't exist in database
          lessons: lessons.map(lesson => ({
            ...lesson,
            order: lesson.order_index,
            description: lesson.objective || '',
            video_url: lesson.youtube_urls && lesson.youtube_urls.length > 0 ? lesson.youtube_urls[0] : lesson.video_url,
            youtube_urls: lesson.youtube_urls || (lesson.video_url ? [lesson.video_url] : []),
            video_titles: lesson.video_titles,
            is_locked: false // Field doesn't exist in database
          })),
          project: projectLesson ? {
            ...projectLesson,
            description: projectLesson.objective || '',
            video_url: projectLesson.youtube_urls && projectLesson.youtube_urls.length > 0 ? projectLesson.youtube_urls[0] : projectLesson.video_url,
            youtube_urls: projectLesson.youtube_urls || (projectLesson.video_url ? [projectLesson.video_url] : []),
            video_titles: projectLesson.video_titles,
            requirements: [], // Field doesn't exist in database
            is_locked: false // Field doesn't exist in database
          } : null
        }
      })
    } catch (error) {
      console.error('Error fetching course data:', error)
      throw error
    }
  }

  // Get a specific module with its lessons and project
  static async getModule(moduleId: string): Promise<(Module & { lessons: Lesson[], project: Project | null }) | null> {
    try {
      // Fetch the specific module
      const { data: module, error: moduleError } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single()

      if (moduleError) throw moduleError
      if (!module) return null

      // Fetch lessons for this module (including projects which are lessons with order_index 4)
      const { data: allLessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index')

      if (lessonsError) throw lessonsError

      // Find project lesson first (look for lessons with "project" in title or order_index >= 4)
      const projectLesson = allLessons.find(lesson => 
        lesson.order_index === 4 || 
        lesson.title.toLowerCase().includes('project') ||
        lesson.order_index === Math.max(...allLessons.map(l => l.order_index))
      )
      
      // Regular lessons are everything except the project
      const lessons = allLessons.filter(lesson => lesson.id !== projectLesson?.id)

      return {
        ...module,
        order: module.order_index,
        is_locked: false, // Field doesn't exist in database
        lessons: lessons.map(lesson => ({
          ...lesson,
          order: lesson.order_index,
          description: lesson.objective || '',
          video_url: lesson.youtube_urls && lesson.youtube_urls.length > 0 ? lesson.youtube_urls[0] : lesson.video_url,
          youtube_urls: lesson.youtube_urls || (lesson.video_url ? [lesson.video_url] : []),
          video_titles: lesson.video_titles,
          is_locked: false // Field doesn't exist in database
        })),
        project: projectLesson ? {
          ...projectLesson,
          description: projectLesson.objective || '',
          video_url: projectLesson.youtube_urls && projectLesson.youtube_urls.length > 0 ? projectLesson.youtube_urls[0] : projectLesson.video_url,
          youtube_urls: projectLesson.youtube_urls || (projectLesson.video_url ? [projectLesson.video_url] : []),
          video_titles: projectLesson.video_titles,
          requirements: [], // Field doesn't exist in database
          is_locked: false // Field doesn't exist in database
        } : null
      }
    } catch (error) {
      console.error('Error fetching module:', error)
      throw error
    }
  }

  // Get user progress for all modules
  static async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user progress:', error)
      throw error
    }
  }

  // Mark a lesson as completed
  static async markLessonComplete(userId: string, lessonId: string, moduleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          module_id: moduleId,
          completed: true,
          completed_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Error marking lesson complete:', error)
      throw error
    }
  }

  // Mark a project as completed (projects are lessons with order_index 4)
  static async markProjectComplete(userId: string, projectId: string, moduleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          lesson_id: projectId, // Projects are stored as lessons
          module_id: moduleId,
          completed: true,
          completed_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Error marking project complete:', error)
      throw error
    }
  }

  // Get completion stats for a user
  static async getUserCompletionStats(userId: string): Promise<{
    totalModules: number
    completedModules: number
    totalLessons: number
    completedLessons: number
    totalProjects: number
    completedProjects: number
  }> {
    try {
      // Get all modules and lessons count
      const [modulesResult, lessonsResult, progressResult] = await Promise.all([
        supabase.from('modules').select('id', { count: 'exact' }),
        supabase.from('lessons').select('id, order_index', { count: 'exact' }),
        supabase.from('user_progress').select('*').eq('user_id', userId).eq('completed', true)
      ])

      const totalModules = modulesResult.count || 0
      const allLessons = lessonsResult.data || []
      const totalLessons = allLessons.filter(l => l.order_index < 4).length
      const totalProjects = allLessons.filter(l => l.order_index === 4).length

      const progress = progressResult.data || []
      
      // Get lesson IDs for completed items
      const completedLessonIds = progress.filter(p => p.lesson_id).map(p => p.lesson_id)
      
      // Count completed lessons vs projects based on their order_index
      let completedLessons = 0
      let completedProjects = 0
      
      for (const lessonId of completedLessonIds) {
        const lesson = allLessons.find(l => l.id === lessonId)
        if (lesson) {
          if (lesson.order_index < 4) {
            completedLessons++
          } else if (lesson.order_index === 4) {
            completedProjects++
          }
        }
      }

      // Calculate completed modules (all lessons + project in a module completed)
      const moduleProgress = await this.getModuleCompletionStatus(userId)
      const completedModules = moduleProgress.filter(m => m.isCompleted).length

      return {
        totalModules,
        completedModules,
        totalLessons,
        completedLessons,
        totalProjects,
        completedProjects
      }
    } catch (error) {
      console.error('Error fetching completion stats:', error)
      throw error
    }
  }

  // Get module completion status for a user
  static async getModuleCompletionStatus(userId: string): Promise<Array<{
    moduleId: string
    isCompleted: boolean
    lessonsCompleted: number
    totalLessons: number
    projectCompleted: boolean
  }>> {
    try {
      const modules = await this.getAllModules()
      const progress = await this.getUserProgress(userId)

      return modules.map(module => {
        const moduleProgress = progress.filter(p => p.module_id === module.id && p.completed)
        
        // Count completed lessons (excluding projects)
        const completedLessonIds = moduleProgress.filter(p => p.lesson_id).map(p => p.lesson_id)
        const lessonsCompleted = module.lessons.filter(lesson => 
          completedLessonIds.includes(lesson.id)
        ).length
        
        // Check if project is completed (project is a lesson with order_index 4)
        const projectCompleted = module.project ? 
          completedLessonIds.includes(module.project.id) : true
        
        const isCompleted = lessonsCompleted === module.lessons.length && projectCompleted

        return {
          moduleId: module.id,
          isCompleted,
          lessonsCompleted,
          totalLessons: module.lessons.length,
          projectCompleted
        }
      })
    } catch (error) {
      console.error('Error fetching module completion status:', error)
      throw error
    }
  }
}
