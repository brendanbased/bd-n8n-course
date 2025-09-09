# 🎯 Resource Cards - Custom Video Titles Setup

## ✅ **What's Been Implemented:**

I've updated the Resource Cards to work exactly like the Lessons and Projects with individual custom video titles.

## 📍 **Where to Add More Resource Video Titles:**

**File:** `src/components/course/resource-card.tsx`  
**Lines:** 19-26 (inside the `individualResourceVideoTitles` object)

## 🎯 **Current Setup:**

### **Resource Cards (3 cards currently):**
1. **"Getting Started with N8n"** → `https://youtube.com/watch?v=otUBuV1foLY` → "Build your first NO CODE AI Agent in n8n"
2. **"Advanced N8n Workflows"** → `https://youtube.com/watch?v=lK3veuZAg0c` → "Step-by-Step: N8N Webhooks"  
3. **"N8n Integration Patterns"** → `https://youtube.com/watch?v=3FfCRbq3XMs` → "n8n Webhook Security"

## 🚀 **How to Add More Resource Cards:**

### **Step 1: Add New ResourceCard in Dashboard**
Edit `src/app/dashboard/page.tsx` (around line 277) and add:

```typescript
<ResourceCard
  title="Your Card Title"
  description="Your card description here."
  videoUrl="https://youtube.com/watch?v=YOUR_VIDEO_ID"
/>
```

### **Step 2: Add Custom Video Title**
Edit `src/components/course/resource-card.tsx` (lines 19-26) and add:

```typescript
'https://youtube.com/watch?v=YOUR_VIDEO_ID': 'Your Custom Video Title Here',
```

## 💡 **Example of Adding a New Resource Card:**

### **In dashboard/page.tsx:**
```typescript
<ResourceCard
  title="N8n Error Handling"
  description="Learn advanced error handling techniques for robust n8n workflows."
  videoUrl="https://youtube.com/watch?v=bTF3tACqPRU"
/>
```

### **In resource-card.tsx:**
```typescript
'https://youtube.com/watch?v=bTF3tACqPRU': 'One n8n Workflow for Unlimited Error Handling',
```

## 🎯 **How It Works:**

1. **Card Title & Description:** Set in the dashboard when creating the ResourceCard
2. **Video URL:** Also set in the dashboard  
3. **Custom Video Link Text:** Mapped in the resource-card component using the URL

## ✅ **What You Should See:**

**Before:** "Watch Video - Placeholder Title"  
**After:** "Build your first NO CODE AI Agent in n8n" (or your custom title)

## 🔧 **Current Status:**

- ✅ **3 Resource Cards** with real YouTube URLs
- ✅ **Custom video titles** for each card
- ✅ **Same system** as Lessons and Projects
- ✅ **Easy to expand** - just add more cards and titles

The Resource Cards now work exactly like your Lessons and Projects with individual custom video titles! 🚀
