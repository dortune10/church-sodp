-- Function to check user roles without recursion
CREATE OR REPLACE FUNCTION public.check_role(target_roles user_role[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = ANY(target_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix Profiles RLS (Drop and Recreate)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON profiles 
FOR ALL USING (public.check_role(ARRAY['admin']::user_role[]));

-- Events RLS
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Admins/Editors manage events" ON events;

CREATE POLICY "Public can view events" ON events FOR SELECT USING (TRUE);

CREATE POLICY "Admins/Editors manage events" ON events 
FOR ALL USING (public.check_role(ARRAY['admin', 'editor']::user_role[]));

-- Ministries RLS
DROP POLICY IF EXISTS "Public can view ministries" ON ministries;
DROP POLICY IF EXISTS "Admins/Editors manage ministries" ON ministries;

CREATE POLICY "Public can view ministries" ON ministries FOR SELECT USING (TRUE);

CREATE POLICY "Admins/Editors manage ministries" ON ministries 
FOR ALL USING (public.check_role(ARRAY['admin', 'editor']::user_role[]));

-- Sermons RLS
DROP POLICY IF EXISTS "Public can view sermons" ON sermons;
DROP POLICY IF EXISTS "Admins/Editors manage sermons" ON sermons;

CREATE POLICY "Public can view sermons" ON sermons FOR SELECT USING (TRUE);

CREATE POLICY "Admins/Editors manage sermons" ON sermons 
FOR ALL USING (public.check_role(ARRAY['admin', 'editor']::user_role[]));

-- Photo Albums RLS
DROP POLICY IF EXISTS "Public can view public albums" ON photo_albums;
DROP POLICY IF EXISTS "Admins/Editors manage albums" ON photo_albums;

CREATE POLICY "Public can view public albums" ON photo_albums 
FOR SELECT USING (is_public = TRUE OR public.check_role(ARRAY['admin', 'editor']::user_role[]));

CREATE POLICY "Admins/Editors manage albums" ON photo_albums 
FOR ALL USING (public.check_role(ARRAY['admin', 'editor']::user_role[]));

-- Photos RLS
DROP POLICY IF EXISTS "Public can view photos in public albums" ON photos;
DROP POLICY IF EXISTS "Admins/Editors manage photos" ON photos;

CREATE POLICY "Public can view photos in public albums" ON photos 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM photo_albums WHERE id = photos.album_id AND is_public = TRUE)
  OR public.check_role(ARRAY['admin', 'editor']::user_role[])
);

CREATE POLICY "Admins/Editors manage photos" ON photos 
FOR ALL USING (public.check_role(ARRAY['admin', 'editor']::user_role[]));

-- Members RLS
DROP POLICY IF EXISTS "Admins/Editors manage members" ON members;
CREATE POLICY "Admins/Editors manage members" ON members 
FOR ALL USING (public.check_role(ARRAY['admin', 'editor']::user_role[]));

-- Pages RLS
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pages') THEN
    DROP POLICY IF EXISTS "Admins can manage pages" ON pages;
    DROP POLICY IF EXISTS "Admins/Editors manage pages" ON pages;
    CREATE POLICY "Admins/Editors manage pages" ON pages 
    FOR ALL USING (public.check_role(ARRAY['admin', 'editor']::user_role[]));
  END IF;
END $$;

-- Settings RLS
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'settings') THEN
    DROP POLICY IF EXISTS "Public can view settings" ON settings;
    DROP POLICY IF EXISTS "Admins can manage settings" ON settings;
    DROP POLICY IF EXISTS "Admins/Editors manage settings" ON settings;
    
    CREATE POLICY "Public can view settings" ON settings FOR SELECT USING (TRUE);
    CREATE POLICY "Admins/Editors manage settings" ON settings 
    FOR ALL USING (public.check_role(ARRAY['admin', 'editor']::user_role[]));
  END IF;
END $$;

-- Contact Messages RLS
DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins/Editors manage contact messages" ON contact_messages;

CREATE POLICY "Public can insert contact messages" ON contact_messages 
FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins/Editors manage contact messages" ON contact_messages 
FOR ALL USING (public.check_role(ARRAY['admin', 'editor']::user_role[]));

-- Prayer Requests RLS
DROP POLICY IF EXISTS "Public can insert prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "Admins/Editors manage prayer requests" ON prayer_requests;

CREATE POLICY "Public can insert prayer requests" ON prayer_requests 
FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins/Editors manage prayer requests" ON prayer_requests 
FOR ALL USING (public.check_role(ARRAY['admin', 'editor']::user_role[]));
