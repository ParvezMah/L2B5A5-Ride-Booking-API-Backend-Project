"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["RIDER"] = "RIDER";
    Role["DRIVER"] = "DRIVER";
})(Role || (exports.Role = Role = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["BLOCKED"] = "BLOCKED";
    UserStatus["UNBLOCKED"] = "UNBLOCKED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
