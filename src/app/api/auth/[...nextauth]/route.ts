import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { DatabaseService } from '@/lib/database'

export const authOptions = {
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
          // Check if user exists using database service
          const existingUser = await DatabaseService.getUserByDiscordId(profile.id)

          if (!existingUser) {
            // Create new user using database service
            await DatabaseService.createUser({
              discord_id: profile.id,
              discord_username: profile.username,
              discord_avatar: profile.avatar,
              email: profile.email,
            })
          }
          // Note: We don't update existing users on every login to avoid unnecessary DB calls
        } catch (error) {
          console.error('Database error:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub) {
        // Set the Discord ID as the user ID for the session
        session.user.id = token.sub
        
        try {
          // Get user data using database service
          const user = await DatabaseService.getUserByDiscordId(token.sub)

          if (user) {
            session.user.supabase_id = user.id
            session.user.discord_id = user.discord_id
          }
        } catch (error) {
          console.error('Error fetching user in session:', error)
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
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
