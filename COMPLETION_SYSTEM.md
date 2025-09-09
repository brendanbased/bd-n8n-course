# Lesson Completion System

This document explains the new lesson and project completion system implemented in the N8n Course application.

## Features

### ✅ One-Way Completion System
- **Lessons and projects can only be marked as complete, never unchecked**
- Once marked complete, the status is permanent (prevents Discord spam)
- Anti-spam protection prevents duplicate notifications

### 🔔 Discord Integration
- **Automatic notifications** sent to Discord when lessons/projects are completed
- **Role assignments** when modules are completed (all lessons + project done)
- **Rich embeds** with user mentions and achievement details

### 📊 Real-Time Progress Tracking
- **Progress bars** update immediately when items are completed
- **Module completion** calculated dynamically (all lessons + project)
- **Dashboard overview** shows overall progress, modules, lessons, and projects completed
- **Module cards** show individual progress percentages

### 🛠️ Developer Reset Tool
- **Secure reset functionality** for testing purposes
- **Password protected** with reset key: `dev-reset-2024`
- **Complete progress wipe** for the current user
- **Only visible in development** or with `NEXT_PUBLIC_SHOW_DEV_TOOLS=true`

## How to Use

### For Students

1. **Navigate to any module** from the dashboard
2. **Click the completion checkbox** next to lessons or projects
3. **Watch progress update** in real-time across all components
4. **Receive Discord notifications** when completing items
5. **Get role promotions** when completing entire modules

### For Developers/Testing

1. **Access the developer reset tool** (bottom-right corner)
2. **Enter reset key**: `dev-reset-2024`
3. **Confirm reset** to clear all progress for testing

## API Endpoints

### POST `/api/progress`
Mark a lesson or project as complete.

**Request Body:**
```json
{
  "type": "lesson" | "project",
  "itemId": "lesson_or_project_id",
  "moduleId": "module_id"
}
```

**Response:**
```json
{
  "success": true,
  "newCompletion": true | false,
  "alreadyCompleted": true | false
}
```

### GET `/api/progress`
Get user's current progress.

**Response:**
```json
{
  "progress": [
    {
      "id": "progress_id",
      "user_id": "user_id",
      "lesson_id": "lesson_id",
      "module_id": "module_id",
      "completed": true,
      "completed_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### DELETE `/api/progress?resetKey=dev-reset-2024`
Reset all progress for the current user (developer tool).

**Response:**
```json
{
  "success": true,
  "message": "Progress reset successfully"
}
```

## Components

### LessonCard
- **Completion checkbox** with visual states
- **Loading spinner** during completion
- **Disabled state** when already completed
- **Hover effects** and smooth transitions

### ProjectCard
- **Larger completion button** (projects are more significant)
- **Orange theme** to distinguish from lessons
- **Same completion logic** as lessons

### ProgressOverview
- **Real-time calculations** from user progress data
- **Four key metrics**: Overall Progress, Modules, Lessons, Projects
- **Responsive grid layout**

### ModuleCard
- **Progress bar** showing completion percentage
- **Lesson/project counters** with completed/total format
- **Dynamic action button** (Start/Continue/Review)

### DeveloperReset
- **Secure reset interface** with confirmation
- **Password protection** to prevent accidental resets
- **Only visible in development** environment

## Database Schema

The system uses the existing `user_progress` table:

```sql
user_progress (
  id: string (primary key)
  user_id: string (foreign key to users)
  lesson_id: string (foreign key to lessons)
  module_id: string (foreign key to modules)
  completed: boolean
  completed_at: timestamp
  created_at: timestamp
  updated_at: timestamp
)
```

**Note:** Both lessons and projects are stored in the `lessons` table, differentiated by `order_index` (projects typically have `order_index = 4`).

## Discord Configuration

Ensure these environment variables are set:

```env
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_NOTIFICATION_CHANNEL_ID=channel_id
DISCORD_GUILD_ID=server_id
```

## Security Features

1. **Authentication required** for all completion actions
2. **Anti-spam protection** prevents duplicate notifications
3. **Reset key protection** for developer tools
4. **Server-side validation** of all completion requests

## Real-Time Updates

The system provides immediate feedback:

1. **Optimistic UI updates** during completion
2. **Progress bars animate** to new values
3. **Completion states persist** across page refreshes
4. **Module cards update** when returning to dashboard

## Testing

Use the developer reset tool to test the completion flow:

1. Mark several lessons as complete
2. Watch progress bars update
3. Complete a project to see module completion
4. Use reset tool to clear progress
5. Repeat testing as needed

The reset key is: `dev-reset-2024`
