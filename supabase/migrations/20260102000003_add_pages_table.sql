-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view pages') THEN
        CREATE POLICY "Public can view pages" ON pages FOR SELECT USING (TRUE);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage pages') THEN
        CREATE POLICY "Admins can manage pages" ON pages FOR ALL USING (
          EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;

-- Insert about page content
INSERT INTO pages (slug, title, content) VALUES
  ('about', 'About Us', '{"mission": "Our mission is to lead people into a growing relationship with Jesus Christ. We seek to be a lighthouse in our community, sharing hope and love with everyone we meet.", "story": "Founded in [Year], Church Name began with a small group of faithful believers dedicated to making a difference. Today, we continue that legacy by fostering a welcoming environment for all to worship and grow.", "beliefs": [{"point": "We believe in the authority and inspiration of Scripture."}, {"point": "We believe in one God, existing in three persons: Father, Son, and Holy Spirit."}, {"point": "We believe in the dignity of every human being as made in God''s image."}]}')
ON CONFLICT (slug) DO NOTHING;
