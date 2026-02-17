import React from "react";
import { apiService } from "../../../API/apiService";

export const LoginUser = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const Logindata = {
        email: formData.email,
        password: formData.password,
      };

      const response = await apiService.post("/auth/login", Logindata);
      const payload = Array.isArray(response) ? response[0] : response;
      const token = payload?.accessToken || payload?.AccessToken || null;
      const role = formData.email === "admin@gmail.com" ? "admin" : "user";
      if (onSuccess) {
        onSuccess({ email: formData.email, token, role });
      }
      if (token) {
        localStorage.setItem("accessToken", token);
      }
      alert("User logged in successfully!");
      setFormData({ email: "", password: "" });
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      alert("Failed to login. Please try again.");
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Login</h2>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          className="auth-input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <label className="auth-label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          className="auth-input"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        <button type="submit" className="auth-submit">
          Sign in
        </button>
      </form>
    </div>
  );
};
