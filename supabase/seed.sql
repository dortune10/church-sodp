-- Seed Ministries
INSERT INTO ministries (name, slug, description, category, schedule)
VALUES 
  ('Children''s Ministry', 'childrens-ministry', 'Programs and activities for children of all ages.', 'Education', 'Sundays at 10:00 AM'),
  ('Youth Ministry', 'youth-ministry', 'A place for teens to grow and connect.', 'Community', 'Wednesdays at 6:30 PM'),
  ('Worship Team', 'worship-team', 'Leading the congregation in praise and worship.', 'Music', 'Rehearsals on Thursdays at 7:00 PM');

-- Notes: 
-- 1. To create an admin, you must first register via the website.
-- 2. Then, run the following SQL in your Supabase dashboard:
--    UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
