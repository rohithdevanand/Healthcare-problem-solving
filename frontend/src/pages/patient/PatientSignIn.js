import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AddressInput from "../../components/AddressInput";
import "../AuthForm.css"; // Shared CSS for auth forms

const PatientSignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [address, setAddress] = useState({
    doorNumber: "",
    mainAddress: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, password, confirmPassword, gender } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signIn({ name, password, gender, address }, "patient");
      // Navigate to dashboard is handled by AuthContext
    } catch (err) {
      setError(err.response.data.message || "Sign-in failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Patient Sign In (Register)</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Gender</label>
          <select name="gender" value={gender} onChange={onChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <AddressInput address={address} setAddress={setAddress} />
        <button type="submit">Sign In</button>
        <p>
          Already have an account? <Link to="/patient/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default PatientSignIn;