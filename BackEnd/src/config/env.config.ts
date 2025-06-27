import dotenv from 'dotenv'
dotenv.config()

export  const env={
    get port(){
        return process.env.Port
    },
    get MONGO_URL(){
        return process.env.DBMS
    },
    get CLIENT_ORGIN(){
        return process.env.client_Orgin
    },
    get EMAIL(){
        return process.env.Email
    },
    get PASS_KEY(){
        return process.env.passKey
    },
    get ACCESS_TOKEN(){
        return process.env.ACCESS_TOKEN
    },
    get REFRESH_TOKEN(){
        return process.env.REFRESH_TOKEN
    },
    get CLIENT_ID(){
        return process.env.CLIENT_ID
    },
    get CLIENT_SECRET(){
        return process.env.CLIENT_SECRET
    },
    get CALLBACK_URL(){
        return process.env.CALLBACK_URL
    },
    get SESSION_SECRET(){
        return process.env.SESSION_SECRET
    }

}