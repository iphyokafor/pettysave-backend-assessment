import { Router } from "express";
import taskController from "../controllers/task";
import verifyToken from "../middlewares/verify-token";

const {
    postTask,
    getTask,
    filterTask,
    getSingleTask,
    updateTask,
} = taskController;

const router = new Router();

router.post("/task", verifyToken, postTask);
router.get("/task", verifyToken, getTask);
router.get("/status", verifyToken, filterTask);
router.get("/task/:id", verifyToken, getSingleTask);
router.put("/task/:id", verifyToken, updateTask);

export default router;