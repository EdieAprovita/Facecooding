"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("@/controllers/authController"));
const auth_1 = require("@/middleware/auth");
const authValidators_1 = require("@/validators/authValidators");
const router = express_1.default.Router();
router.post("/register", authValidators_1.registerValidation, authController_1.default.register);
router.post("/login", authValidators_1.loginValidation, authController_1.default.login);
router.get("/me", auth_1.authenticate, authController_1.default.getMe);
router.put("/profile", auth_1.authenticate, authValidators_1.updateProfileValidation, authController_1.default.updateProfile);
router.put("/change-password", auth_1.authenticate, authValidators_1.changePasswordValidation, authController_1.default.changePassword);
router.delete("/account", auth_1.authenticate, authController_1.default.deleteAccount);
router.get("/stats", auth_1.authenticate, (0, auth_1.authorize)("admin"), authController_1.default.getUserStats);
router.get("/search", auth_1.authenticate, (0, auth_1.authorize)("admin"), authController_1.default.searchUsers);
exports.default = router;
//# sourceMappingURL=auth.js.map