import createHttpError from "http-errors";
import db from "../config/db";
import logger from "../config/logger";
export const findUserByEmail = async (email) => {
    try {
        const user = await db.user.findFirst({ where: { email } });
        return user;
    }
    catch (error) {
        logger.error("Error finding user by email:", error.stack);
        throw createHttpError(500, "Error finding user by email");
    }
};
export const findTenantById = async (id) => {
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
    }
    catch (error) {
        logger.error("Error finding tenant by id:", error.stack);
        throw createHttpError(500, "Error finding tenant by id");
    }
};
export const findUserById = async (id) => {
    try {
        const user = await db.user.findUnique({ where: { id } });
        return user;
    }
    catch (error) {
        logger.error("Error finding user by ID:", error.stack);
        throw createHttpError(500, "Error finding user by ID");
    }
};
export const inviteUser = async (tenantId, name, email, password, role) => {
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
    }
    catch (error) {
        logger.error("Error inviting user:", error.stack);
        throw createHttpError(500, "Error inviting user");
    }
};
export const findAllUsers = async (tenantId) => {
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
    }
    catch (error) {
        logger.error("Error fetching users:", error.stack);
        throw createHttpError(500, "Error fetching users");
    }
};
export const updateRoleOfUser = async (id, role) => {
    try {
        await db.user.update({
            where: { id },
            data: { role },
        });
    }
    catch (error) {
        logger.error("Error updating user role:", error.stack);
        throw createHttpError(500, "Error updating user role");
    }
};
export const findTenantBySlug = async (slug) => {
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
    }
    catch (error) {
        logger.error("Error finding tenant by slug:", error.stack);
        throw createHttpError(500, "Error finding tenant by slug");
    }
};
export const updatePlan = async (id) => {
    try {
        await db.tenant.update({
            where: { id },
            data: { plan: "PRO" },
        });
    }
    catch (error) {
        logger.error("Error upgrading plan", error.stack);
        throw createHttpError(500, "Error upgrading plan");
    }
};
