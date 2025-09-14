import { inviteUserSchema, loginSchema } from "../validations/auth.validation";
import { formatZodError } from "../utils/zod.error";
import { findAllUsers, findTenantById, findTenantBySlug, findUserByEmail, inviteUser, updatePlan, updateRoleOfUser, } from "../services/user.service";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import logger from "../config/logger";
export const loginUser = async (req, res) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            const formattedError = formatZodError(result.error);
            return res
                .status(400)
                .json({ success: false, error: formattedError });
        }
        const existingUser = await findUserByEmail(result.data.email);
        if (!existingUser) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid email or password" });
        }
        const isPasswordValid = await verify(existingUser.password, result.data.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const token = jwt.sign({
            id: existingUser.id,
            role: existingUser.role,
            tenant: existingUser.tenantId,
        }, ENV.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                email: existingUser.email,
                name: existingUser.name,
                role: existingUser.role,
                tenantId: existingUser.tenantId,
            },
        });
        return;
    }
    catch (error) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};
export const logoutUser = (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
        return;
    }
    catch (error) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};
export const inviteNewUser = async (req, res) => {
    try {
        const role = req.user?.role;
        if (role !== "MANAGER") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action",
            });
        }
        console.log(role);
        const result = inviteUserSchema.safeParse(req.body);
        if (!result.success) {
            const formattedError = formatZodError(result.error);
            return res
                .status(400)
                .json({ success: false, error: formattedError });
        }
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: "Tenant ID is missing in the request",
            });
        }
        const existingUser = await findUserByEmail(result.data.email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }
        const hashedPass = await hash(result.data.password);
        await inviteUser(tenantId, result.data.name, result.data.email, hashedPass, result.data.role);
        res.status(200).json({
            success: true,
            message: "User added successfully",
        });
    }
    catch (error) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const allUsers = async (req, res) => {
    try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: "Tenant ID is missing in the request",
            });
        }
        const users = await findAllUsers(tenantId);
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const updateRole = async (req, res) => {
    try {
        const role = req.user?.role;
        if (role !== "MANAGER") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action",
            });
        }
        const { id } = req.params;
        const { role: newRole } = req.body;
        if (!["MEMBER", "MANAGER"].includes(newRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Role must be either MEMBER or MANAGER",
            });
        }
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: "Tenant ID is missing in the request",
            });
        }
        const user = await findUserByEmail(req.user?.email || "");
        if (!user || user.tenantId !== tenantId) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        await updateRoleOfUser(id, newRole);
        res.status(200).json({
            success: true,
            message: "User role updated successfully",
        });
    }
    catch (error) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const getTenant = async (req, res) => {
    try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            return res
                .status(400)
                .json({ success: false, message: "Tenant ID is required" });
        }
        const tenant = await findTenantById(tenantId);
        if (!tenant) {
            return res
                .status(404)
                .json({ success: false, message: "Tenant not found" });
        }
        res.status(200).json({ success: true, tenant });
    }
    catch (error) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const upgradePlan = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res
                .status(400)
                .json({ success: false, message: "Slug is required" });
        }
        const tenant = await findTenantBySlug(slug);
        if (tenant?.id !== req.user?.tenantId) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized action" });
        }
        if (!tenant) {
            return res
                .status(404)
                .json({ success: false, message: "Tenant not found" });
        }
        if (req.user?.role == "MEMBER") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action",
            });
        }
        if (tenant.plan === "PRO") {
            return res.status(400).json({
                success: false,
                message: "Tenant is already on PRO plan",
            });
        }
        await updatePlan(tenant.id);
        res.status(200).json({
            success: true,
            message: `Tenant upgraded to PRO plan`,
        });
    }
    catch (error) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
