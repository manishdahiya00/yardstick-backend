import express from "express";
import {
    allNotes,
    createNote,
    deleteNote,
    getNoteById,
    updateNote,
} from "../controllers/notes.controller.js";
import { authenticateUser } from "../middlewares/authenticate.middleware.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", allNotes);
router.post("/", createNote);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
