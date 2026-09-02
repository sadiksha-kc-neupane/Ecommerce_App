import bcrypt from "bcrypt"
import { User } from "../model/index.js"

// GET /fetch-users  (admin-only; enforced by requireRole("admin") on the route)
export const fetchUser = async (req, res) => {
  const datas = await User.findAll({
    attributes: { exclude: ["password"] },
  })
  res.json({ data: datas })
}

// GET /fetch-single/:id
// A user may only read their own profile; admins may read anyone's.
export const fetchSingle = async (req, res) => {
  const id = req.params.id
  const isOwner = String(id) === String(req.user.id)
  const isAdmin = req.user.role === "admin"

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not authorized" })
  }

  try {
    const data = await User.findAll({
      where: { id },
      attributes: { exclude: ["password"] },
    })
    return res.send(data)
  } catch (error) {
    console.error("fetchSingle error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// PATCH /update-users/:id
// A user can only edit their own account (id must match the token's id).
// If a password is supplied it is hashed before saving (never plaintext).
export const editUser = async (req, res) => {
  const id = req.params.id
  const userId = req.user.id
  const { username, password, email } = req.body

  if (String(id) !== String(userId)) {
    return res.status(403).json({ message: "Not authorized to edit this account" })
  }

  const updates = { username, email }
  if (password) {
    // async variant — hashSync blocks the event loop (same hardening as authController.js)
    updates.password = await bcrypt.hash(password, 10)
  }

  try {
    const [updatedRows] = await User.update(updates, { where: { id: userId } })
    if (updatedRows === 0) {
      return res.status(404).json({ message: "User not found" })
    }
    return res.json({ message: "update sucessfully" })
  } catch (error) {
    console.error("editUser error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// DELETE /delete-user/:id
// Admin-only: no regular user may delete another account.
export const deleteUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" })
  }

  try {
    const deleted = await User.destroy({ where: { id: req.params.id } })
    if (deleted === 0) {
      return res.status(404).json({ message: "User not found" })
    }
    return res.json({ message: "deleted sucessfully" })
  } catch (error) {
    console.error("deleteUser error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}