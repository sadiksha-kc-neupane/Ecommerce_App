import jwt from "jsonwebtoken"
import envConfig from "../config/env.js"

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers?.authorization

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1] 

    try {
        // secret now comes from .env instead of being hardcoded
        const decoded = jwt.verify(token, envConfig.jwtSecret)
        req.user = decoded // { id, role }
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}

// must run AFTER verifyToken so req.user is populated
export const requireRole = (...allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Not authorized for this action" })
    }
    next()
}







