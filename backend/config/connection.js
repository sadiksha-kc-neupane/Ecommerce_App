import dotenv from "dotenv"
dotenv.config()
import { Sequelize } from "sequelize"

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false, // set to console.log if you want to see raw SQL queries
})