import { User } from "../model/index.js"

// GET /fetch-users
export const fetchUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" })
  }
  const datas = await User.findAll({
    attributes: { exclude: ["password"] },
  })
  res.json({ data: datas })
}

// GET /fetch-single/:id
export const fetchSingle = async (req, res) => {
  const id = req.params.id
  const data = await User.findAll({
    where: { id },
    attributes: { exclude: ["password"] },
  })
  res.send(data)
}

// PATCH /update-users/:id
export const editUser = async (req, res) => {
  const id = req.params.id
  const { username, password, email } = req.body

  await User.update(
    {
      username,
      password, // consider hashing this before saving if it's being changed
      email,
    },
    { where: { id } }
  )
  res.send("update sucessfully")
}

// DELETE /delete-user/:id
export const deleteUser = async (req, res) => {
  const id = req.params.id
  await User.destroy({ where: { id } })
  res.send("deleted sucessfully")
}