import { Client, GatewayIntentBits, TextChannel, EmbedBuilder } from 'discord.js'
import { supabaseAdmin } from './supabase'

class DiscordBot {
  private client: Client
  private isReady: boolean = false

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
      ],
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.client.once('ready', () => {
      console.log(`Discord bot logged in as ${this.client.user?.tag}!`)
      this.isReady = true
    })

    this.client.on('error', (error) => {
      console.error('Discord bot error:', error)
    })
  }

  async initialize() {
    if (!process.env.DISCORD_BOT_TOKEN) {
      console.warn('Discord bot token not provided. Bot functionality will be disabled.')
      return
    }

    try {
      await this.client.login(process.env.DISCORD_BOT_TOKEN)
    } catch (error) {
      console.error('Failed to initialize Discord bot:', error)
    }
  }

  async sendProgressNotification(userId: string, type: 'lesson' | 'project' | 'module', itemTitle: string, moduleTitle: string) {
    if (!this.isReady || !process.env.DISCORD_NOTIFICATION_CHANNEL_ID) {
      console.warn('Discord bot not ready or notification channel not configured')
      return
    }

    try {
      // Get user data from Supabase
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('discord_username, discord_id')
        .eq('id', userId)
        .single()

      if (!user) {
        console.error('User not found for progress notification')
        return
      }

      const channel = this.client.channels.cache.get(process.env.DISCORD_NOTIFICATION_CHANNEL_ID) as TextChannel
      if (!channel) {
        console.error('Notification channel not found')
        return
      }

      const embed = new EmbedBuilder()
        .setColor(this.getColorForType(type))
        .setTitle('🎉 Progress Update!')
        .setDescription(`<@${user.discord_id}> just completed **${itemTitle}** in ${moduleTitle}!`)
        .addFields([
          {
            name: 'Achievement',
            value: `${this.getEmojiForType(type)} ${type.charAt(0).toUpperCase() + type.slice(1)} Completed`,
            inline: true,
          },
          {
            name: 'Module',
            value: moduleTitle,
            inline: true,
          },
        ])
        .setTimestamp()
        .setFooter({ text: 'N8n Mastery Course' })

      await channel.send({ embeds: [embed] })
    } catch (error) {
      console.error('Failed to send progress notification:', error)
    }
  }

  async checkAndAssignRoles(userId: string) {
    if (!this.isReady || !process.env.DISCORD_GUILD_ID) {
      console.warn('Discord bot not ready or guild ID not configured')
      return
    }

    try {
      // Get user data and progress
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('discord_id')
        .eq('id', userId)
        .single()

      if (!user) return

      // Get completed projects (lessons with order_index 4) to determine module completion
      const { data: completedProjects } = await supabaseAdmin
        .from('user_progress')
        .select('module_id, lessons!inner(order_index)')
        .eq('user_id', userId)
        .eq('completed', true)
        .eq('lessons.order_index', 4) // Only count module completion when project is done

      const completedModulesCount = completedProjects?.length || 0

      // Get available roles
      const { data: roles } = await supabaseAdmin
        .from('discord_roles')
        .select('*')
        .lte('module_completion_required', completedModulesCount)
        .order('module_completion_required', { ascending: false })

      if (!roles || roles.length === 0) return

      const guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID)
      if (!guild) return

      const member = await guild.members.fetch(user.discord_id)
      if (!member) return

      // Assign the highest role they qualify for
      const highestRole = roles[0]
      const discordRole = guild.roles.cache.get(highestRole.discord_role_id)
      
      if (discordRole && !member.roles.cache.has(discordRole.id)) {
        await member.roles.add(discordRole)
        console.log(`Assigned role ${highestRole.name} to user ${user.discord_id}`)
        
        // Send role assignment notification
        await this.sendRoleNotification(user.discord_id, highestRole.name, completedModulesCount)
      }
    } catch (error) {
      console.error('Failed to check and assign roles:', error)
    }
  }

  private async sendRoleNotification(discordId: string, roleName: string, modulesCompleted: number) {
    if (!process.env.DISCORD_NOTIFICATION_CHANNEL_ID) return

    try {
      const channel = this.client.channels.cache.get(process.env.DISCORD_NOTIFICATION_CHANNEL_ID) as TextChannel
      if (!channel) return

      const embed = new EmbedBuilder()
        .setColor('#FFD700') // Gold color for role assignments
        .setTitle('🏆 Role Promotion!')
        .setDescription(`<@${discordId}> has been promoted to **${roleName}**!`)
        .addFields([
          {
            name: 'Modules Completed',
            value: `${modulesCompleted}/6`,
            inline: true,
          },
          {
            name: 'New Role',
            value: roleName,
            inline: true,
          },
        ])
        .setTimestamp()
        .setFooter({ text: 'N8n Mastery Course' })

      await channel.send({ embeds: [embed] })
    } catch (error) {
      console.error('Failed to send role notification:', error)
    }
  }

  private getColorForType(type: 'lesson' | 'project' | 'module'): number {
    switch (type) {
      case 'lesson':
        return 0x3B82F6 // Blue
      case 'project':
        return 0xF59E0B // Orange
      case 'module':
        return 0x10B981 // Green
      default:
        return 0x8B5CF6 // Purple
    }
  }

  private getEmojiForType(type: 'lesson' | 'project' | 'module'): string {
    switch (type) {
      case 'lesson':
        return '📚'
      case 'project':
        return '🚀'
      case 'module':
        return '🎯'
      default:
        return '✅'
    }
  }

  async destroy() {
    if (this.client) {
      await this.client.destroy()
    }
  }
}

// Create singleton instance
export const discordBot = new DiscordBot()

// Initialize bot when module is imported
if (typeof window === 'undefined') {
  // Only initialize on server side
  discordBot.initialize().catch(console.error)
}
