import React, { useState } from "react";
import Aurora from "../../Aurora/Aurora.jsx";
import "../../../styles/AddAuthors.css";
import { Link } from "react-router-dom";
import { apiService } from "../../../API/apiService";

export const AddAuthors = () => {
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.birthDate) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const newAuthor = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate
      };

      await apiService.post('/Authors/create', newAuthor);

      alert("Author added successfully!");
      setFormData({ firstName: '', lastName: '', birthDate: '' });
    
    } catch (error) {
      console.error("Error creating author:", error);
      alert("Something went wrong while creating the author.");
    }
  };
  return (
    <div
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <Aurora
        colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
        blend={0.5}
        amplitude={1.0}
        speed={1}
      />
      <div style={{ position: "relative", zIndex: 1, color: "white" }}>
        <nav className="navbar">
          <div className="tabBar">
            <Link to="/">Home</Link>
            <Link to="/add-authors">Add Authors</Link>
            <Link to="/add-books">Add Books</Link>
            <Link to="/view-library">View Library</Link>
            <Link to="/global-library">Global Library</Link>
          </div>
        </nav>

        <div className="addAuthor.form">
         

          <form className="authorForm" onSubmit={handleSubmit}>
            <h2>Add New Author</h2>
            <div className="input.group">
              <input 
                type="text" 
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input.group">
              <input 
                type="text" 
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input.group">
              <input 
                type="date" 
                name="birthDate"
                placeholder="Birth Date"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn-author">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
