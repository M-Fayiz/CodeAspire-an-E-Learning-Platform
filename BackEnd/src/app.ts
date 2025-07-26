import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import { dbConnect } from './config/db.config'
import {env} from './config/env.config'
import { errorHandler } from './middlewares/error-handling';
import { corsSetUp } from './config/cors.config';
import authRouter from './routers/auth.router';
import cookieParser from'cookie-parser'
import session from 'express-session'
import passport  from 'passport';
import userRouter from './routers/user.router';
import adminRouter from './routers/adminRouter';
import categoryRouter from './routers/category.router';
import courseRouter from './routers/courses.router';
dotenv.config()

const app= express()
const secrete=env.SESSION_SECRET as string
// MIddlewares
app.use(cookieParser())
app.use(morgan("dev")) //morgan
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret:secrete,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors(corsSetUp))

// Routers 
app.use('/auth',authRouter)
app.use('/users',userRouter)
app.use('/admin',adminRouter)
app.use('/categories',categoryRouter)
app.use('/courses',courseRouter)


// Error Handler
app.use(errorHandler)

const port=env.port
dbConnect()
app.listen(port,()=>{
    console.log('✅ Server  Running....')
})


 