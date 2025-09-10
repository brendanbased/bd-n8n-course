import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { requireSupabaseAdmin } from '@/lib/supabase'
import { DatabaseService } from '@/lib/database'
import { authOptions } from '../auth/[...nextauth]/route'

// Helper function to check if a module is completed
async function checkModuleCompletion(userId: string, moduleId: string, supabaseAdmin: ReturnType<typeof requireSupabaseAdmin>): Promise<boolean> {
  try {
    // Get all lessons in the module
    const { data: moduleLessons } = await supabaseAdmin
      .from('lessons')
      .select('id, order_index')
      .eq('module_id', moduleId)
      .order('order_index')

    if (!moduleLessons || moduleLessons.length === 0) return false

    // Get user's completed lessons for this module
    const { data: completedLessons } = await supabaseAdmin
      .from('user_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('completed', true)
      .in('lesson_id', moduleLessons.map(l => l.id))

    const completedLessonIds = completedLessons?.map(p => p.lesson_id) || []

    // Check if all lessons are completed
    const allLessonsCompleted = moduleLessons.every(lesson => 
      completedLessonIds.includes(lesson.id)
    )

    return allLessonsCompleted
  } catch (error) {
    console.error('Error checking module completion:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = requireSupabaseAdmin()
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, itemId, moduleId } = await request.json()
    console.log('Progress API called with:', { type, itemId, moduleId, userId: session.user.id })

    if (!type || !itemId || !moduleId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user from database
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('discord_id', session.user.id)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if already completed (anti-spam protection)
    const { data: existingProgress, error: checkError } = await supabaseAdmin
      .from('user_progress')
      .select('completed, completed_at')
      .eq('user_id', user.id)
      .eq('lesson_id', itemId)
      .is('module_id', null)
      .maybeSingle()

    // If already completed, return success but don't send notifications
    if (!checkError && existingProgress?.completed) {
      console.log('Lesson already completed, skipping notification')
      return NextResponse.json({ 
        success: true, 
        message: 'Already completed',
        alreadyCompleted: true 
      })
    }

    // Create progress entry with a unique approach to avoid constraint issues
    // Since the constraint is on user_id + module_id, we'll use lesson_id as a unique identifier
    const progressData = {
      user_id: user.id,
      module_id: moduleId,
      lesson_id: itemId,
      completed: true,
      completed_at: new Date().toISOString(),
    }
    
    console.log('Attempting to upsert progress data:', progressData)
    
    // Let's try a direct upsert with the lesson_id as the unique key
    // First, let's see if we can delete any conflicting records and insert fresh

    if (type !== 'lesson' && type !== 'project') {
      return NextResponse.json({ error: 'Invalid progress type' }, { status: 400 })
    }

    // Simple approach: use module_id as null to avoid the constraint
    // The constraint is on user_id + module_id, so we'll set module_id to null for individual lessons
    // and only use module_id for module-level completion tracking
    
    const modifiedProgressData = {
      user_id: user.id,
      module_id: null, // Set to null to avoid constraint
      lesson_id: itemId,
      completed: true,
      completed_at: new Date().toISOString(),
    }
    
    console.log('Using modified progress data to avoid constraint:', modifiedProgressData)
    
    // Check if record exists for this specific lesson (without module_id constraint)
    const { data: existingRecord } = await supabaseAdmin
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', itemId)
      .is('module_id', null)
      .maybeSingle()

    let progressError = null

    if (existingRecord) {
      // Update existing record
      console.log('Updating existing progress record:', existingRecord.id)
      const updateResult = await supabaseAdmin
        .from('user_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', existingRecord.id)
      
      console.log('Update result:', updateResult)
      progressError = updateResult.error
    } else {
      // Insert new record
      console.log('Inserting new progress record')
      const insertResult = await supabaseAdmin
        .from('user_progress')
        .insert(modifiedProgressData)
      
      console.log('Insert result:', insertResult)
      progressError = insertResult.error
    }

    if (progressError) {
      console.error('Progress update error:', progressError)
      return NextResponse.json({ 
        error: 'Failed to update progress', 
        details: progressError.message || progressError 
      }, { status: 500 })
    }

    // Verify the record was actually created/updated
    const { data: verificationRecord, error: verificationError } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', itemId)
      .is('module_id', null)
      .maybeSingle()

    console.log('Verification - record in database:', verificationRecord)
    console.log('Verification error:', verificationError)

    if (verificationError) {
      console.error('Database verification query failed:', verificationError)
      return NextResponse.json({ 
        error: 'Failed to verify progress update', 
        details: `Verification query failed: ${verificationError.message}`
      }, { status: 500 })
    }

    if (!verificationRecord || !verificationRecord.completed) {
      console.error('Database verification failed - record not found or not completed')
      
      // Let's try to see what records exist for this user
      const { data: allUserRecords } = await supabaseAdmin
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
      
      console.log('All records for user:', allUserRecords)
      
      return NextResponse.json({ 
        error: 'Failed to verify progress update', 
        details: 'Record was not properly saved to database'
      }, { status: 500 })
    }

    // Get item details for notification
    let itemTitle = ''

    // Both lessons and projects are in the lessons table
    const { data: lesson } = await supabaseAdmin
      .from('lessons')
      .select('title, modules(title)')
      .eq('id', itemId)
      .single()
    
    itemTitle = lesson?.title || `Unknown ${type}`

    // Check if module is now completed and send Discord notifications
    try {
      const { discordBot } = await import('@/lib/discord-bot')
      
      // Check if this completion resulted in a completed module
      const moduleCompleted = await checkModuleCompletion(user.id, moduleId, supabaseAdmin)
      
      if (moduleCompleted) {
        // Get module details for notification
        const { data: moduleData } = await supabaseAdmin
          .from('modules')
          .select('title, order_index')
          .eq('id', moduleId)
          .single()
        
        if (moduleData) {
          // Send module completion notification
          await discordBot.sendModuleCompletionNotification(user.id, moduleData.title, moduleData.order_index)
          
          // Check for role promotion based on module number
          await discordBot.checkAndAssignRoles(user.id, moduleData.order_index)
        }
      }
    } catch (error) {
      console.error('Discord bot error:', error)
      // Continue without Discord functionality if it fails
    }

    // Create achievement record (only if user_achievements table exists)
    try {
      await supabaseAdmin
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_type: `${type}_complete`,
          achievement_data: {
            item_id: itemId,
            module_id: moduleId,
            title: itemTitle,
          },
        })
    } catch (achievementError) {
      // Ignore if table doesn't exist - it's optional
      console.log('Achievement table not available:', achievementError)
    }

    return NextResponse.json({ success: true, newCompletion: true })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database using database service
    let user = await DatabaseService.getUserByDiscordId(session.user.id)

    // If user doesn't exist, create them
    if (!user) {
      try {
        user = await DatabaseService.createUser({
          discord_id: session.user.id,
          discord_username: session.user.name || 'Unknown User',
          discord_avatar: session.user.image || undefined,
          email: session.user.email || undefined,
        })
      } catch (createError) {
        console.error('Failed to create user:', createError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }
    }

    // Get user progress using database service
    const progress = await DatabaseService.getUserProgress(user.id)

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Developer reset tool - DELETE endpoint
export async function DELETE(request: NextRequest) {
  try {
    const supabaseAdmin = requireSupabaseAdmin()
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the reset key from query params for security
    const url = new URL(request.url)
    const resetKey = url.searchParams.get('resetKey')
    
    // Simple security check - you can make this more sophisticated
    if (resetKey !== 'dev-reset-2024') {
      return NextResponse.json({ error: 'Invalid reset key' }, { status: 403 })
    }

    // Get user from database
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('discord_id', session.user.id)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete all user progress
    const { error: deleteError } = await supabaseAdmin
      .from('user_progress')
      .delete()
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Reset error:', deleteError)
      return NextResponse.json({ error: 'Failed to reset progress' }, { status: 500 })
    }

    // Also delete achievements if table exists
    try {
      await supabaseAdmin
        .from('user_achievements')
        .delete()
        .eq('user_id', user.id)
    } catch (achievementError) {
      // Ignore if table doesn't exist
      console.log('Achievement table not available for reset:', achievementError)
    }

    return NextResponse.json({ success: true, message: 'Progress reset successfully' })
  } catch (error) {
    console.error('Reset API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
