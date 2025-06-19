import nodemailer from "nodemailer"
import { env } from "./env.config"


const transport=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:env.EMAIL,
        pass:env.PASS_KEY

    }
})

export default transport