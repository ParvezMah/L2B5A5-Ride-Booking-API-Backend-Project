import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { JwtPayload } from "jsonwebtoken";


const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

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



export const UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    getMe
}