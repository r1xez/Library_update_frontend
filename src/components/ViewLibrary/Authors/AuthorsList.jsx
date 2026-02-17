import React from "react";
import AuthorCard from "./AuthorsCard";
import "../../../styles/Authors.css";

const AuthorsList = ({ authors, onDelete, onUpdate, canEdit = true }) => {
  return (
    <div className="authors-section">
      <div className="authors-wrapper">
        <div className="section-header">
          <h2>Authors</h2>
        </div>
        <div className="grid-layout">
          {authors.map((author) => (
            <AuthorCard
              key={author.id}
              author={author}
              onDelete={onDelete}
              onUpdate={onUpdate}
              canEdit={canEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorsList;
