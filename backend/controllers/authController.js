import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../model/index.js"
import envConfig from "../config/env.js"

// POST /register
export const registerUser = async (req, res) => {
  console.log(req.body)

  const { username, password, email } = req.body

  if (!username || !password || !email) {
    return res.status(400).json({ message: "username, email, and password are required" })
  }

  try {
    const newUser = await User.create({
      username,
      password: bcrypt.hashSync(password, 10),
      email,
    })

    // don't send the hashed password back
    const { password: _pw, ...safeUser } = newUser.toJSON()

    return res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    })
  } catch (error) {
    console.error("Failed to register", error)
    return res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    })
  }
}

// POST /login
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" })
  }

  try {
    const data = await User.findOne({ where: { email } })

    if (!data) {
      return res.status(400).json({ message: "email not registered" })
    }

    const isMatched = bcrypt.compareSync(password, data.password)
    if (!isMatched) {
      return res.status(400).json({ message: "invalid password" })
    }

    // token payload key is "id" now (not "userId") -- keep this consistent
    // with every controller that reads req.user.id after verifyToken
    const token = jwt.sign(
      { id: data.id, role: data.role },
      envConfig.jwtSecret,
      { expiresIn: envConfig.jwtExpiresIn }
    )

    const { password: _pw, ...safeUser } = data.toJSON()

    return res.status(200).json({
      message: "login is successful",
      token,
      data: safeUser,
    })
  } catch (error) {
    console.error("loginUser error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}