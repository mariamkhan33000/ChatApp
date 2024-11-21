import express from 'express'
import authRoute from './routes/authRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectedDb } from './lib/db.js'
dotenv.config()
const app = express()

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoute)
app.use("/api/message", messageRoutes)

app.listen(PORT, () => {
    console.log(`The Server is running on this ${PORT}`)
    connectedDb()
})