import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../services/api";

const DoctorCard = ({ doctor }) => {
  const { user } = useContext(AuthContext);
  const [disease, setDisease] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!disease || !appointmentDate) {
      setMessage("Please fill in the disease and date.");
      return;
    }

    try {
      const bookingData = {
        patientId: user._id,
        doctorId: doctor._id,
        hospitalId: doctor.hospitalId._id, // hospitalId is populated
        disease,
        appointmentDate,
      };

      await api.post("/appointment/book", bookingData);
      setMessage("Appointment booked successfully!");
      setShowForm(false);
      setDisease("");
      setAppointmentDate("");
    } catch (error) {
      setMessage("Failed to book appointment. Please try again.");
      console.error("Booking error:", error);
    }
  };

  return (
    <div className="doctor-card" style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
      <h3>{doctor.name}</h3>
      <p><strong>Specialization:</strong> {doctor.specialization}</p>
      <p><strong>Experience:</strong> {doctor.experience} years</p>
      <p><strong>Rating:</strong> {doctor.rating || "N/A"} stars</p>
      <p><strong>Price:</strong> ${doctor.price}</p>
      <p><strong>Hospital:</strong> {doctor.hospitalId.hospitalName}</p>
      <p><strong>Location:</strong> {doctor.hospitalId.address.city}, {doctor.hospitalId.address.pincode}</p>
      
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Book an Appointment"}
      </button>

      {showForm && (
        <form onSubmit={handleBookAppointment} style={{ marginTop: '1rem' }}>
          <div>
            <label>Disease/Symptom</label>
            <input
              type="text"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Preferred Date</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>
          <button type="submit">Confirm Booking</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default DoctorCard;