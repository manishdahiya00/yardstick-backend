import type { NextFunction, Request, Response } from "express";
import logger from "../config/logger.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { findUserById } from "../services/user.service.js";
import { ENV } from "../config/env.js";

export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        let rawToken: string | undefined;

        if (req.cookies?.jwt) {
            rawToken = req.cookies.jwt;
        } else if (req.headers.authorization?.startsWith("Bearer ")) {
            rawToken = req.headers.authorization.split(" ")[1];
        }
        if (!rawToken) {
            return res.status(401).json({
                success: false,
                message: "Session Expired. Login again",
            });
        }

        const authToken = jwt.verify(rawToken, ENV.JWT_SECRET!) as JwtPayload;

        if (!authToken) {
            res.status(401).json({
                success: false,
                message: "Session Expired. Login again",
            });
            return;
        }
        const validUser = await findUserById(authToken.id as string);

        if (!validUser) {
            res.status(401).json({
                success: false,
                message: "Session Expired. Login again",
            });
            return;
        }

        req.user = validUser;
        next();
    } catch (error: Error | any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
