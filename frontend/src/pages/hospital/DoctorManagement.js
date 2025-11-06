import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../AuthForm.css"; // Reusing some styles

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for the "Add Doctor" form
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    experience: "",
    specialization: "",
    price: "",
  });
  
  // State for "Update Doctor" modal/form
  const [editingDoctor, setEditingDoctor] = useState(null); 

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctor/hospital");
      setDoctors(res.data);
    } catch (err) {
      setError("Failed to fetch doctors.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewDoctorChange = (e) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/doctor/add", newDoctor);
      setDoctors([...doctors, res.data.doctor]);
      setNewDoctor({ name: "", experience: "", specialization: "", price: "" }); // Reset form
    } catch (err) {
      alert("Failed to add doctor.");
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await api.delete(`/doctor/${id}`);
        setDoctors(doctors.filter((doc) => doc._id !== id));
      } catch (err) {
        alert("Failed to delete doctor.");
      }
    }
  };

  // --- Update Logic ---
  const handleEditChange = (e) => {
    setEditingDoctor({ ...editingDoctor, [e.target.name]: e.target.value });
  };
  
  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/doctor/${editingDoctor._id}`, editingDoctor);
      setDoctors(doctors.map(doc => doc._id === editingDoctor._id ? res.data.doctor : doc));
      setEditingDoctor(null); // Close editing form
    } catch (err) {
      alert('Failed to update doctor');
    }
  };

  return (
    <div>
      <h2>Manage Doctors</h2>

      {/* --- Add Doctor Form --- */}
      <form onSubmit={handleAddDoctor} className="auth-form" style={{ maxWidth: 'none', marginBottom: '2rem' }}>
        <h3>Add New Doctor</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            name="name"
            value={newDoctor.name}
            onChange={handleNewDoctorChange}
            placeholder="Name"
            required
          />
          <input
            name="specialization"
            value={newDoctor.specialization}
            onChange={handleNewDoctorChange}
            placeholder="Specialization"
            required
          />
          <input
            type="number"
            name="experience"
            value={newDoctor.experience}
            onChange={handleNewDoctorChange}
            placeholder="Experience (Years)"
            required
          />
          <input
            type="number"
            name="price"
            value={newDoctor.price}
            onChange={handleNewDoctorChange}
            placeholder="Estimated Price"
            required
          />
          <button type="submit">Add Doctor</button>
        </div>
      </form>

      {/* --- Edit Doctor Form (Modal-like) --- */}
      {editingDoctor && (
        <div className="auth-form" style={{ background: '#f8f8f8', marginBottom: '2rem' }}>
          <h3>Editing: {editingDoctor.name}</h3>
          <form onSubmit={handleUpdateDoctor}>
            <input
              name="name"
              value={editingDoctor.name}
              onChange={handleEditChange}
            />
            <input
              name="specialization"
              value={editingDoctor.specialization}
              onChange={handleEditChange}
            />
            <input
              type="number"
              name="experience"
              value={editingDoctor.experience}
              onChange={handleEditChange}
            />
            <input
              type="number"
              name="price"
              value={editingDoctor.price}
              onChange={handleEditChange}
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingDoctor(null)}>Cancel</button>
          </form>
        </div>
      )}

      {/* --- List of Doctors --- */}
      <h3>Your Doctors</h3>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{doc.name}</td>
              <td>{doc.specialization}</td>
              <td>{doc.experience} yrs</td>
              <td>${doc.price}</td>
              <td>
                <button onClick={() => setEditingDoctor(doc)}>Update</button>
                <button onClick={() => handleDeleteDoctor(doc._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorManagement;