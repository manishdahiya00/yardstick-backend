import logger from "../config/logger";
import jwt from "jsonwebtoken";
import { findUserById } from "../services/user.service";
import { ENV } from "../config/env";
export const authenticateUser = async (req, res, next) => {
    try {
        let rawToken;
        if (req.cookies?.jwt) {
            rawToken = req.cookies.jwt;
        }
        else if (req.headers.authorization?.startsWith("Bearer ")) {
            rawToken = req.headers.authorization.split(" ")[1];
        }
        if (!rawToken) {
            return res.status(401).json({
                success: false,
                message: "Session Expired. Login again",
            });
        }
        const authToken = jwt.verify(rawToken, ENV.JWT_SECRET);
        if (!authToken) {
            res.status(401).json({
                success: false,
                message: "Session Expired. Login again",
            });
            return;
        }
        const validUser = await findUserById(authToken.id);
        if (!validUser) {
            res.status(401).json({
                success: false,
                message: "Session Expired. Login again",
            });
            return;
        }
        req.user = validUser;
        next();
    }
    catch (error) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
