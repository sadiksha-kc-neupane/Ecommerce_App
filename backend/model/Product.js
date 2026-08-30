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
    type: DataTypes.ENUM("smartboard", "desktop", "laptop", "components", "cctv", "printer_scanner", "networking"),
    allowNull: false,
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true,
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
  productImages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
}, {
  tableName: "products",
  timestamps: true,
})

export default Product