import { sequelize } from "../config/connection.js"

async function run() {
  try {
    const [cols] = await sequelize.query(`
      SELECT column_name, data_type, udt_name, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'blogs'
      ORDER BY ordinal_position;
    `)
    console.log("Blogs columns:", cols)

    const [blogs] = await sequelize.query(`SELECT * FROM blogs;`)
    console.log("All blogs in DB:", JSON.stringify(blogs, null, 2))

    process.exit(0)
  } catch (err) {
    console.error("Error:", err)
    process.exit(1)
  }
}

run()
