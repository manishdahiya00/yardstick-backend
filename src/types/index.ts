import type { User } from "@prisma/client";

declare module "express" {
    export interface Request {
        user?: User;
    }
}

export type NoteData = {
    title: string;
    content: string;
};
