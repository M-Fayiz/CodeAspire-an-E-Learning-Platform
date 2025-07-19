import { Response } from "express"

export const setAccessToken=(res:Response,token:string)=>{
    res.cookie('accessToken',
        token,
        {
            httpOnly: true,
            secure: false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
            domain: undefined,
            maxAge: 15* 60 * 1000,
            path: '/',
        }
    )
}

export const setRefreshToken=(res:Response,token:string)=>{
    res.cookie('refreshToken',
        token,
        {
            httpOnly: true,
            secure: false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
            domain: undefined,
            maxAge:  7 * 24 * 60 * 60 * 1000,
            path: '/',
        }
    )
}