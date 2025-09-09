# 🎯 Individual Video Titles - Complete Guide

## 🚀 **What Changed**

Now you can give **every single video** its own unique custom title! No more "Lesson 1 - Video 1" - each video gets its own name.

## 📍 **Where to Add Your Custom Video Titles**

### **File 1: Regular Lesson Videos**
**Location:** `src/components/course/lesson-card.tsx`  
**Lines:** 129-142 (inside the `individualVideoTitles` object)

### **File 2: Project Videos**
**Location:** `src/components/course/project-card.tsx`  
**Lines:** 130-141 (inside the `individualProjectVideoTitles` object)

## 🎯 **How It Works Now**

Instead of grouping by lesson, you map **each individual YouTube URL** to its own custom title:

```typescript
const individualVideoTitles: { [videoUrl: string]: string } = {
  'https://www.youtube.com/watch?v=abc123': 'N8n Fundamentals - Getting Started',
  'https://www.youtube.com/watch?v=def456': 'Building Your First Workflow',
  'https://www.youtube.com/watch?v=ghi789': 'Advanced Node Configurations',
  'https://www.youtube.com/watch?v=jkl012': 'Error Handling Techniques',
};
```

## 📋 **Step-by-Step Process**

### **Step 1: Get All Your Video URLs**

First, you need to get all the YouTube URLs from your database. Run this SQL in Supabase:

```sql
SELECT 
  m.title as module_title,
  l.title as lesson_title,
  l.order_index,
  CASE WHEN l.order_index = 4 THEN 'PROJECT' ELSE 'LESSON' END as type,
  unnest(l.youtube_urls) as video_url
FROM lessons l
JOIN modules m ON l.module_id = m.id
WHERE l.youtube_urls IS NOT NULL AND array_length(l.youtube_urls, 1) > 0
ORDER BY m.order_index, l.order_index;
```

This will give you a list like:
```
Module 1 | Getting Started | LESSON | https://www.youtube.com/watch?v=abc123
Module 1 | Getting Started | LESSON | https://www.youtube.com/watch?v=def456  
Module 1 | Basic Workflows | LESSON | https://www.youtube.com/watch?v=ghi789
Module 1 | Module Project | PROJECT | https://www.youtube.com/watch?v=jkl012
```

### **Step 2: Add Titles for Lesson Videos**

Open `src/components/course/lesson-card.tsx` and add your titles:

```typescript
const individualVideoTitles: { [videoUrl: string]: string } = {
  // Copy each URL from Step 1 and give it a custom title
  'https://www.youtube.com/watch?v=abc123': 'N8n Fundamentals - Complete Beginner Guide',
  'https://www.youtube.com/watch?v=def456': 'Setting Up Your Development Environment', 
  'https://www.youtube.com/watch?v=ghi789': 'Building Your First Automation Workflow',
  'https://www.youtube.com/watch?v=mno345': 'Advanced Node Configurations Explained',
  'https://www.youtube.com/watch?v=pqr678': 'Error Handling and Debugging Techniques',
  
  // Add ALL your lesson video URLs here...
};
```

### **Step 3: Add Titles for Project Videos**

Open `src/components/course/project-card.tsx` and add project video titles:

```typescript
const individualProjectVideoTitles: { [videoUrl: string]: string } = {
  // Add project video URLs and titles
  'https://www.youtube.com/watch?v=jkl012': 'Project Walkthrough - Building E-commerce Automation',
  'https://www.youtube.com/watch?v=stu901': 'Advanced Project - Multi-Step Workflow Creation',
  'https://www.youtube.com/watch?v=vwx234': 'Final Project - Complete N8n Integration Build',
  
  // Add ALL your project video URLs here...
};
```

### **Step 4: Test Your Changes**

1. Save both files
2. Refresh your website (Ctrl+F5 for hard refresh)
3. Navigate to any module and expand lessons
4. Each video should now show your custom title!

## 💡 **Examples**

### **Before (Auto-Generated):**
- "Getting Started - Video 1"
- "Getting Started - Video 2" 
- "Advanced Workflows - Video 1"
- "Module Project - Video"

### **After (Your Custom Titles):**
- "N8n Fundamentals - Complete Beginner Guide"
- "Setting Up Your Development Environment"
- "Building Complex Multi-Step Automations"
- "Project Walkthrough - E-commerce Integration"

## 🔍 **Finding Your Video URLs**

### **Method 1: From Supabase (Recommended)**
Use the SQL query from Step 1 above.

### **Method 2: From Your Website**
1. Go to your website
2. Open browser developer tools (F12)
3. Navigate to a lesson and expand it
4. Right-click on a video link → "Copy link address"
5. That's the URL you need to add to the code

### **Method 3: Inspect the Database Directly**
```sql
-- Get all video URLs with context
SELECT 
  l.id,
  l.title,
  l.youtube_urls
FROM lessons l
WHERE l.youtube_urls IS NOT NULL;
```

## ✅ **Quick Checklist**

- [ ] Run SQL query to get all video URLs
- [ ] Copy URLs into `lesson-card.tsx` (lines 129-142)
- [ ] Copy project URLs into `project-card.tsx` (lines 130-141)  
- [ ] Give each URL a unique custom title
- [ ] Save files and test on website
- [ ] Verify all videos show custom titles

## 🚨 **Important Notes**

- **Exact URL matching** - The URL in your code must match exactly what's in your database
- **One entry per video** - Each YouTube URL gets its own line
- **Quotes matter** - Use single quotes for URLs and titles
- **Commas matter** - Don't forget commas between entries
- **No custom title?** - Videos without custom titles will show the old format

## 🎯 **Template to Copy**

```typescript
// For lesson-card.tsx (lines 129-142)
const individualVideoTitles: { [videoUrl: string]: string } = {
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_1': 'Your Custom Title 1',
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_2': 'Your Custom Title 2',
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_3': 'Your Custom Title 3',
  // Add more...
};

// For project-card.tsx (lines 130-141)
const individualProjectVideoTitles: { [videoUrl: string]: string } = {
  'https://www.youtube.com/watch?v=PROJECT_VIDEO_ID_1': 'Your Project Title 1',
  'https://www.youtube.com/watch?v=PROJECT_VIDEO_ID_2': 'Your Project Title 2',
  // Add more...
};
```

## 🎉 **Result**

Every single video in your course now has its own unique, custom title that you control completely! No more generic numbering - each video gets the exact name you want. 🚀
