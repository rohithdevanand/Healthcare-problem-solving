import Appointment from "../models/Appointment.js";

// Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, hospitalId, disease, appointmentDate } = req.body;

    if (!patientId || !doctorId || !hospitalId || !disease) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      hospitalId,
      disease,
      appointmentDate,
    });

    await appointment.save();

    res.json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Appointments for Hospital
const getAppointmentsByHospital = async (req, res) => {
  try {
    const hospitalId = req.userId;
    const appointments = await Appointment.find({ hospitalId })
      .populate("patientId")
      .populate("doctorId");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Appointments for Patient
const getAppointmentsByPatient = async (req, res) => {
  try {
    const patientId = req.userId;
    const appointments = await Appointment.find({ patientId })
      .populate("doctorId")
      .populate("hospitalId");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  bookAppointment,
  getAppointmentsByHospital,
  getAppointmentsByPatient,
  updateAppointmentStatus,
};
