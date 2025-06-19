import { Request,Response,NextFunction } from "express";
import { HttpResponse } from "../const/error-message";
import { HttpStatus } from "../const/http-status";
import { HttpError } from "../utility/httpError";


export const errorHandler=(err:Error|HttpError,req:Request,res:Response,next:NextFunction)=>{
   

    let statusCode=HttpStatus.INTERNAL_SERVER_ERROR
    let message:string=HttpResponse.SERVER_ERROR

    if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  console.error('error from middleware',err);

  res.status(statusCode).json({ error: message });

}