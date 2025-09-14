import createHttpError from "http-errors";
import logger from "../config/logger";
import type { NoteData } from "../types";
import db from "../config/db";

export const getAllNotes = async (tenantId: string) => {
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
    } catch (error: Error | any) {
        logger.error("Error fetching notes: ", error.stack);
        throw createHttpError(500, "Error fetching notes");
    }
};

export const createNoteOfTenant = async (
    userId: string,
    tenantId: string,
    noteData: NoteData,
) => {
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
    } catch (error: Error | any) {
        logger.error("Error creating note: ", error.stack);
        throw createHttpError(500, "Error creating note");
    }
};

export const findNoteById = async (id: string) => {
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
    } catch (error: Error | any) {
        logger.error("Error fetching note by ID: ", error.stack);
        throw createHttpError(500, "Error fetching note by ID");
    }
};

export const updateNoteById = async (id: string, noteData: NoteData) => {
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
    } catch (error: Error | any) {
        logger.error("Error updating note: ", error.stack);
        throw createHttpError(500, "Error updating note");
    }
};

export const deleteNoteById = async (id: string) => {
    try {
        await db.note.delete({
            where: {
                id,
            },
        });
    } catch (error: Error | any) {
        logger.error("Error deleting note: ", error.stack);
        throw createHttpError(500, "Error deleting note");
    }
};
