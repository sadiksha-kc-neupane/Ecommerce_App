import { sequelize } from "./connection.js"

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log("SUPABASE connected via Sequelize")

    await sequelize.sync({ alter: true })
    console.log("Model SYNC complete")
  } catch (error) {
    console.error("DB CONNECTION FAILED:", error.message)
  }
}

export { sequelize, connectDB }