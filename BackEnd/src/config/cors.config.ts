import { env } from "./env.config"

export  const corsSetUp ={
    origin:env.CLIENT_ORGIN,
     credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'], 
       allowedHeaders: ['Content-Type', 'Authorization'],
       exposedHeaders: ['Authorization'],
}