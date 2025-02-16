import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { PrismaClient } from "@prisma/client";
import { CryptoService } from "../services/crypto.service";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { loginGuestValidator } from "../utils/validators/auth.util";

const router = Router();

const prisma = new PrismaClient();

const userService = new UserService(
    prisma
);

const authService = new AuthService();
const cryptoService = new CryptoService();

const authMiddleware = new AuthMiddleware(
    userService,
    cryptoService,
    authService
)
const authController = new AuthController(
    authService,
    userService,
    cryptoService
);

// Middleware




router.post('/guest', loginGuestValidator(), validateRequest, authController.loginGuest);
router.get('/me', authMiddleware.validateMulti, authController.me);

export const authRouters = router;