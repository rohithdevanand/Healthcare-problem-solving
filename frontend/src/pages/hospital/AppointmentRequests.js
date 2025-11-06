import React, { useState, useEffect } from "react";
import api from "../../services/api";

const AppointmentRequests = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointment/hospital");
      setAppointments(res.data);
    } catch (err) {
      setError("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/appointment/${id}`, { status });
      // Update the list locally
      setAppointments(
        appointments.map((apt) =>
          apt._id === id ? { ...apt, status: status } : apt
        )
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Appointment Requests</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Disease</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{apt.patientId?.name || "N/A"}</td>
                <td>{apt.doctorId?.name || "N/A"}</td>
                <td>{apt.disease}</td>
                <td>{new Date(apt.appointmentDate).toLocaleString()}</td>
                <td>{apt.status}</td>
                <td>
                  {apt.status === "Pending" && (
                    <>
                      <button onClick={() => handleUpdateStatus(apt._id, "Accepted")}>
                        Accept
                      </button>
                      <button onClick={() => handleUpdateStatus(apt._id, "Denied")}>
                        Deny
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentRequests;