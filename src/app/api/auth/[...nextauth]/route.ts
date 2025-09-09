import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { supabaseAdmin } from '@/lib/supabase'

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        try {
          // Check if user exists in Supabase
          const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('discord_id', profile.id)
            .single()

          if (!existingUser) {
            // Create new user in Supabase
            const { error } = await supabaseAdmin
              .from('users')
              .insert({
                discord_id: profile.id,
                username: profile.username,
                avatar: profile.avatar,
                email: profile.email,
              })

            if (error) {
              console.error('Error creating user:', error)
              return false
            }
          } else {
            // Update existing user
            const { error } = await supabaseAdmin
              .from('users')
              .update({
                username: profile.username,
                avatar: profile.avatar,
                email: profile.email,
                updated_at: new Date().toISOString(),
              })
              .eq('discord_id', profile.id)

            if (error) {
              console.error('Error updating user:', error)
            }
          }
        } catch (error) {
          console.error('Database error:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub) {
        // Get user data from Supabase
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('discord_id', token.sub)
          .single()

        if (user) {
          session.user.id = user.id
          session.user.discord_id = user.discord_id
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.sub = profile.id
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})

export { handler as GET, handler as POST }
