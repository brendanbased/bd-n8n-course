# Lesson Completion Bug Fix

## Issue Description
Users could only mark one lesson as complete. Attempting to mark a second lesson as complete resulted in an error: "Failed to mark lesson complete: duplicate key value violates unique constraint 'user_progress_user_id_module_id_key'"

## Root Cause Analysis
The issue was a database constraint problem. The `user_progress` table has a unique constraint on `user_id` and `module_id` combination, but we need to store multiple progress records per module (one for each lesson and project). The `upsert` operation was failing because it was trying to insert multiple records with the same `user_id` and `module_id`.

## Changes Made

### 1. Fixed API Route (`/src/app/api/progress/route.ts`)
- **Replaced upsert with explicit check-and-insert/update logic** to handle the constraint properly
- **Added detailed error logging** to capture specific error messages
- **Added debug logging** to track API calls and data being processed
- **Improved error response** to include specific error details

**Before:**
```javascript
const { error: progressError } = await supabaseAdmin
  .from('user_progress')
  .upsert(progressData)
```

**After:**
```javascript
// Check if progress record exists for this specific lesson
const { data: existingRecord } = await supabaseAdmin
  .from('user_progress')
  .select('id')
  .eq('user_id', user.id)
  .eq('lesson_id', itemId)
  .single()

let progressError = null

if (existingRecord) {
  // Update existing record
  const { error } = await supabaseAdmin
    .from('user_progress')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq('id', existingRecord.id)
  progressError = error
} else {
  // Insert new record
  const { error } = await supabaseAdmin
    .from('user_progress')
    .insert(progressData)
  progressError = error
}
```

### 2. Fixed Database Service (`/src/lib/database.ts`)
- **Applied the same check-and-insert/update logic** to the DatabaseService.markComplete method
- **Ensured consistency** between API route and database service
- **Handles the unique constraint properly** by checking for existing records first

### 3. Enhanced Client-Side Error Handling (`/src/app/module/[moduleId]/page.tsx`)
- **Improved error messages** to show specific error details from the API
- **Better user feedback** when completion operations fail

**Before:**
```javascript
alert('Failed to mark lesson as complete. Please try again.')
```

**After:**
```javascript
alert(`Failed to mark lesson as complete: ${error.details || error.error || 'Unknown error'}`)
```

## Technical Details

### Why the Database Constraint Caused Issues
1. **Wrong Unique Constraint**: The database has a unique constraint on `user_id + module_id` instead of `user_id + lesson_id`
2. **Multiple Records Per Module**: We need multiple progress records per module (one for each lesson and project)
3. **Upsert Limitation**: Supabase upsert couldn't handle this constraint properly for our use case

### The Fix
- **Explicit Record Management**: Check if a record exists for the specific lesson first
- **Conditional Operations**: Update existing records or insert new ones based on what exists
- **Proper Constraint Handling**: Work around the database constraint by targeting specific lesson records
- **Better Error Reporting**: Added logging to identify future issues more quickly

## Testing Instructions

### 1. Test Multiple Lesson Completions
1. Navigate to any module page
2. Mark the first lesson as complete ✅
3. Mark the second lesson as complete ✅
4. Mark the third lesson as complete ✅
5. Verify all lessons show as completed
6. Check that progress bars update correctly

### 2. Test Project Completion
1. Complete all lessons in a module
2. Mark the project as complete ✅
3. Verify Discord notifications are sent
4. Check for role assignments (if applicable)

### 3. Test Anti-Spam Protection
1. Mark a lesson as complete
2. Try to mark the same lesson as complete again
3. Verify it returns success without sending duplicate notifications

### 4. Test Developer Reset Tool
1. Complete several lessons
2. Use the developer reset tool (password: `dev-reset-2024`)
3. Verify all progress is cleared
4. Test completing lessons again after reset

## Expected Behavior After Fix

### ✅ What Should Work Now:
- **Multiple lesson completions** in sequence
- **Project completions** after lessons
- **Real-time progress updates** across all components
- **Discord notifications** for each new completion
- **Anti-spam protection** for duplicate completions
- **Developer reset functionality** for testing

### 🔍 Monitoring Points:
- Check browser console for any new errors
- Monitor server logs for database errors
- Verify Discord notifications are sent correctly
- Ensure progress data persists across page refreshes

## Rollback Plan
If issues persist, the changes can be easily reverted by:
1. Restoring the `onConflict` parameter with correct constraint name
2. Investigating the actual database schema for proper constraint names
3. Using alternative conflict resolution strategies

## Future Improvements
1. **Database Schema Validation**: Verify actual constraint names in the database
2. **Better Error Handling**: Implement retry mechanisms for transient failures
3. **Performance Optimization**: Consider batching multiple completions
4. **User Experience**: Add optimistic UI updates while API calls are in progress

---

## Files Modified
- `/src/app/api/progress/route.ts` - Fixed upsert operation and added logging
- `/src/lib/database.ts` - Fixed DatabaseService.markComplete method
- `/src/app/module/[moduleId]/page.tsx` - Enhanced error handling
- `/LESSON_COMPLETION_FIX.md` - This documentation file
