import mongoose from 'mongoose'

export const connectedDb = async (req, res) => {
    try {
        await mongoose.connect(process.env.LOCAL_MONGO)
        console.log(`Mongoose is connected: ${mongoose.connection.host}`)
    } catch (error) {
        console.log(`Mongodb connection error`, error)
    }
}