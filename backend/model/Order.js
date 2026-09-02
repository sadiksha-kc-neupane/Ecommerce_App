import { DataTypes } from "sequelize"
import { sequelize } from "../config/connection.js"

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: "unpaid",
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentScreenshot: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: "orders",
  timestamps: true,
})

export default Order