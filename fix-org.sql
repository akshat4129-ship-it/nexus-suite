INSERT INTO organizations (id, clerk_org_id, name, slug, updated_at)
VALUES (
  gen_random_uuid(),
  'org_3B2th1HzGZj6kD4WRCqUMfG8tLr',
  'My Agency',
  'my-agency',
  NOW()
);

UPDATE users
SET org_id = (
  SELECT id FROM organizations WHERE clerk_org_id = 'org_3B2th1HzGZj6kD4WRCqUMfG8tLr'
)
WHERE org_id IS NULL;
