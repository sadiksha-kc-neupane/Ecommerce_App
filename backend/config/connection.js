import dotenv from "dotenv"
dotenv.config()
import { Sequelize } from "sequelize"

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      // rejectUnauthorized: true would validate the server cert, but this
      // hosting provider terminates TLS with a SELF-SIGNED certificate, so it
      // fails with "self-signed certificate in certificate chain". Proper
      // hardening is to supply the provider's CA via `ssl.ca` (not a blanket
      // `false`). Keeping `false` preserves connectivity; the residual risk is
      // an attacker who can MITM the DB host. Revisit with the real CA before
      // production.
      rejectUnauthorized: false,
    },
  },
  logging: false, // set to console.log if you want to see raw SQL queries
})