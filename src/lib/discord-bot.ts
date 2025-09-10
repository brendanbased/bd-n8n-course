import { Client, GatewayIntentBits, TextChannel, EmbedBuilder } from 'discord.js'
import { requireSupabaseAdmin } from './supabase'

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

  async sendModuleCompletionNotification(userId: string, moduleTitle: string, moduleNumber: number) {
    if (!this.isReady || !process.env.DISCORD_NOTIFICATION_CHANNEL_ID) {
      console.warn('Discord bot not ready or notification channel not configured')
      return
    }

    try {
      // Get user data from Supabase
      const supabaseAdmin = requireSupabaseAdmin()
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('discord_username, discord_id')
        .eq('id', userId)
        .single()

      if (!user) {
        console.error('User not found for module completion notification')
        return
      }

      const channel = this.client.channels.cache.get(process.env.DISCORD_NOTIFICATION_CHANNEL_ID) as TextChannel
      if (!channel) {
        console.error('Notification channel not found')
        return
      }

      const embed = new EmbedBuilder()
        .setColor(0x10B981) // Green color for module completion
        .setTitle('🎯 Module Completed!')
        .setDescription(`<@${user.discord_id}> just completed **${moduleTitle}**!`)
        .addFields([
          {
            name: 'Achievement',
            value: `🎯 Module ${moduleNumber} Completed`,
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
      console.error('Failed to send module completion notification:', error)
    }
  }

  async checkAndAssignRoles(userId: string, completedModuleNumber: number) {
    if (!this.isReady || !process.env.DISCORD_GUILD_ID) {
      console.warn('Discord bot not ready or guild ID not configured')
      return
    }

    try {
      // Get user data
      const supabaseAdmin = requireSupabaseAdmin()
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('discord_id')
        .eq('id', userId)
        .single()

      if (!user) return

      // Define role mappings based on module completion
      const roleMapping = {
        1: { name: 'Builder', roleId: process.env.DISCORD_BUILDER_ROLE_ID },
        3: { name: 'Operator', roleId: process.env.DISCORD_OPERATOR_ROLE_ID },
        6: { name: 'Architect', roleId: process.env.DISCORD_ARCHITECT_ROLE_ID }
      }

      // Check if this module completion triggers a role promotion
      const rolePromotion = roleMapping[completedModuleNumber as keyof typeof roleMapping]
      if (!rolePromotion || !rolePromotion.roleId) {
        console.log(`No role promotion for module ${completedModuleNumber}`)
        return
      }

      const guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID)
      if (!guild) return

      const member = await guild.members.fetch(user.discord_id)
      if (!member) return

      const discordRole = guild.roles.cache.get(rolePromotion.roleId)
      
      if (discordRole && !member.roles.cache.has(discordRole.id)) {
        // Remove previous course roles before adding new one
        const allCourseRoleIds = Object.values(roleMapping).map(r => r.roleId).filter(Boolean)
        const currentCourseRoles = member.roles.cache.filter(role => allCourseRoleIds.includes(role.id))
        
        if (currentCourseRoles.size > 0) {
          await member.roles.remove(currentCourseRoles)
        }

        // Add the new role
        await member.roles.add(discordRole)
        console.log(`Assigned role ${rolePromotion.name} to user ${user.discord_id}`)
        
        // Send role assignment notification
        await this.sendRoleNotification(user.discord_id, rolePromotion.name, completedModuleNumber)
      }
    } catch (error) {
      console.error('Failed to check and assign roles:', error)
    }
  }

  private async sendRoleNotification(discordId: string, roleName: string, completedModuleNumber: number) {
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
            name: 'Module Completed',
            value: `Module ${completedModuleNumber}`,
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
