import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import AuthContext from "../../context/AuthContext";
import DoctorCard from "../../components/DoctorCard";

const BookAppointment = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchParams, setSearchParams] = useState({
    doctorName: "",
    disease: "", // Note: disease is not a search param in backend
    budget: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext); // Get patient's pincode

  // Load all doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctor"); // Gets all doctors
        setAllDoctors(res.data);
        setFilteredDoctors(res.data); // Initially, show all
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch doctors.");
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let { doctorName, budget } = searchParams;
    let patientPincode = user?.address?.pincode;

    let tempFiltered = [...allDoctors];

    // Filter by name (optional)
    if (doctorName) {
      tempFiltered = tempFiltered.filter((doc) =>
        doc.name.toLowerCase().includes(doctorName.toLowerCase())
      );
    }

    // Filter by budget (optional)
    if (budget) {
      tempFiltered = tempFiltered.filter((doc) => doc.price <= parseInt(budget));
    }

    // **Sort** by nearest pincode (as requested)
    if (patientPincode) {
      tempFiltered.sort((a, b) => {
        let pincodeA = a.hospitalId?.address?.pincode;
        let pincodeB = b.hospitalId?.address?.pincode;

        if (pincodeA === patientPincode && pincodeB !== patientPincode) {
          return -1; // a (match) comes before b (no match)
        }
        if (pincodeA !== patientPincode && pincodeB === patientPincode) {
          return 1; // b comes before a
        }
        return 0; // Keep original order if both match or neither match
      });
    }

    setFilteredDoctors(tempFiltered);
  };

  if (loading) return <div>Loading doctors...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="text"
          name="doctorName"
          placeholder="Doctor Name (optional)"
          value={searchParams.doctorName}
          onChange={handleChange}
        />
        <input
          type="number"
          name="budget"
          placeholder="Max Budget (optional)"
          value={searchParams.budget}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>

      <div className="doctor-list">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))
        ) : (
          <p>No doctors found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;