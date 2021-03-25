import { Router } from "express";
import userController from "../controllers/auth";

const { registerUsers, loginUsers, refreshTokenUser } = userController;

const router = new Router();

router.post("/register", registerUsers);
router.post("/login", loginUsers);
router.post("/refresh-token", refreshTokenUser);
router.post("/me", refreshTokenUser);

export default router;