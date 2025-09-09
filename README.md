# Build Different - N8N Mastery Course

A comprehensive web application for learning N8N automation from beginner to expert level. This gamified learning platform integrates with Discord for community engagement and progress tracking.

## 🚀 Features

- **Discord Authentication**: Sign in with Discord to access the course
- **Gamified Learning**: Progress tracking, achievements, and visual progress indicators
- **6 Comprehensive Modules**: From fundamentals to production deployment
- **18 Interactive Lessons**: Step-by-step learning with video content
- **6 Hands-on Projects**: Practical application of learned skills
- **Discord Integration**: Progress notifications and automatic role assignments
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 📚 Course Structure

### Module 1: N8n Fundamentals
- Introduction to N8n
- N8n Interface Overview
- Basic Workflow Concepts
- **Project**: Your First Automation

### Module 2: Working with Triggers
- Manual vs Automatic Triggers
- Webhook Triggers
- Schedule and Polling Triggers
- **Project**: Multi-Trigger Workflow

### Module 3: Data Transformation
- Understanding Data Structure
- Using the Set Node
- Function and Code Nodes
- **Project**: Data Processing Pipeline

### Module 4: API Integration
- HTTP Request Node
- Authentication Methods
- Error Handling and Retries
- **Project**: Multi-Service Integration

### Module 5: Advanced Workflows
- Conditional Logic and Branching
- Loops and Iterations
- Sub-workflows and Modularity
- **Project**: Complex Business Process Automation

### Module 6: Production and Best Practices
- Deployment Strategies
- Monitoring and Logging
- Security and Best Practices
- **Project**: Production-Ready Automation System

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Discord OAuth
- **Database**: Supabase (PostgreSQL)
- **Discord Bot**: Discord.js
- **Deployment**: Vercel
- **UI Components**: Custom components with Lucide React icons

## 📋 Prerequisites

Before setting up the project, you'll need:

1. **Node.js** (v18 or higher)
2. **Discord Application** (for OAuth and bot)
3. **Supabase Project** (for database)
4. **Vercel Account** (for deployment)

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd bd-n8n-course
npm install
```

### 2. Discord Application Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "OAuth2" section:
   - Add redirect URI: `http://localhost:3000/api/auth/callback/discord`
   - For production: `https://your-domain.com/api/auth/callback/discord`
   - Copy Client ID and Client Secret
4. Go to "Bot" section:
   - Create a bot
   - Copy the bot token
   - Enable necessary intents: Server Members Intent, Message Content Intent

### 3. Discord Server Setup

1. Invite your bot to your Discord server with these permissions:
   - Manage Roles
   - Send Messages
   - Read Message History
   - Use Slash Commands
2. Create roles for course progression:
   - N8n Beginner
   - N8n Intermediate
   - N8n Advanced
   - N8n Expert
3. Create a notification channel for progress updates
4. Copy the Server ID and Channel ID

### 4. Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Go to Settings > API to get your URL and keys
3. Run the database schema:
   - Go to SQL Editor in Supabase
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the query to create all tables and initial data
4. Update the Discord role IDs in the `discord_roles` table with your actual Discord role IDs

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Discord Bot
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_GUILD_ID=your-discord-server-id
DISCORD_NOTIFICATION_CHANNEL_ID=your-notification-channel-id
```

### 6. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Use the output as your `NEXTAUTH_SECRET`.

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Update `NEXTAUTH_URL` to your production domain
5. Update Discord OAuth redirect URI to include your production domain
6. Deploy!

## 🔧 Configuration

### Adding Video Content

To add video URLs to lessons and projects:

1. Update the Supabase database:
```sql
UPDATE lessons SET video_url = 'https://youtube.com/watch?v=...' WHERE id = 'lesson-id';
UPDATE projects SET video_url = 'https://youtube.com/watch?v=...' WHERE id = 'project-id';
```

### Customizing Discord Notifications

Edit `src/lib/discord-bot.ts` to customize:
- Notification messages
- Embed colors and styling
- Role assignment logic
- Achievement notifications

### Adding New Modules/Lessons

1. Update `src/data/course-structure.ts`
2. Add corresponding database entries in Supabase
3. Create new page components if needed

## 📱 Usage

### For Students

1. **Sign In**: Use Discord to authenticate
2. **Start Learning**: Begin with Module 1
3. **Track Progress**: View your progress on the dashboard
4. **Complete Projects**: Apply your knowledge in hands-on projects
5. **Earn Roles**: Get promoted in Discord as you progress

### For Instructors

1. **Monitor Progress**: Check Discord notifications for student achievements
2. **Manage Content**: Update video URLs and content in Supabase
3. **Community Management**: Use Discord roles to organize students

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure Discord bot has proper permissions
4. Check Supabase database connection
5. Review the setup instructions

## 🎯 Roadmap

- [ ] Add video player integration
- [ ] Implement quiz system
- [ ] Add certificate generation
- [ ] Create mobile app
- [ ] Add multi-language support
- [ ] Implement peer review system

---

Built with ❤️ for the automation community