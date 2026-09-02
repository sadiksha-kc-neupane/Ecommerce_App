import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../model/index.js"
import envConfig from "../config/env.js"
import { sendOtpEmail } from "../lib/mailer.js"

// POST /register
export const registerUser = async (req, res) => {
  const { username, password, email, role } = req.body

  if (!username || !password || !email) {
    return res.status(400).json({ message: "username, email, and password are required" })
  }

  // All public users register as customer. Admin is pre-configured/elevated.
  const finalRole = "customer"

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email: email.toLowerCase().trim(),
      role: finalRole,
    })

    // don't send the hashed password back
    const { password: _pw, ...safeUser } = newUser.toJSON()

    return res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    })
  } catch (error) {
    // A unique-constraint violation means the email (or username) is already
    // taken — surface that as a 409 Conflict, not a generic 500.
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Email is already registered" })
    }
    console.error("Failed to register", error)
    return res.status(500).json({
      message: "Failed to register user",
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

    // H2 — never reveal whether the email exists: an unknown email and a wrong
    // password must produce the exact same response (message + 401) so the
    // endpoint can't be used to enumerate registered accounts.
    const isMatched =
      data && (await bcrypt.compare(password, data.password))

    if (!data || !isMatched) {
      return res.status(401).json({ message: "Invalid email or password" })
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

// POST /auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: "email is required" })
  }

  try {
    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ where: { email: normalizedEmail } })

    // Anti-enumeration security: If user exists, generate & send 4-digit OTP; otherwise do nothing.
    // In both cases, return the exact same generic success message.
    if (user) {
      // 4-digit OTP code (e.g. 2099)
      const otp = Math.floor(1000 + Math.random() * 9000).toString()
      const resetOtpHash = await bcrypt.hash(otp, 10)
      const resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      user.resetOtpHash = resetOtpHash
      user.resetOtpExpiry = resetOtpExpiry
      await user.save()

      try {
        await sendOtpEmail(user.email, otp)
      } catch (mailError) {
        console.error("sendOtpEmail error:", mailError.message)
      }
    }

    return res.status(200).json({
      message: "If that email is registered, a 4-digit verification code has been sent.",
    })
  } catch (error) {
    console.error("forgotPassword error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// POST /auth/verify-otp
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    return res.status(400).json({ message: "email and otp are required" })
  }

  try {
    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ where: { email: normalizedEmail } })

    const isExpired = !user || !user.resetOtpExpiry || new Date() > new Date(user.resetOtpExpiry)
    const isMatch = user && user.resetOtpHash && (await bcrypt.compare(String(otp).trim(), user.resetOtpHash))

    if (!user || isExpired || !isMatch) {
      return res.status(400).json({ message: "Invalid or expired verification code" })
    }

    // Clear the OTP fields so it cannot be reused
    user.resetOtpHash = null
    user.resetOtpExpiry = null
    await user.save()

    // Sign a password_reset token for changing password
    const resetToken = jwt.sign(
      { id: user.id, purpose: "password_reset" },
      envConfig.jwtSecret || process.env.JWT_SECRET,
      { expiresIn: "15m" }
    )

    // Also provide regular login token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      envConfig.jwtSecret || process.env.JWT_SECRET,
      { expiresIn: envConfig.jwtExpiresIn || "9d" }
    )

    const { password: _pw, ...safeUser } = user.toJSON()

    return res.status(200).json({
      message: "OTP verified successfully",
      resetToken,
      token,
      data: safeUser,
    })
  } catch (error) {
    console.error("verifyOtp error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// POST /auth/reset-password
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: "resetToken and newPassword are required" })
  }

  try {
    let decoded
    try {
      decoded = jwt.verify(resetToken, envConfig.jwtSecret || process.env.JWT_SECRET)
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired reset token" })
    }

    if (decoded.purpose !== "password_reset") {
      return res.status(400).json({ message: "Invalid token purpose" })
    }

    const user = await User.findByPk(decoded.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    user.resetOtpHash = null
    user.resetOtpExpiry = null
    await user.save()

    return res.status(200).json({ message: "Password reset successful" })
  } catch (error) {
    console.error("resetPassword error:", error.message)
    return res.status(500).json({ message: "Something went wrong" })
  }
}