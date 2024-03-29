import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
        console.log("MongoDB connected on host: ", connectionInstance.connection.host)
    } catch (error) {
        console.error('MongoDB Connection Failed', error)
        process.exit(1)
    }
}

export default connectDB