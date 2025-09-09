import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { requireSupabaseAdmin } from '@/lib/supabase'
import { DatabaseService } from '@/lib/database'
import { discordBot } from '@/lib/discord-bot'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = requireSupabaseAdmin()
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, itemId, moduleId } = await request.json()

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

    // Create progress entry
    const progressData: any = {
      user_id: user.id,
      module_id: moduleId,
      completed: true,
      completed_at: new Date().toISOString(),
    }

    if (type === 'lesson' || type === 'project') {
      // Both lessons and projects are stored in the lessons table, so use lesson_id
      progressData.lesson_id = itemId
    } else {
      return NextResponse.json({ error: 'Invalid progress type' }, { status: 400 })
    }

    // Insert or update progress
    const { error: progressError } = await supabaseAdmin
      .from('user_progress')
      .upsert(progressData, {
        onConflict: 'user_id,lesson_id'
      })

    if (progressError) {
      console.error('Progress update error:', progressError)
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
    }

    // Get item details for notification
    let itemTitle = ''
    let moduleTitle = ''

    // Both lessons and projects are in the lessons table
    const { data: lesson } = await supabaseAdmin
      .from('lessons')
      .select('title, modules(title)')
      .eq('id', itemId)
      .single()
    
    itemTitle = lesson?.title || `Unknown ${type}`
    moduleTitle = lesson?.modules?.title || 'Unknown Module'

    // Send Discord notification
    await discordBot.sendProgressNotification(user.id, type, itemTitle, moduleTitle)

    // Check for role assignments if it's a project completion (module completion)
    if (type === 'project') {
      await discordBot.checkAndAssignRoles(user.id)
    }

    // Create achievement record
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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
