import { Response } from "express";

export const clearCookies=(res:Response)=>{
    const options={
        httpOnly: true,
        secure: false,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' as 'none' : 'lax' as 'lax',
        domain: undefined,
        path: '/',
    }

    res.clearCookie('accessToken',options)
    res.clearCookie('refreshToken',options)
}

 
    
  
  
  