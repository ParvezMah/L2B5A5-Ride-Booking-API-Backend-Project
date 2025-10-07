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

  const result = await DriverServices.getMyProfile(driver.userId);


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

const updateOnlineStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const driverId = req.params.id;
  const { onlineStatus } = req.body;

  const updatedDriver = await DriverServices.updateOnlineStatus(driverId, onlineStatus);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver online status updated successfully",
    data: updatedDriver,
  });
});

const updateLocation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const driverId = req.params.id;

  const updatedDriver = await DriverServices.updateLocation(driverId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver location updated successfully",
    data: updatedDriver,
  });
});

const updateRidingStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const driverId = req.params.id;
  const { ridingStatus } = req.body;

  const updatedDriver = await DriverServices.updateRidingStatus(driverId, ridingStatus);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Driver riding status updated successfully",
    data: updatedDriver,
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
    updateDriver,
    updateOnlineStatus,
    updateLocation,
    updateRidingStatus
}