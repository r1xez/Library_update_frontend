import React, { useState, useMemo } from "react";
import BookCard from "./BookCard";
import { apiService } from "../../../API/apiService";
import "../../../styles/Books.css";

const BooksList = ({ books, authors, onDelete, onUpdate, canEdit = true }) => {
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [titleFilter, setTitleFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    title: "",
    authorId: "",
    publishYear: "",
    isbn: "",
    price: "",
  });

  const handleEditClick = (book) => {
    if (!canEdit) {
      return;
    }
    const bookAuthor = authors.find((author) => {
      const authorLabel = `${author.firstName} ${author.lastName}`.trim();
      return authorLabel === book.authorName;
    });

    setEditData({
      id: book.id,
      title: book.title,
      authorId: bookAuthor?.id || "",
      publishYear: book.publishYear || "",
      price: book.price || "",
    });
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
    if (!editData.title || !editData.authorId || !editData.publishYear || !editData.isbn || !editData.price) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const updatePayload = {
        id: editData.id,
        title: editData.title,
        authorId: parseInt(editData.authorId),
        publishYear: parseInt(editData.publishYear),
        isbn: editData.isbn,
        price: parseFloat(editData.price),
      };

      await apiService.put(`Books/${editData.id}/update`, updatePayload);

      alert("Book updated successfully!");
      setIsModalOpen(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book: " + (error.message || "Unknown error"));
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesAuthor =
        selectedAuthor === "all" || book.authorName === selectedAuthor;
      const matchesTitle = book.title
        .toLowerCase()
        .includes(titleFilter.toLowerCase());
      return matchesAuthor && matchesTitle;
    });
  }, [books, selectedAuthor, titleFilter]);

  if (!books || books.length === 0) {
    return (
      <p className="no-data">
        No books available. Please add some books to the library.
      </p>
    );
  }

  return (
    <div className="books-section">
      <div className="books-wrapper">
        <div className="section-header">
          <h2>Books</h2>
          <div className="filters">
            <input
              type="text"
              className="filter-input"
              placeholder="Filter by title..."
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
            />
            <select
              className="filter-dropdown"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            >
              <option value="all">All authors</option>
              {authors.map((author) => {
                const authorLabel = `${author.firstName} ${author.lastName}`.trim();
                return (
                  <option key={author.id} value={authorLabel}>
                    {authorLabel}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="grid-layout">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={onDelete}
              onEdit={handleEditClick}
              canEdit={canEdit}
            />
          ))}
        </div>
      </div>

      
      {isModalOpen && canEdit && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Book</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editData.title}
                  onChange={handleInputChange}
                  placeholder="Enter book title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="authorId">Author</label>
                <select
                  id="authorId"
                  name="authorId"
                  value={editData.authorId}
                  onChange={handleInputChange}
                >
                  <option value="">Select an author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {`${author.firstName} ${author.lastName}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="publishYear">Publish Year</label>
                <input
                  type="number"
                  id="publishYear"
                  name="publishYear"
                  value={editData.publishYear}
                  onChange={handleInputChange}
                  placeholder="Enter publish year"
                />
              </div>
            
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  value={editData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        
      )}
    </div>
  );
};

export default BooksList;
