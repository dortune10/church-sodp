-- Seed Ministries for RCCG SODP
-- Run this in your Supabase SQL Editor to populate ministry data

-- First, clear existing ministries (optional - comment out if you want to keep existing data)
-- DELETE FROM ministries;

-- Insert RCCG SODP Ministries
INSERT INTO ministries (name, slug, description, category, schedule) VALUES 
(
  'The Excellent Men',
  'the-excellent-men',
  'Who Are We?
The men fellowship, otherwise known as the Excellent Men Fellowship is the group of married men in the church. The Objective of the Men''s Ministry of RCCG SODP is twofold:

1. To encourage and motivate spiritual growth among the men, teaching them to be spiritual leaders and moral examples in their homes and the society.

2. Fostering friendship and unity among the men in order to access/gather resources for the uplifting and encouragement of anyone facing spiritual, material or financial challenges.

We sincerely urge and encourage all men both young and old to be our guest and ultimately be an integral part of this fellowship.

Scripture: "For I know him, that he will command his children and his household after him, and they shall keep the way of the LORD, to do justice and judgment; that the LORD may bring upon Abraham that which he hath spoken of him" - Genesis 18:19.',
  'Fellowship',
  'Every third Sunday immediately after church service'
),
(
  'Sisters of Grace',
  'sisters-of-grace',
  'Who Are We?
Sisters of Grace Fellowship (SOGF) is the Women''s ministry of the RCCG Sanctuary of Double Perfection is called has a central focus of meeting the everyday practical, emotional and spiritual need of today''s woman whether they are members or non-members of SODP.

We meet this main objective by:
1. Loving one another unconditionally and relating to each other as sisters of the same Father as commanded - John 13:34.
2. Holding regular monthly prayer meetings every third Saturday of the month with women of all ages and backgrounds.
3. Having periodic women programs with special female guest ministers.
4. Conducting quarterly food drive (for the homeless shelters) programs and visiting the nursing homes within our immediate environment.

We welcome every woman young and old to our midst and assure you that you will be glad you did!

Scripture: "Your beauty should not come from outward adornment, such as elaborate hairstyles and the wearing of gold jewelry or fine clothes. Rather, it should be that of your inner self, the unfading beauty of a gentle and quiet spirit, which is of great worth in God''s sight" - 1 Peter 3:3-4.',
  'Fellowship',
  'Every third Saturday of the month'
),
(
  'Youth Aflame',
  'youth-aflame',
  'Who Are We?
The RCCG SODP Youth and Singles ministry is a group of blessed, passionate, God-fearing, Christ-emulating, and service-oriented teenagers, young adults, and working professionals who have genuine love for the Lord and people, which we demonstrate by continually striving to live our lives in total service, worship, and surrender to God through His Church.

We come together to have fellowship by various means:
1. Fit for Christ - This comes up every first Saturday of the month where all youths in the church and the neighborhood run around the lake to keep fit for the Master''s use.
2. Sunday Evening - We play soccer with other youths every Sunday evening at the Lakeland Park.
3. Meeting Time - We hold our meetings every first Saturday to pray and to prepare for the Youth Sunday service which takes place every third Sunday of the month.

We welcome every young adult to our meetings because we are on fire for God and we believe that by the grace of God we will repossess this land for God in the mighty name of Jesus Christ, AMEN.

Scripture: "Let no one despise your youth, but be an example to the believers in word, in conduct, in love, in spirit, in faith, in purity" - 1 Timothy 4:12.',
  'Youth',
  'Every first Saturday of the month; Youth Sunday every third Sunday'
),
(
  'Perfection Kids',
  'perfection-kids',
  'Who Are We?
The Children''s Ministry of the RCCG SODP is a fun, loving and engaging atmosphere that your children will love to be part of and also love to come back to.

We have a separate whole unit for the children where they have their own service, play their games, learn about the Lord Jesus Christ and the victory they have through Him (all in kiddie language of course!!!) at the same time.

We also have outdoor activities and field trips (quarterly and during the vacation).

We join other kids in RCCGNA to celebrate the children annually, every July.

We encourage all parents to have their kids visit SODP once and guarantee they''ll want to come back!

Scripture: Jesus said, "Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these" - Matthew 19:14.',
  'Children',
  'Every Sunday during service'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  schedule = EXCLUDED.schedule;
