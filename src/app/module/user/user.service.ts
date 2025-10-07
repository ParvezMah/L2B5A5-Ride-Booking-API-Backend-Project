/* eslint-disable @typescript-eslint/no-unused-vars */
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role, UserStatus } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { JwtPayload } from "jsonwebtoken";
import { Driver } from "../driver/driver.model";
import { Ride } from "../ride/ride.model"


const createUser = async (payload: Partial<IUser>) => {
  const { email, password, role, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    isApproved: true,
    ...rest,
    role: role ?? Role.RIDER
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find();

    const totalUsers = await User.countDocuments();

    return{
        data: users,
        meta: {
            total : totalUsers
        }
    };
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
  const ifUserExist = await User.findById(userId);
  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  // Role update restrictions
  if (payload.role) {
    if ([Role.RIDER, Role.DRIVER].includes(decodedToken.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change roles"
      );
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to assign SUPER_ADMIN"
      );
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        ...payload,
      },
    },
    { new: true, runValidators: true }
  );

  if (!newUpdatedUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user"
    );
  }

  return newUpdatedUser;
}

const getMe = async (userId: string) => {
  const user = await User.findById(userId)
    .select("-password")
  return {
    data: user,
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }
  return user;
};

 const getAdminStatsService = async () => {
  // 1) Totals for users/drivers
  const [totalUsers, totalDrivers] = await Promise.all([
    User.countDocuments({ role: { $ne: "ADMIN" } }), // optionally exclude admins
    Driver.countDocuments({}), // or User.countDocuments({ role: "DRIVER" })
  ]);

  // 2) Total rides and revenue
  const ridesAgg = await Ride.aggregate([
    {
      $group: {
        _id: null,
        totalRides: { $sum: 1 },
        totalRevenue: { $sum: { $ifNull: ["$fare", 0] } },
        completedRides: { $sum: { $cond: [{ $eq: ["$rideStatus", "COMPLETED"] }, 1, 0] } },
      },
    },
  ]);

  const totalRides = ridesAgg[0]?.totalRides ?? 0;
  const totalRevenue = ridesAgg[0]?.totalRevenue ?? 0;
  const completedRides = ridesAgg[0]?.completedRides ?? 0;

  // 3) Rides by status
  const ridesByStatusArr = await Ride.aggregate([
    {
      $group: {
        _id: "$rideStatus",
        count: { $sum: 1 },
      },
    },
  ]);
  const ridesByStatus: Record<string, number> = {};
  ridesByStatusArr.forEach((r) => {
    ridesByStatus[r._id] = r.count;
  });

  // 4) Monthly rides & revenue trends (last 12 months)
  const now = new Date();
  const lastYear = new Date(now.getFullYear(), now.getMonth() - 11, 1); // start from month-11

  const monthlyAgg = await Ride.aggregate([
    {
      $match: {
        createdAt: { $gte: lastYear },
      },
    },
    {
      $project: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        fare: { $ifNull: ["$fare", 0] },
      },
    },
    {
      $group: {
        _id: { year: "$year", month: "$month" },
        rides: { $sum: 1 },
        revenue: { $sum: "$fare" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // convert aggregation into continuous last-12-months array with month labels
  const monthLabels: { month: string; year: number; key: string }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthLabels.push({
      month: d.toLocaleString("en", { month: "short" }),
      year: d.getFullYear(),
      key: `${d.getFullYear()}-${d.getMonth() + 1}`,
    });
  }

  const monthlyMap: Record<string, { rides: number; revenue: number }> = {};
  monthlyAgg.forEach((m) => {
    const key = `${m._id.year}-${m._id.month}`;
    monthlyMap[key] = { rides: m.rides, revenue: m.revenue };
  });

  const monthlyRides = monthLabels.map((lbl) => {
    const monthNum = lbl.year + "-" + (new Date(`${lbl.month} 1`).getMonth() + 1);
    // better key construction:
    const key = `${lbl.year}-${new Date(`${lbl.month} 1`).getMonth() + 1}`;
    const found = monthlyMap[key] ?? { rides: 0, revenue: 0 };
    return { month: `${lbl.month} ${lbl.year}`, rides: found.rides };
  });

  const revenueTrends = monthLabels.map((lbl) => {
    const key = `${lbl.year}-${new Date(`${lbl.month} 1`).getMonth() + 1}`;
    const found = monthlyMap[key] ?? { rides: 0, revenue: 0 };
    return { month: `${lbl.month} ${lbl.year}`, revenue: found.revenue };
  });

  // 5) Top drivers by earnings (sum of fares for rides they completed)
  const topDriversAgg = await Ride.aggregate([
    { $match: { driver: { $exists: true, $ne: null }, rideStatus: "COMPLETED" } },
    {
      $group: {
        _id: "$driverId",
        ridesCount: { $sum: 1 },
        earnings: { $sum: { $ifNull: ["$fare", 0] } },
      },
    },
    { $sort: { earnings: -1 } },
    { $limit: 10 },
    // populate driver fields by $lookup
    {
      $lookup: {
        from: "users", // collection name
        localField: "_id",
        foreignField: "_id",
        as: "driverInfo",
      },
    },
    {
      $unwind: { path: "$driverInfo", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        driverId: "$_id",
        ridesCount: 1,
        earnings: 1,
        driverName: "$driverInfo.name",
        driverEmail: "$driverInfo.email",
        picture: "$driverInfo.picture",
      },
    },
  ]);

  // 6) Active drivers count (online now)
  const activeDriversCount = await Driver.countDocuments({ onlineStatus: true });

  // 7) Recent driver activity (last 7 days) — number of rides per day
  const last7 = new Date();
  last7.setDate(now.getDate() - 6);
  last7.setHours(0, 0, 0, 0);

  const last7Agg = await Ride.aggregate([
    { $match: { createdAt: { $gte: last7 } } },
    {
      $project: {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      },
    },
    {
      $group: {
        _id: "$day",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const recentDriverActivity = last7Agg.map((d) => ({ date: d._id, rides: d.count }));

  return {
    totalUsers,
    totalDrivers,
    totalRides,
    completedRides,
    totalRevenue,
    ridesByStatus,
    monthlyRides,
    revenueTrends,
    topDrivers: topDriversAgg,
    activeDriversCount,
    recentDriverActivity,
  };
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  if (!Object.values(UserStatus).includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user status value");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  user.status = status;
  await user.save();
  return user;
};


export const UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    getMe,
    getSingleUser,
    getAdminStatsService,
    updateUserStatus
}