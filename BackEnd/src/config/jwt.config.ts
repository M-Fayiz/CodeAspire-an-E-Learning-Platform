import { env } from "./env.config"



export const JWT={
    ACCESS_TOKEN:env.ACCESS_TOKEN as string,
    REFRESH_TOKEN:env.REFRESH_TOKEN as string,
    ACCESS_TOKEN_EXPIRE:'15m',
    REFRESH_TOKEN_EXPIRE:'7'
}

