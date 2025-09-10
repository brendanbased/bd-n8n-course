import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { requireSupabaseAdmin } from '@/lib/supabase'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const supabaseAdmin = requireSupabaseAdmin()
    
    const session = await getServerSession(authOptions)
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

    // Get all progress records for this user
    const { data: allProgress, error } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Debug query error:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    console.log('All progress records for user:', user.id, allProgress)

    return NextResponse.json({ 
      userId: user.id,
      progressRecords: allProgress || [],
      totalRecords: allProgress?.length || 0
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
