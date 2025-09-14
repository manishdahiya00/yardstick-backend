import express, { type Request, type Response } from "express";
import {
    allUsers,
    getTenant,
    inviteNewUser,
    loginUser,
    logoutUser,
    updateRole,
    upgradePlan,
} from "../controllers/auth.controller";
import { authenticateUser } from "../middlewares/authenticate.middleware";

const router = express.Router();

router.post("/login", loginUser);
router.post("/invite", authenticateUser, inviteNewUser);
router.put("/role/:id", authenticateUser, updateRole);
router.get("/users", authenticateUser, allUsers);
router.delete("/logout", logoutUser);
router.get("/tenants/me", authenticateUser, getTenant);
router.post("/tenants/:slug/upgrade", authenticateUser, upgradePlan);
router.get("/me", authenticateUser, (req: Request, res: Response) => {
    res.status(200).json({ success: true, user: req.user });
});

export default router;
