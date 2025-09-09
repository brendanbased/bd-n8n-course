-- =====================================================
-- STEP 1: ADD THE VIDEO_TITLES COLUMN (Run this first)
-- =====================================================
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_titles text[];

-- =====================================================
-- STEP 2: VIEW YOUR CURRENT STRUCTURE (Run this to see your data)
-- =====================================================
-- This query shows you all your modules, lessons, and current video setup
SELECT 
  '=== MODULE: ' || m.title || ' ===' as structure,
  m.order_index as module_order,
  '' as lesson_info,
  '' as current_title,
  '' as video_count,
  '' as lesson_id
FROM modules m
WHERE FALSE -- This is just a header, won't return data

UNION ALL

SELECT 
  '  → LESSON: ' || l.title as structure,
  m.order_index as module_order,
  'Order: ' || l.order_index || 
  CASE 
    WHEN l.order_index = 4 THEN ' (PROJECT)'
    ELSE ' (LESSON)'
  END as lesson_info,
  CASE 
    WHEN l.youtube_urls IS NULL OR array_length(l.youtube_urls, 1) = 0 THEN 'No videos'
    WHEN array_length(l.youtube_urls, 1) = 1 THEN 'Current: "' || l.title || ' - Video"'
    ELSE 'Current: "' || l.title || ' - Video 1", "' || l.title || ' - Video 2"' ||
         CASE WHEN array_length(l.youtube_urls, 1) > 2 THEN ', etc...' ELSE '' END
  END as current_title,
  COALESCE(array_length(l.youtube_urls, 1)::text, '0') || ' video(s)' as video_count,
  l.id as lesson_id
FROM lessons l
JOIN modules m ON l.module_id = m.id
ORDER BY module_order, l.order_index;

-- =====================================================
-- STEP 3: COPY THE TEMPLATE BELOW AND CUSTOMIZE YOUR TITLES
-- =====================================================

-- Instructions:
-- 1. Run the query above to see your current structure
-- 2. For each lesson with videos, copy the appropriate template below
-- 3. Replace 'YOUR_LESSON_ID_HERE' with the actual lesson ID from the query
-- 4. Replace 'Your Custom Title Here' with your desired video title
-- 5. If a lesson has multiple videos, provide multiple titles in the array

-- =====================================================
-- TEMPLATES - COPY AND CUSTOMIZE THESE FOR EACH LESSON
-- =====================================================

-- Template for lessons with 1 video:
-- UPDATE lessons 
-- SET video_titles = ARRAY['Your Custom Title Here']
-- WHERE id = 'YOUR_LESSON_ID_HERE';

-- Template for lessons with 2 videos:
-- UPDATE lessons 
-- SET video_titles = ARRAY['Your Custom Title 1', 'Your Custom Title 2']
-- WHERE id = 'YOUR_LESSON_ID_HERE';

-- Template for lessons with 3 videos:
-- UPDATE lessons 
-- SET video_titles = ARRAY['Your Custom Title 1', 'Your Custom Title 2', 'Your Custom Title 3']
-- WHERE id = 'YOUR_LESSON_ID_HERE';

-- =====================================================
-- EXAMPLE BASED ON COMMON N8N COURSE STRUCTURE
-- =====================================================
-- (Replace these IDs and titles with your actual data)

-- Example Module 1: Introduction to N8n
-- UPDATE lessons 
-- SET video_titles = ARRAY['N8n Fundamentals - Complete Beginner Guide']
-- WHERE id = 'replace-with-actual-lesson-id-1';

-- UPDATE lessons 
-- SET video_titles = ARRAY['Setting Up Your First Workflow', 'Connecting Nodes and Testing']
-- WHERE id = 'replace-with-actual-lesson-id-2';

-- Example Module 2: Advanced Workflows  
-- UPDATE lessons 
-- SET video_titles = ARRAY['Advanced Node Configurations']
-- WHERE id = 'replace-with-actual-lesson-id-3';

-- UPDATE lessons 
-- SET video_titles = ARRAY['Complex Data Transformations', 'Error Handling in Workflows']
-- WHERE id = 'replace-with-actual-lesson-id-4';

-- Example Project Lesson
-- UPDATE lessons 
-- SET video_titles = ARRAY['Project Walkthrough - Building an E-commerce Automation']
-- WHERE id = 'replace-with-actual-project-id-1';

-- =====================================================
-- STEP 4: VERIFY YOUR UPDATES (Run this after updating)
-- =====================================================
SELECT 
  m.title as module_title,
  l.title as lesson_title,
  CASE 
    WHEN l.order_index = 4 THEN 'PROJECT'
    ELSE 'LESSON'
  END as type,
  COALESCE(array_length(l.youtube_urls, 1), 0) as video_count,
  CASE 
    WHEN l.video_titles IS NULL THEN 'No custom titles (will use default)'
    ELSE 'Custom titles: ' || array_to_string(l.video_titles, ', ')
  END as video_titles_status,
  l.id as lesson_id
FROM lessons l
JOIN modules m ON l.module_id = m.id
ORDER BY m.order_index, l.order_index;

-- =====================================================
-- STEP 5: CHECK FOR MISSING TITLES (Optional)
-- =====================================================
-- This shows lessons that have videos but no custom titles yet
SELECT 
  m.title as module_title,
  l.title as lesson_title,
  l.id as lesson_id,
  array_length(l.youtube_urls, 1) as video_count,
  'UPDATE lessons SET video_titles = ARRAY[' ||
  CASE 
    WHEN array_length(l.youtube_urls, 1) = 1 THEN '''Your Custom Title Here'''
    WHEN array_length(l.youtube_urls, 1) = 2 THEN '''Your Custom Title 1'', ''Your Custom Title 2'''
    WHEN array_length(l.youtube_urls, 1) = 3 THEN '''Your Custom Title 1'', ''Your Custom Title 2'', ''Your Custom Title 3'''
    ELSE '''Your Custom Title 1'', ''Your Custom Title 2'', ''...more titles...'''
  END ||
  '] WHERE id = ''' || l.id || ''';' as suggested_update
FROM lessons l
JOIN modules m ON l.module_id = m.id
WHERE l.youtube_urls IS NOT NULL 
  AND array_length(l.youtube_urls, 1) > 0 
  AND l.video_titles IS NULL
ORDER BY m.order_index, l.order_index;
