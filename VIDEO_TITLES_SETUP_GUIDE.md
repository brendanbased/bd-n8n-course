# 🎥 Video Titles Customization Guide

## ✅ What's Been Done
- ✅ Created SQL script (`video-titles-setup.sql`)
- ✅ Updated frontend components to use custom titles
- ✅ Updated database interfaces and types
- ✅ Added fallback logic (if no custom title, uses old format)

## 🚀 Step-by-Step Implementation

### **Step 1: Access Your Supabase Database**
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click on your N8n course project
3. In the left sidebar, click **"SQL Editor"**

### **Step 2: Add the Video Titles Column**
Copy and paste this command in the SQL Editor:
```sql
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_titles text[];
```
Click **"Run"** (or press Ctrl+Enter)

### **Step 3: Use the Organized SQL Script**
Instead of manually finding lesson data, use the new organized SQL script:

1. Open the file `ORGANIZED_VIDEO_TITLES_SETUP.sql`
2. Run **Step 2** from that file to see your complete course structure
3. The query will show you:
   - All modules in order
   - All lessons within each module
   - Current video titles for each lesson
   - How many videos each lesson has
   - The lesson IDs you need

This gives you a complete overview of what needs to be updated.

### **Step 4: Update Video Titles**

For each lesson, use this pattern:

**Single Video Lesson:**
```sql
UPDATE lessons 
SET video_titles = ARRAY['Your Custom Video Title Here']
WHERE id = 'paste-lesson-uuid-here';
```

**Multiple Video Lesson:**
```sql
UPDATE lessons 
SET video_titles = ARRAY['Video 1 Title', 'Video 2 Title', 'Video 3 Title']
WHERE id = 'paste-lesson-uuid-here';
```

**Real Example:**
```sql
-- Replace the UUID with your actual lesson ID
UPDATE lessons 
SET video_titles = ARRAY['N8n Fundamentals - Complete Beginner Guide']
WHERE id = 'abc123-def456-ghi789-012345';

UPDATE lessons 
SET video_titles = ARRAY['Building Your First Workflow', 'Testing and Debugging']
WHERE id = 'xyz789-uvw456-rst123-678901';
```

### **Step 5: Verify Your Updates**
Run this to check your custom titles:
```sql
SELECT 
  m.title as module_title,
  l.title as lesson_title,
  l.video_titles,
  array_length(l.youtube_urls, 1) as video_count
FROM lessons l
JOIN modules m ON l.module_id = m.id
WHERE l.video_titles IS NOT NULL
ORDER BY m.order_index, l.order_index;
```

### **Step 6: Test Your Website**
1. Save all your work in Supabase
2. Go to your website and refresh the page
3. Navigate to any module and expand a lesson
4. You should see your custom video titles instead of the generic ones!

## 🎯 How It Works

**Before:** Video links showed generic titles like:
- "Lesson 1 - Video"
- "Project - Video 1"

**After:** Video links show your custom titles like:
- "N8n Fundamentals - Complete Beginner Guide"
- "Building Your First Workflow"
- "Advanced Automation Techniques"

## 🔧 Fallback System

If you don't set a custom title for a lesson, it will automatically fall back to the old format. This means:
- ✅ No broken links
- ✅ Gradual migration (you can update titles one by one)
- ✅ Backwards compatibility

## 📝 Quick Reference Templates

**Template for bulk updates by lesson title:**
```sql
UPDATE lessons 
SET video_titles = ARRAY['Custom Title']
WHERE title = 'Exact Lesson Title From Database';
```

**Template for project lessons:**
```sql
UPDATE lessons 
SET video_titles = ARRAY['Project Walkthrough - Your Custom Title']
WHERE order_index = 4 AND title ILIKE '%project%';
```

## 🚨 Important Notes

1. **Use exact lesson UUIDs** - don't guess, copy them from the query results
2. **Array syntax matters** - always use `ARRAY['title1', 'title2']` format
3. **Match video count** - if a lesson has 3 videos, provide 3 titles
4. **Test after each update** - verify on your website that titles appear correctly

## ✅ Success Checklist

- [ ] Added `video_titles` column to database
- [ ] Found all lesson IDs using the query
- [ ] Updated lessons with custom video titles
- [ ] Verified updates with the check query
- [ ] Tested on website - custom titles appear
- [ ] All video links work correctly

## 🆘 Troubleshooting

**Problem:** Custom titles not showing on website
**Solution:** 
1. Check that you used the correct lesson UUID
2. Refresh your browser (hard refresh: Ctrl+F5)
3. Verify the update worked with the verification query

**Problem:** SQL error when updating
**Solution:**
1. Make sure you're using `ARRAY['title']` syntax
2. Check that the lesson UUID exists in your database
3. Ensure you added the column first

**Problem:** Some videos still show old titles
**Solution:** This is normal! Only lessons with custom `video_titles` will show the new format. Others fall back to the old format until you update them.
