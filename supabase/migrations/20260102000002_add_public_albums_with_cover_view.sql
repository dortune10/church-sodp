CREATE OR REPLACE VIEW public_albums_with_cover AS
SELECT
  pa.*,
  (
    SELECT
      p.storage_path
    FROM
      photos p
    WHERE
      p.album_id = pa.id
    ORDER BY
      p.created_at
    LIMIT 1
  ) as cover_photo_path,
  (
    SELECT
      COUNT(*)
    FROM
      photos p
    WHERE
      p.album_id = pa.id
  ) as photo_count
FROM
  photo_albums pa
WHERE
  pa.is_public = true;
