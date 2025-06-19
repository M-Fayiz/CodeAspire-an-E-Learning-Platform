import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import { dbConnect } from './config/db.config'
import {env} from './config/env.config'
import { errorHandler } from './middlewares/error-handling';
import { corsSetUp } from './config/cors.config';
import authRouter from './routers/authRouter';
import cookieParser from'cookie-parser'
dotenv.config()

const app= express()

// MIddlewares
app.use(cookieParser())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsSetUp))

// Routers 
app.use('/auth',authRouter)

// Error Handler
app.use(errorHandler)

const port=env.port
dbConnect()
app.listen(port,()=>{
    console.log('✅ Server  Running....')
})


 