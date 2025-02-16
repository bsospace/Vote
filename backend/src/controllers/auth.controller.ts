import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { envConfig } from "../config/config";
import { UserEx } from "../middlewares/auth.middleware";
import { CryptoService } from "../services/crypto.service";

export class AuthController {

    private authService: AuthService;
    private userService: UserService;
    private cryptoService: CryptoService;

    constructor(authService: AuthService, userService: UserService, crypto: CryptoService) {
        this.authService = authService;
        this.userService = userService;
        this.cryptoService = crypto

        // Bind methods to preserve `this` context
        this.loginGuest = this.loginGuest.bind(this);
        this.me = this.me.bind(this);
    }

    public async me(req: Request, res: Response): Promise<any> {
        try {
            const user = req.user as UserEx
            return res.json({
                success: true,
                message: 'Get my user info successful',
                data: user
            });

        } catch (error) {
            // Pass unexpected errors to the next middleware (e.g., error handler)
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "An unexpected error occurred",
            });
        }
    }

    /**
     * Handles user login requests.
     * @param req - Express Request object
     * @param res - CustomResponse object extended with custom methods
     * @param next - Express NextFunction for error handling
     */
    public async loginGuest(req: Request, res: Response): Promise<any> {
        try {

            const { key } = req.body;

            // get guest by key
            const user = await this.userService.getGuestByKey(key);

            if (!user || user.deletedAt !== null) {
                return res.status(401).json({
                    success: false,
                    message: "Login failed",
                    error: "Invalid key",
                });
            }

            // Return the access token

            const formatUser = {
                ...user,
                guest: true
            }

            const accessToken = this.cryptoService.generateAccessToken(formatUser, envConfig.app.serviceName, true);

            // Return the user object
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    id: user.id,
                    guest: true,
                    firstName: user.name,
                    lastName: user.name,
                    email: `${user.name}@${envConfig.app.serviceName}.bsospace.com`,
                    avatar: ''
                },
                credentials: {
                    accessToken
                }
            });

        } catch (error) {
            // Pass unexpected errors to the next middleware (e.g., error handler)
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "An unexpected error occurred",
            });
        }
    }
}