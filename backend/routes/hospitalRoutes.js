import express from "express";
import hospitalController from "../controllers/hospitalController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/signin", hospitalController.signIn);
router.post("/login", hospitalController.login);
router.get("/profile", authMiddleware, hospitalController.getProfile);

export default router;
