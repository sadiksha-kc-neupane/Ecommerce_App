import { connectDB } from "../config/index.js"
import { User } from "../model/index.js"
import bcrypt from "bcrypt"

const targetEmail = process.argv[2]?.trim().toLowerCase()
const password = process.argv[3]?.trim()

if (!targetEmail) {
  console.log("Usage: node scripts/set-admin.js <email> [optional-new-password]")
  process.exit(1)
}

async function run() {
  await connectDB()

  let user = await User.findOne({ where: { email: targetEmail } })

  if (user) {
    user.role = "admin"
    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }
    await user.save()
    console.log(`\n✅ Success: User '${targetEmail}' has been promoted to 'admin'!`)
  } else {
    if (!password) {
      console.log(`\n❌ User '${targetEmail}' does not exist in DB. Provide a password to create:`)
      console.log(`node scripts/set-admin.js ${targetEmail} <password>`)
      process.exit(1)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user = await User.create({
      username: targetEmail.split("@")[0],
      email: targetEmail,
      password: hashedPassword,
      role: "admin",
    })
    console.log(`\n✅ Success: New Admin account '${targetEmail}' created with role 'admin'!`)
  }

  process.exit(0)
}

run().catch((err) => {
  console.error("Error setting admin:", err.message)
  process.exit(1)
})
