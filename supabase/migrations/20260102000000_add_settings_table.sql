-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on the new table
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for settings
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view settings') THEN
        CREATE POLICY "Public can view settings" ON settings FOR SELECT USING (TRUE);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage settings') THEN
        CREATE POLICY "Admins can manage settings" ON settings FOR ALL USING (
          EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('address', '123 Church Street, City, State 12345'),
  ('phone', '(555) 123-4567'),
  ('email', 'info@church.com'),
  ('service_times', 'Sunday Morning: 9:00 AM & 11:00 AM, Wednesday Evening: 7:00 PM')
ON CONFLICT (key) DO NOTHING;
