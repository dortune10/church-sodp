CREATE OR REPLACE FUNCTION get_album_cover_and_count(album_id UUID)
RETURNS TABLE (cover_path TEXT, photo_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT storage_path FROM photos WHERE photos.album_id = a.id ORDER BY created_at LIMIT 1),
        (SELECT COUNT(*) FROM photos WHERE photos.album_id = a.id)
    FROM photo_albums a
    WHERE a.id = album_id;
END;
$$ LANGUAGE plpgsql;
