import { DataTypes } from "sequelize"
import { sequelize } from "../config/connection.js"

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM("electronics", "materials", "agriculture", "cosmetics"),
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("in_stock", "out_of_stock", "discontinued"),
    defaultValue: "in_stock",
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "products",
  timestamps: true,
})

export default Product