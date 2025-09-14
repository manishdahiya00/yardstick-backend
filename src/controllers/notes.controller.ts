import type { Request, Response } from "express";
import logger from "../config/logger";
import {
    createNoteOfTenant,
    deleteNoteById,
    findNoteById,
    getAllNotes,
    updateNoteById,
} from "../services/notes.service";
import { noteSchema } from "../validations/notes.validation";
import { formatZodError } from "../utils/zod.error";
import { findTenantById } from "../services/user.service";
import { SubsPlan } from "@prisma/client";

export const allNotes = async (req: Request, res: Response) => {
    try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            return res
                .status(400)
                .json({ success: false, message: "Tenant ID is required" });
        }
        const notes = await getAllNotes(tenantId);
        res.status(200).json({ success: true, data: notes });
    } catch (error: Error | any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};

export const createNote = async (req: Request, res: Response) => {
    try {
        const tenantId = req.user?.tenantId;
        const userId = req.user?.id;
        if (!tenantId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Tenant ID and User ID are required",
            });
        }
        const result = noteSchema.safeParse(req.body);
        if (!result.success) {
            const formattedError = formatZodError(result.error);
            return res
                .status(400)
                .json({ success: false, error: formattedError });
        }
        const tenant = await findTenantById(tenantId);
        if (!tenant) {
            return res.status(400).json({
                success: false,
                message: "Tenant not found",
            });
        }
        if (tenant.plan === SubsPlan.FREE && tenant._count.notes == 3) {
            return res.status(400).json({
                success: false,
                message: "Tenant has reached the maximum number of notes",
                code: "MAX_NOTES_REACHED",
            });
        }
        await createNoteOfTenant(userId, tenantId, result.data);
        res.status(201).json({
            success: true,
            message: "Note created successfully",
        });
    } catch (error: Error | any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};

export const getNoteById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Note ID is required" });
        }
        const note = await findNoteById(id);
        res.status(200).json({ success: true, data: note });
    } catch (error: Error | any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};

export const updateNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Note ID is required" });
        }
        const result = noteSchema.safeParse(req.body);
        if (!result.success) {
            const formattedError = formatZodError(result.error);
            return res
                .status(400)
                .json({ success: false, error: formattedError });
        }
        await updateNoteById(id, result.data);
        res.status(200).json({
            success: true,
            message: "Note updated successfully",
        });
    } catch (error: Error | any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};

export const deleteNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Note ID is required" });
        }
        const note = await findNoteById(id);
        if (!note) {
            return res
                .status(200)
                .json({ success: true, message: "Note deleted successfully" });
        }
        await deleteNoteById(id);
        res.status(200).json({
            success: true,
            message: `Note deleted successfully`,
        });
    } catch (error: Error | any) {
        logger.error(error.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        return;
    }
};
