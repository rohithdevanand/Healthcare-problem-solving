import express from "express";
import patientController from "../controllers/patientController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Patient route working ✅" });
});

export default router;
