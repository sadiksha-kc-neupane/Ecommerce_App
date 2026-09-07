import { sequelize } from "../config/connection.js"

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function migrate() {
  console.log("Starting blogs migration...")

  try {
    // 1. Add thumbnail column if not exists
    await sequelize.query(`
      ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "thumbnail" TEXT;
    `)
    console.log("Added thumbnail column")

    // 2. Add slug column if not exists
    await sequelize.query(`
      ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "slug" VARCHAR(255);
    `)
    console.log("Added slug column")

    // 3. Alter description to TEXT so long posts aren't truncated
    await sequelize.query(`
      ALTER TABLE "blogs" ALTER COLUMN "description" TYPE TEXT;
    `)
    console.log("Altered description to TEXT")

    // 4. Migrate category ENUM safely
    await sequelize.query(`
      DO $$
      BEGIN
        -- Create new enum type if not exists
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_blogs_category_new') THEN
          CREATE TYPE "enum_blogs_category_new" AS ENUM('buying-guides', 'tech-tips', 'announcements', 'news');
        END IF;
      END $$;
    `)

    // Alter column to new enum type with remapping
    await sequelize.query(`
      ALTER TABLE "blogs" ALTER COLUMN "category" DROP DEFAULT;
      
      ALTER TABLE "blogs" 
      ALTER COLUMN "category" TYPE "enum_blogs_category_new" 
      USING (
        CASE 
          WHEN category::text IN ('coding', 'science') THEN 'tech-tips'::enum_blogs_category_new
          WHEN category::text = 'politics' THEN 'news'::enum_blogs_category_new
          WHEN category::text IN ('buying-guides', 'tech-tips', 'announcements', 'news') THEN category::text::enum_blogs_category_new
          ELSE 'news'::enum_blogs_category_new
        END
      );

      DROP TYPE IF EXISTS "enum_blogs_category";
      ALTER TYPE "enum_blogs_category_new" RENAME TO "enum_blogs_category";
      ALTER TABLE "blogs" ALTER COLUMN "category" SET DEFAULT 'news';
    `)
    console.log("Migrated category enum to ('buying-guides', 'tech-tips', 'announcements', 'news')")

    // 5. Populate slug for existing rows
    const [rows] = await sequelize.query(`SELECT id, title, slug FROM "blogs" ORDER BY id ASC;`)
    const usedSlugs = new Set()

    for (const row of rows) {
      let baseSlug = generateSlug(row.title || `post-${row.id}`) || `post-${row.id}`
      let slug = baseSlug
      let counter = 1

      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      usedSlugs.add(slug)

      await sequelize.query(`UPDATE "blogs" SET "slug" = :slug WHERE id = :id;`, {
        replacements: { slug, id: row.id }
      })
    }
    console.log("Populated slugs for all existing blogs")

    // 6. Add UNIQUE constraint on slug if not exists
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'blogs_slug_key'
        ) THEN
          ALTER TABLE "blogs" ADD CONSTRAINT "blogs_slug_key" UNIQUE ("slug");
        END IF;
      END $$;
    `)
    console.log("Added UNIQUE constraint on slug")

    // Verify
    const [updatedBlogs] = await sequelize.query(`SELECT id, title, category, slug, thumbnail FROM "blogs";`)
    console.log("Migration complete! Updated blogs in DB:", updatedBlogs)

    process.exit(0)
  } catch (err) {
    console.error("Migration failed:", err)
    process.exit(1)
  }
}

migrate()
