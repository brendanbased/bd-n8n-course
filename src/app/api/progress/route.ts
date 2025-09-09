import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { discordBot } from '@/lib/discord-bot'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
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

    if (type === 'lesson') {
      progressData.lesson_id = itemId
    } else if (type === 'project') {
      progressData.project_id = itemId
    } else {
      return NextResponse.json({ error: 'Invalid progress type' }, { status: 400 })
    }

    // Insert or update progress
    const { error: progressError } = await supabaseAdmin
      .from('user_progress')
      .upsert(progressData, {
        onConflict: type === 'lesson' ? 'user_id,lesson_id' : 'user_id,project_id'
      })

    if (progressError) {
      console.error('Progress update error:', progressError)
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
    }

    // Get item details for notification
    let itemTitle = ''
    let moduleTitle = ''

    if (type === 'lesson') {
      const { data: lesson } = await supabaseAdmin
        .from('lessons')
        .select('title, modules(title)')
        .eq('id', itemId)
        .single()
      
      itemTitle = lesson?.title || 'Unknown Lesson'
      moduleTitle = lesson?.modules?.title || 'Unknown Module'
    } else {
      const { data: project } = await supabaseAdmin
        .from('projects')
        .select('title, modules(title)')
        .eq('id', itemId)
        .single()
      
      itemTitle = project?.title || 'Unknown Project'
      moduleTitle = project?.modules?.title || 'Unknown Module'
    }

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
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // Get user progress
    const { data: progress, error } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)

    if (error) {
      console.error('Progress fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    return NextResponse.json({ progress: progress || [] })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
