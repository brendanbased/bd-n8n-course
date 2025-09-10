/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { DatabaseService } from '@/lib/database'
import type { Account, Profile } from 'next-auth'

interface DiscordProfile extends Profile {
  id: string
  username: string
  avatar: string
  email?: string
}

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }: { user: unknown; account: Account | null; profile?: Profile }) {
      if (account?.provider === 'discord' && profile) {
        try {
          // Check if user exists using database service
          const discordProfile = profile as DiscordProfile
          const existingUser = await DatabaseService.getUserByDiscordId(discordProfile.id)

          if (!existingUser) {
            // Create new user using database service
            await DatabaseService.createUser({
              discord_id: discordProfile.id,
              discord_username: discordProfile.username,
              discord_avatar: discordProfile.avatar,
              email: discordProfile.email,
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
    async session({ session, token }: { session: any; token: any }) {
      if (token.sub) {
        // Set the Discord ID as the user ID for the session
        session.user.id = token.sub
        
        try {
          // Get user data using database service
          const userData = await DatabaseService.getUserByDiscordId(token.sub)

          if (userData) {
            session.user.supabase_id = userData.id
            session.user.discord_id = userData.discord_id
          }
        } catch (error) {
          console.error('Error fetching user in session:', error)
        }
      }
      return session
    },
    async jwt({ token, account, profile }: { token: any; account: Account | null; profile?: Profile }) {
      if (account && profile) {
        token.sub = (profile as DiscordProfile).id
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
