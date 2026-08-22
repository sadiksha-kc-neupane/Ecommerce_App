import { DataTypes } from "sequelize"
import { sequelize } from "../config/connection.js"

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // one cart per user
  },
}, {
  tableName: "carts",
  timestamps: true,
})

export default Cart