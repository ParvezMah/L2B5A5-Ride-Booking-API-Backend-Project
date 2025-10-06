/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req:Request, res:Response, next:NextFunction)=>{

    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user
    })   
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {

  const result = await UserServices.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Users Retrieved Successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const verifiedToken = req.user;

  const payload = req.body;

  console.log(userId, verifiedToken, payload);

  const user = await UserServices.updateUser(
    userId,
    payload,
    verifiedToken as JwtPayload
  );
  console.log("Updated user data : ", user)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Updated Successfully",
    data: user
  });

});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const result = await UserServices.getMe(decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your profile Retrieved Successfully",
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})

 const getAdminStatsController = catchAsync (async (req: Request, res: Response, next: NextFunction) => {

    const stats = await UserServices.getAdminStatsService();
    console.log(stats)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin analytics fetched successfully",
    data:stats,
  });
})

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedUser = await UserServices.updateUserStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User status updated to ${status}`,
    data: updatedUser,
  });
});









export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
    getMe,
    getSingleUser,
    getAdminStatsController,
    updateUserStatus
}