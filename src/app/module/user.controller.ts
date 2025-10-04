import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";

const creatUser = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{
    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user
    })

        
})

export const UserControllers = {

}