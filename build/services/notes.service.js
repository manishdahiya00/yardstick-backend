import createHttpError from "http-errors";
import logger from "../config/logger";
import db from "../config/db";
export const getAllNotes = async (tenantId) => {
    try {
        const notes = await db.note.findMany({
            where: {
                tenantId,
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });
        return notes;
    }
    catch (error) {
        logger.error("Error fetching notes: ", error.stack);
        throw createHttpError(500, "Error fetching notes");
    }
};
export const createNoteOfTenant = async (userId, tenantId, noteData) => {
    try {
        const newNote = await db.note.create({
            data: {
                title: noteData.title,
                content: noteData.content,
                tenantId,
                userId,
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });
        return newNote;
    }
    catch (error) {
        logger.error("Error creating note: ", error.stack);
        throw createHttpError(500, "Error creating note");
    }
};
export const findNoteById = async (id) => {
    try {
        const note = await db.note.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });
        return note;
    }
    catch (error) {
        logger.error("Error fetching note by ID: ", error.stack);
        throw createHttpError(500, "Error fetching note by ID");
    }
};
export const updateNoteById = async (id, noteData) => {
    try {
        const updatedNote = await db.note.update({
            where: {
                id,
            },
            data: {
                title: noteData.title,
                content: noteData.content,
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });
        return updatedNote;
    }
    catch (error) {
        logger.error("Error updating note: ", error.stack);
        throw createHttpError(500, "Error updating note");
    }
};
export const deleteNoteById = async (id) => {
    try {
        await db.note.delete({
            where: {
                id,
            },
        });
    }
    catch (error) {
        logger.error("Error deleting note: ", error.stack);
        throw createHttpError(500, "Error deleting note");
    }
};
