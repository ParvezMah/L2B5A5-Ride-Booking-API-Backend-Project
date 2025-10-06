"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../module/user/user.model");
const user_interface_1 = require("../module/user/user.interface");
const seedSuparAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuparAdmin = yield user_model_1.User.findOne({
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
        });
        if (isSuparAdmin) {
            console.log("Super Admin Seeded Already!");
            return;
        }
        const hasedPassword = yield bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const authProvider = {
            provider: "credentials",
            providerId: env_1.envVars.SUPER_ADMIN_EMAIL,
        };
        const payload = {
            name: "Supar Admin",
            role: user_interface_1.Role.SUPER_ADMIN,
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            password: hasedPassword,
            isApproved: true,
            auths: [authProvider],
            currentLocation: {
                type: "Point",
                coordinates: [90.3675, 23.7465],
            },
        };
        yield user_model_1.User.create(payload);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = seedSuparAdmin;
