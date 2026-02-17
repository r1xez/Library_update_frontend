import React, { useState } from "react";
import { apiService } from "../../../API/apiService";

import "../../../styles/Authors.css";

const AuthorCard = ({ author, onDelete, onUpdate, canEdit = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    firstName: author.firstName || "",
    lastName: author.lastName || "",
    birthDate: author.birthDate ? author.birthDate.split("T")[0] : "",
  });
  const authorName = author.name || `${author.firstName} ${author.lastName}`;
  const birthDate = author.birthDate
    ? new Date(author.birthDate).toLocaleDateString()
    : "Unknown";
  const booksCount = author.books?.length || 0;

  const handleEditClick = () => {
    if (!canEdit) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!editData.firstName || !editData.lastName || !editData.birthDate) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const updatePayload = {
        id: author.id,
        firstName: editData.firstName,
        lastName: editData.lastName,
        birthDate: editData.birthDate,
      };

      await apiService.put(`Authors/${author.id}/update`, updatePayload);

      alert("Author updated successfully!");
      setIsModalOpen(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating author:", error);
      alert("Failed to update author: " + (error.message || "Unknown error"));
    }
  };

  return (
    <>
      <div className="glass-card author-card">
        <div className="card-header">
          <h3>{authorName}</h3>
        </div>
        <div className="card-body">
          <p>Born: {birthDate}</p>
          <span className="book-count">Books count: {booksCount}</span>
        </div>
        {canEdit && (
          <div className="card-actions">
            <button className="btn-action edit" onClick={handleEditClick}>
              Edit
            </button>
            <button
              className="btn-action delete"
              onClick={() => onDelete && onDelete(author.id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isModalOpen && canEdit && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Author</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
              </div>
              <div className="form-group">
                <label>Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={editData.birthDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthorCard;
