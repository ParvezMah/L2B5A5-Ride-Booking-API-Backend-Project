"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./app/config/env");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.envVars.FRONTEND_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.set("trust proxy", 1);
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// app.use(passport.initialize())
// app.use(passport.session())
// app.use(expressSession({
//     secret : envVars.EXPRESS_SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }))
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Our Organized Ride Booking API"
    });
});
// Global Error Handler
app.use(globalErrorHandler_1.globalErrorHandler);
// Route Not Found
app.use(notFound_1.default);
exports.default = app;
