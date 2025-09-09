# Discord Role Setup Guide

## Overview

The Discord bot has been updated to send notifications only when entire modules are completed and to promote users to specific roles based on module completion milestones.

## Changes Made

### 🔄 Notification System Changes
- **Removed**: Individual lesson completion notifications
- **Added**: Module completion notifications (only when all lessons + project in a module are completed)
- **Added**: Role promotion notifications when users earn new roles

### 🏆 Role Promotion System
Users will be promoted through the following roles based on module completion:

1. **Initiate** → **Builder**: Complete Module 1
2. **Builder** → **Operator**: Complete Module 3  
3. **Operator** → **Architect**: Complete Module 6

## Required Environment Variables

You'll need to add the following new environment variables to your `.env.local` file:

```env
# Discord Role IDs (you need to provide these)
DISCORD_BUILDER_ROLE_ID=your_builder_role_id_here
DISCORD_OPERATOR_ROLE_ID=your_operator_role_id_here
DISCORD_ARCHITECT_ROLE_ID=your_architect_role_id_here

# Existing variables (keep these)
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_GUILD_ID=your_discord_server_id
DISCORD_NOTIFICATION_CHANNEL_ID=your_notification_channel_id
```

## How to Get Discord Role IDs

1. **Enable Developer Mode** in Discord:
   - Go to User Settings → Advanced → Enable Developer Mode

2. **Get Role IDs**:
   - Go to your Discord server
   - Right-click on the role name in the member list or server settings
   - Click "Copy ID"
   - Paste the ID into your environment variables

## Role Setup in Discord

Make sure you have created the following roles in your Discord server:
- **Builder** (for Module 1 completion)
- **Operator** (for Module 3 completion) 
- **Architect** (for Module 6 completion)

## Notification Format

### Module Completion Notification
```
🎯 Module Completed!
@username just completed Module 1: Introduction to N8n!

Achievement: 🎯 Module 1 Completed
Module: Introduction to N8n
```

### Role Promotion Notification
```
🏆 Role Promotion!
@username has been promoted to Builder!

Module Completed: Module 1
New Role: Builder
```

## Testing

To test the new system:
1. Complete all lessons and the project in Module 1
2. You should see both a module completion notification AND a role promotion notification
3. The user should receive the Builder role and lose any previous course roles

## Notes

- The system automatically removes previous course roles when promoting to a new one
- Only modules 1, 3, and 6 trigger role promotions
- Module completion is detected when ALL lessons AND the project in a module are completed
- The notification style matches your existing format preferences
