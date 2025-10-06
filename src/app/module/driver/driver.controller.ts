/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { IDriver } from "./driver.interface";
import { DriverServices } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";


// Apply as Driver (for RIDERs)
const applyAsDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JwtPayload;

  // const payload =  {
  //   ...req.body,
  //   drivingLicense: req.file?.path,
  // }
  const payload:IDriver = {
 userId: user.userId,
  vehicle: {
    vehicleNumber: req.body.vehicle.vehicleNumber,
    vehicleType: req.body.vehicle.vehicleType,
  },
  location: {
    type: "Point",
    coordinates: req.body.location.coordinates || [90.4125, 23.8103]
  },
  drivingLicense: req.file?.path,
};


  console.log(payload)

  const result = await DriverServices.applyAsDriver(user, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver application submitted successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const driver = req.user as JwtPayload;

  // console.log(driver)

  const result = await DriverServices.getMyProfile(driver.userId);

  // console.log(result)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver profile retrieved successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const driver = req.user as JwtPayload;
  const result = await DriverServices.updateMyProfile(driver.userId, req.body);
console.log(result)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver profile updated successfully",
    data: result,
  });
});

const getAllDrivers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
  const result = await DriverServices.getAllDrivers(query as Record<string, string>);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All drivers retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const result = await DriverServices.getSingleDriver(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver retrieved successfully",
    data: result,
  });
});


const approveDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const driverId = req.params.id;
  console.log("driverId : ", driverId);

  const result = await DriverServices.approveDriver(driverId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver approved and role updated successfully",
    data: result,
  });
});


const suspendDriver = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.params.id;
  const result = await DriverServices.suspendDriver(driverId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver suspended successfully',
    data: result,
  });
});

const updateDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await DriverServices.updateDriver(id, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver updated successfully",
    data: result,
  });
});







export const DriverControllers = {
    applyAsDriver,
    getMyProfile,
    updateMyProfile,
    getAllDrivers,
    getSingleDriver,
    approveDriver,
    suspendDriver,
    updateDriver
}