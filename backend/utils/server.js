import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import patientRoutes from "../routes/patientRoutes.js";
import hospitalRoutes from "../routes/hospitalRoutes.js";
import doctorRoutes from "../routes/doctorRoutes.js";
import appointmentRoutes from "../routes/appointmentRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/patient", patientRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "✅ Healthcare Portal Backend is running (no DB yet)" });
});

// MongoDB Connection (commented until you connect)
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare-portal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("⚠️ MongoDB connection error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
