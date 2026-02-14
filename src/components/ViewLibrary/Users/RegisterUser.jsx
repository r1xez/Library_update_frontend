import React from "react";
import { apiService } from "../../../API/apiService";

export const RegisterUser = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const newUser = {
        email: formData.email,
        password: formData.password,
      };

      await apiService.post("/auth/register", newUser);

      if (onSuccess) {
        onSuccess({ email: formData.email, token: null });
      }
      alert("User registered successfully!");
      setFormData({ email: "", password: "", confirmPassword: "" });
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error registering user:", error);
      if (error?.message && error.message.toLowerCase().includes("already exist")) {
        alert("User already exists. Please login instead.");
      } else {
        alert("Failed to register user. Please try again.");
      }
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Register</h2>
        {onClose && (
          <button type="button" className="auth-close" onClick={onClose}>
            x
          </button>
        )}
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label" htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
          className="auth-input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <label className="auth-label" htmlFor="register-password">
          Password
        </label>
        <input
          id="register-password"
          className="auth-input"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
         <label className="auth-label" htmlFor="register-password">
          Confirm Password          
        </label>
         <input
          id="confirm-password"
          className="auth-input"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <button type="submit" className="auth-submit">
          Create account
        </button>
      </form>
    </div>
  );
};
