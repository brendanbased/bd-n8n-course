# 🎯 Hardcoded Video Titles Guide

## 📍 **Where to Add Your Custom Titles**

You can now hardcode video titles directly in the code. There are **2 files** to edit:

### **File 1: Lesson Videos**
**Location:** `src/components/course/lesson-card.tsx`  
**Lines:** 129-137 (inside the `customTitles` object)

### **File 2: Project Videos** 
**Location:** `src/components/course/project-card.tsx`  
**Lines:** 130-138 (inside the `customProjectTitles` object)

## 🚀 **How to Add Your Titles**

### **Method 1: By Lesson/Project Title (Easiest)**

In `lesson-card.tsx`, add your titles like this:
```typescript
const customTitles: { [key: string]: string[] } = {
  // Single video lessons
  'Getting Started': ['N8n Fundamentals - Complete Beginner Guide'],
  'Basic Setup': ['Setting Up Your N8n Environment'],
  
  // Multiple video lessons  
  'Advanced Workflows': [
    'Building Complex Automations', 
    'Error Handling and Debugging',
    'Performance Optimization'
  ],
  
  // Add more lessons here...
};
```

In `project-card.tsx`, add project titles:
```typescript
const customProjectTitles: { [key: string]: string[] } = {
  'Module 1 Project': ['Project Walkthrough - Building Your First Automation'],
  'E-commerce Project': ['E-commerce Automation - Complete Build'],
  'Advanced Project': [
    'Advanced Project - Part 1: Setup', 
    'Advanced Project - Part 2: Implementation'
  ],
  
  // Add more projects here...
};
```

### **Method 2: By Lesson/Project ID (More Precise)**

If you know the exact IDs from your database:
```typescript
const customTitles: { [key: string]: string[] } = {
  'abc123-def456-ghi789': ['Your Custom Video Title'],
  'xyz789-uvw456-rst123': ['Video 1 Title', 'Video 2 Title'],
};
```

## 📋 **Step-by-Step Process**

1. **Find your lesson/project names** by visiting your website
2. **Open the files** mentioned above
3. **Add entries** to the `customTitles` objects
4. **Save the files**
5. **Refresh your website** - titles will update immediately!

## 💡 **Examples**

### **Single Video Lesson:**
```typescript
'Introduction to N8n': ['N8n Masterclass - Getting Started Guide'],
```

### **Multiple Video Lesson:**
```typescript
'Building Workflows': [
  'Creating Your First Workflow',
  'Adding Conditional Logic', 
  'Testing and Deployment'
],
```

### **Project with One Video:**
```typescript
'E-commerce Automation Project': ['Complete E-commerce Automation Build'],
```

## 🔍 **How to Find Lesson Names**

1. Go to your website dashboard
2. Click on any module
3. The lesson names you see are exactly what you put in the quotes
4. For example, if you see "Getting Started with N8n", use that exact text

## ✅ **Testing Your Changes**

1. Save the files after adding titles
2. Refresh your website (Ctrl+F5 for hard refresh)
3. Navigate to a module and expand a lesson
4. Your custom titles should appear instead of the generic ones!

## 🚨 **Important Notes**

- **Exact spelling matters** - lesson names must match exactly
- **Array format** - always use `['title1', 'title2']` format
- **Commas matter** - don't forget commas between entries
- **Quotes matter** - use single quotes inside the arrays
- **No custom title?** - It will automatically fall back to the default format

## 🎯 **Quick Template**

Copy this template and fill in your titles:

```typescript
// In lesson-card.tsx (lines 129-137)
const customTitles: { [key: string]: string[] } = {
  'Lesson Name Here': ['Your Custom Video Title'],
  'Another Lesson': ['Video 1 Title', 'Video 2 Title'],
  // Add more lessons...
};

// In project-card.tsx (lines 130-138)  
const customProjectTitles: { [key: string]: string[] } = {
  'Project Name Here': ['Your Custom Project Video Title'],
  // Add more projects...
};
```

That's it! No database changes, no SQL - just edit the code files and your titles will update immediately! 🎉
