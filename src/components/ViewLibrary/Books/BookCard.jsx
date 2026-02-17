import React from "react";
import "../../../styles/Books.css";

const BookCard = ({ book, onDelete, onEdit, canEdit = true }) => {
  const coverUrl = book.coverUrl;
  return (
    <div className="borderBox">
      <div className="glass-card book-card">
        {coverUrl && <img src={coverUrl} alt={book.title} />}
        <div>
          <div className="card-header">
            <h3>{book.title}</h3>
          </div>
          <div className="card-body">
            <div>
              <p className="author-row">
                Author: {book.authorName || "Unknown"}
              </p>
              <div className="meta-row">
                <span>Year: {book.publishYear || book.year || "N/A"}</span>
                <span className="isbn">ISBN:{book.isbn}</span>
              </div>
            </div>
            {canEdit && (
              <div className="card-actions">
                <button
                  className="btn-action edit"
                  onClick={() => onEdit && onEdit(book)}
                >
                  Edit
                </button>
                <button
                  className="btn-action delete"
                  onClick={() => onDelete && onDelete(book.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
