import createHttpError from "http-errors";
import db from "../config/db.js";
import logger from "../config/logger.js";
import type { UserRole } from "@prisma/client";

export const findUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findFirst({ where: { email } });
        return user;
    } catch (error: Error | any) {
        logger.error("Error finding user by email:", error.stack);
        throw createHttpError(500, "Error finding user by email");
    }
};

export const findTenantById = async (id: string) => {
    try {
        const tenant = await db.tenant.findFirst({
            where: { id },
            select: {
                plan: true,
                name: true,
                slug: true,
                _count: {
                    select: { notes: true },
                },
            },
        });
        return tenant;
    } catch (error: Error | any) {
        logger.error("Error finding tenant by id:", error.stack);
        throw createHttpError(500, "Error finding tenant by id");
    }
};

export const findUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({ where: { id } });
        return user;
    } catch (error: Error | any) {
        logger.error("Error finding user by ID:", error.stack);
        throw createHttpError(500, "Error finding user by ID");
    }
};

export const inviteUser = async (
    tenantId: string,
    name: string,
    email: string,
    password: string,
    role: "MANAGER" | "MEMBER",
) => {
    try {
        const newUser = await db.user.create({
            data: {
                name,
                email,
                password,
                role,
                tenantId,
            },
        });
        return newUser;
    } catch (error: Error | any) {
        logger.error("Error inviting user:", error.stack);
        throw createHttpError(500, "Error inviting user");
    }
};

export const findAllUsers = async (tenantId: string) => {
    try {
        const users = await db.user.findMany({
            where: { tenantId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        return users;
    } catch (error: Error | any) {
        logger.error("Error fetching users:", error.stack);
        throw createHttpError(500, "Error fetching users");
    }
};

export const updateRoleOfUser = async (id: string, role: UserRole) => {
    try {
        await db.user.update({
            where: { id },
            data: { role },
        });
    } catch (error: Error | any) {
        logger.error("Error updating user role:", error.stack);
        throw createHttpError(500, "Error updating user role");
    }
};

export const findTenantBySlug = async (slug: string) => {
    try {
        const tenant = await db.tenant.findFirst({
            where: { slug },
            select: {
                id: true,
                slug: true,
                plan: true,
            },
        });
        return tenant;
    } catch (error: Error | any) {
        logger.error("Error finding tenant by slug:", error.stack);
        throw createHttpError(500, "Error finding tenant by slug");
    }
};

export const updatePlan = async (id: string) => {
    try {
        await db.tenant.update({
            where: { id },
            data: { plan: "PRO" },
        });
    } catch (error: Error | any) {
        logger.error("Error upgrading plan", error.stack);
        throw createHttpError(500, "Error upgrading plan");
    }
};
