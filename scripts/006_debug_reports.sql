-- Debug script to check reports table and data
SELECT 
  id,
  user_id,
  title,
  description,
  location_name,
  latitude,
  longitude,
  damage_level,
  photo_url,
  status,
  created_at,
  updated_at
FROM reports
ORDER BY created_at DESC
LIMIT 10;

-- Check if there are any reports at all
SELECT COUNT(*) as total_reports FROM reports;

-- Check reports by user
SELECT 
  user_id,
  COUNT(*) as report_count
FROM reports
GROUP BY user_id;
