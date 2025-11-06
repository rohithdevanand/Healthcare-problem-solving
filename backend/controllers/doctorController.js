import Doctor from "../models/Doctor.js";

// Add Doctor
const addDoctor = async (req, res) => {
  try {
    const { name, experience, specialization, price } = req.body;
    const hospitalId = req.userId;

    if (!name || !experience || !specialization || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const doctor = new Doctor({
      name,
      experience,
      specialization,
      price,
      hospitalId,
    });

    await doctor.save();
    res.json({
      message: "Doctor added successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("hospitalId");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Doctors by Hospital
const getDoctorsByHospital = async (req, res) => {
  try {
    const hospitalId = req.userId;
    const doctors = await Doctor.find({ hospitalId });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Doctor
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, experience, specialization, price } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { name, experience, specialization, price },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Doctor
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  addDoctor,
  getAllDoctors,
  getDoctorsByHospital,
  updateDoctor,
  deleteDoctor,
};
