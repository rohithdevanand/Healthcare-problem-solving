import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AddressInput from "../../components/AddressInput";
import "../AuthForm.css"; // Shared CSS for auth forms

const PatientLogin = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [address, setAddress] = useState({
    doorNumber: "",
    mainAddress: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const { name, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ name, password, address }, "patient");
      // Navigate to dashboard is handled by AuthContext
    } catch (err) {
      setError(err.response.data.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Patient Login</h2>
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
        <AddressInput address={address} setAddress={setAddress} />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/patient/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default PatientLogin;