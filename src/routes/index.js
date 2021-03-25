import { Router } from "express";
import userRoute from "./auth";
import taskRoute from "./task";

const router = new Router();

router.use("/v1", userRoute);
router.use("/v1", taskRoute);

export default router;