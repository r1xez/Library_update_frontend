import React from "react";
import "../../../styles/Books.css";

const GlobalLibraryCard = ({ book, onSave, canSave = true }) => {
	const authorsLabel = (book.authors || [])
		.map((author) => author.name)
		.filter(Boolean)
		.join(", ");

	const formats = book?.formats || {};
	const imageUrl =
		formats["image/jpeg"] ||
		formats["image/png"] ||
		Object.entries(formats).find(([key]) => key.includes("image"))?.[1];

	return (
		<div className="borderBox">
			<div className="glass-card book-card">
				{imageUrl && (
					<img src={imageUrl} alt={`Cover of ${book.title}`} />
				)}
				<div>
					<div className="card-header">
						<h3>{book.title}</h3>
					</div>
					<div className="card-body">
						<div>
							<p className="author-row">Author: {authorsLabel || "Unknown"}</p>
							<div className="meta-row">
								<span>Lang: {(book.languages || []).join(", ") || "N/A"}</span>
								<span>GUT#{book.id}</span>
							</div>
						</div>
						{canSave && (
							<div className="card-actions">
								<button className="btn-action edit" onClick={() => onSave(book)}>
									Save
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default GlobalLibraryCard;
