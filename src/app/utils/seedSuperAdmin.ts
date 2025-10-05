import { envVars } from "../config/env";
import bcryptjs from "bcryptjs";
import { User } from "../module/user/user.model";
import { IAuthProvider, IUser, Role } from "../module/user/user.interface";

const seedSuparAdmin = async () => {
  try {
    const isSuparAdmin = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuparAdmin) {
      console.log("Super Admin Seeded Already!");
      return;
    }
    const hasedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Supar Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hasedPassword,
      isApproved: true,
      auths: [authProvider],
      currentLocation: {
        type: "Point",
        coordinates: [90.3675, 23.7465],
      },
    };

    await User.create(payload);
    console.log("user from suparadmin");
  } catch (error) {
    console.log(error);
  }
};

export default seedSuparAdmin;
