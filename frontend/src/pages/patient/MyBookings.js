import React, { useState, useEffect } from "react";
import api from "../../services/api";

const MyBookings = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointment/patient");
        setAppointments(res.data);
      } catch (err) {
        setError("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <div>Loading your appointments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>You have no appointments.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Hospital</th>
              <th>Disease</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{apt.doctorId?.name || "N/A"}</td>
                <td>{apt.hospitalId?.hospitalName || "N/A"}</td>
                <td>{apt.disease}</td>
                <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                <td>{apt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBookings;