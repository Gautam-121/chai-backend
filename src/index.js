import app from "./app.js"
import connectDB from "./db";

const port = process.env.PORT || 8081

process.on("uncaughtException", (err)=>{
  console.log("Shutting down server by Uncaught Exception error" , err)
  process.exit(1)
})


// Database Connection
connectDB()// return a Promise , so we handled by then and catch
  .then(()=>{
    const server = app.listen(port,()=>{
      `Server listening on port ${port}`
    })

    process.on("unhandledRejection", (err)=>{
      console.log("Error caught by Unhandled Promise Rejection" , err)
      server.close(()=>{
        process.exit(1)
      })
    })
  })
  .catch((err)=>{
    console.log("DATABASE CONNECTION FAILED", err)
  })













/*
import express from 'express'
const app = express()

// Database connectivity using iify (immediatly involked function)
(async()=>{
    try {
        await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR", error)
            throw error
        })

        app.listen(process.env.PORT , ()=>{
            console.log("App is listening on",process.env.PORT)
        })
    } catch (error) {
      console.error("Database Eroor",error)  
      throw err
    }
})()
*/