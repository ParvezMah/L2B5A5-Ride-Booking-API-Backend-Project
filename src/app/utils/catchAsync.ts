/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";


// It contains try-block code
type AsyncHandler = (req:Request, res:Response, next:NextFunction)=> Promise<void>


// It cathches a function then do catch-block code
export const catchAsync = (fn: AsyncHandler)=> (req:Request, res:Response, next:NextFunction)=> {
    Promise.resolve(fn(req, res, next)).catch((err:any)=>{
        next(err)
    })
}