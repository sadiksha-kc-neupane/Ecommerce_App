import { DataTypes } from "sequelize"
import { sequelize } from "../config/connection.js"

const Blog = sequelize.define("Blog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // set this if you want to track who wrote it
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  subtitle: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  category: {
    // NOTE: your original had "59" as a value here, which looks like a typo.
    // Replace with your real category names.
    type: DataTypes.ENUM("politics", "tech", "coding"),
    defaultValue: "coding",
  },
}, {
  tableName: "blogs",
  timestamps: true,
})

export default Blog