import dotenv from 'dotenv'

dotenv.config()

const envConfig = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '9d',
    databaseUrl: process.env.DATABASE_URL,
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development'
}

export default envConfig