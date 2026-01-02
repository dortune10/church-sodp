-- Migration to fix sermon schema mismatch
-- Add preached_at and preacher_name columns

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sermons' AND column_name='preached_at') THEN
        ALTER TABLE sermons ADD COLUMN preached_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sermons' AND column_name='preacher_name') THEN
        ALTER TABLE sermons ADD COLUMN preacher_name TEXT;
    END IF;

    -- Optional: Copy data from speaker to preacher_name if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sermons' AND column_name='speaker') THEN
        UPDATE sermons SET preacher_name = speaker WHERE preacher_name IS NULL;
    END IF;
END $$;
