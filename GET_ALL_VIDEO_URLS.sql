-- =====================================================
-- GET ALL VIDEO URLS FOR CUSTOM TITLES
-- =====================================================
-- Run this query in Supabase to get all your video URLs
-- Then copy the results to add custom titles in your code

-- Query 1: Get all video URLs with lesson context
SELECT 
  '-- ' || m.title || ' > ' || l.title || ' (' || 
  CASE WHEN l.order_index = 4 THEN 'PROJECT' ELSE 'LESSON' END || ')' as comment,
  '''' || unnest(l.youtube_urls) || ''': ''Your Custom Title Here'',' as code_line
FROM lessons l
JOIN modules m ON l.module_id = m.id
WHERE l.youtube_urls IS NOT NULL AND array_length(l.youtube_urls, 1) > 0
ORDER BY m.order_index, l.order_index;

-- =====================================================
-- Query 2: Separate lesson videos from project videos
-- =====================================================

-- LESSON VIDEOS ONLY (for lesson-card.tsx)
SELECT 
  'LESSON VIDEOS - Copy these to lesson-card.tsx (lines 129-142):' as instruction
WHERE FALSE

UNION ALL

SELECT 
  '''' || unnest(l.youtube_urls) || ''': ''' || 
  m.title || ' - ' || l.title || ' - Custom Title Here'',' as lesson_video_line
FROM lessons l
JOIN modules m ON l.module_id = m.id
WHERE l.youtube_urls IS NOT NULL 
  AND array_length(l.youtube_urls, 1) > 0
  AND l.order_index < 4  -- Regular lessons only
ORDER BY lesson_video_line;

-- =====================================================

-- PROJECT VIDEOS ONLY (for project-card.tsx)  
SELECT 
  'PROJECT VIDEOS - Copy these to project-card.tsx (lines 130-141):' as instruction
WHERE FALSE

UNION ALL

SELECT 
  '''' || unnest(l.youtube_urls) || ''': ''' || 
  m.title || ' - ' || l.title || ' - Custom Title Here'',' as project_video_line
FROM lessons l
JOIN modules m ON l.module_id = m.id
WHERE l.youtube_urls IS NOT NULL 
  AND array_length(l.youtube_urls, 1) > 0
  AND l.order_index = 4  -- Projects only
ORDER BY project_video_line;

-- =====================================================
-- Query 3: Detailed view for manual copying
-- =====================================================
SELECT 
  m.order_index as module_order,
  m.title as module_title,
  l.order_index as lesson_order,
  l.title as lesson_title,
  CASE WHEN l.order_index = 4 THEN 'PROJECT' ELSE 'LESSON' END as type,
  unnest(l.youtube_urls) as video_url,
  'Add custom title for this video' as action_needed
FROM lessons l
JOIN modules m ON l.module_id = m.id
WHERE l.youtube_urls IS NOT NULL AND array_length(l.youtube_urls, 1) > 0
ORDER BY m.order_index, l.order_index;

-- =====================================================
-- Query 4: Count total videos to customize
-- =====================================================
SELECT 
  COUNT(*) as total_videos_to_customize,
  SUM(CASE WHEN l.order_index < 4 THEN 1 ELSE 0 END) as lesson_videos,
  SUM(CASE WHEN l.order_index = 4 THEN 1 ELSE 0 END) as project_videos
FROM (
  SELECT 
    l.order_index,
    unnest(l.youtube_urls) as video_url
  FROM lessons l
  WHERE l.youtube_urls IS NOT NULL AND array_length(l.youtube_urls, 1) > 0
) as all_videos
JOIN lessons l ON true
WHERE l.youtube_urls IS NOT NULL AND array_length(l.youtube_urls, 1) > 0
GROUP BY ();

-- =====================================================
-- INSTRUCTIONS:
-- =====================================================
-- 1. Run Query 1 to see all videos with context
-- 2. Run Query 2 to get pre-formatted code lines to copy
-- 3. Run Query 3 for a detailed spreadsheet-like view
-- 4. Run Query 4 to see how many videos you need to customize
-- 
-- Then:
-- 5. Copy the URLs from Query 2 results
-- 6. Paste into the appropriate files (lesson-card.tsx or project-card.tsx)
-- 7. Replace "Custom Title Here" with your actual video titles
-- 8. Save and test!
