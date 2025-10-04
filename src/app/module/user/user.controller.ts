/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";

const createUser = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{

    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user
    })

        
})

export const UserControllers = {
    createUser
}