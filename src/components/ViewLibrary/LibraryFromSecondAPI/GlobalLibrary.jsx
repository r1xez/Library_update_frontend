import React, { useEffect, useMemo, useState } from "react";
import { apiService } from "../../../API/apiService";
import GlobalLibraryCard from "./GlobalLibraryCard";
import "../../../styles/Books.css";

const DEFAULT_BIRTH_DATE = "1900";

const parseAuthorName = (name) => {
    if (!name) {
        return { firstName: "Unknown", lastName: "Author" };
    }

    if (name.includes(",")) {
        const [lastName, firstName] = name.split(",").map((part) => part.trim());
        return { firstName: firstName || "Unknown", lastName: lastName || "Author" };
    }

    const parts = name.trim().split(" ");
    if (parts.length === 1) {
        return { firstName: parts[0], lastName: "Author" };
    }

    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
};

const normalizeAuthorLabel = (name) => {
    const { firstName, lastName } = parseAuthorName(name);
    return `${firstName} ${lastName}`.trim().toLowerCase();
};

export const GlobalLibrary = ({ authors, books: savedBooks = [], onSaved, canSave = true }) => {
    const [books, setBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [formData, setFormData] = useState({
        isbn: "",
        publishYear: "",
        price: "",
    });

    const normalizedAuthors = useMemo(() => authors || [], [authors]);

    useEffect(() => {
        const fetchGlobalBooks = async () => {
            try {
                const response = await fetch("https://gutendex.com/books");
                const data = await response.json();
                const results = data?.results || [];
                setBooks(results);
            } catch (error) {
                console.error("Failed to load global books:", error);
            }
        };

        fetchGlobalBooks();
    }, []);

    const handleOpenModal = (book) => {
        setSelectedBook(book);
        setFormData({ isbn: "", publishYear: "", price: "" });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const findOrCreateAuthor = async (authorObj) => {
        const authorName = authorObj?.name || "Unknown Author";
        const birthYear = authorObj?.birth_year;
        const normalizedTarget = normalizeAuthorLabel(authorName);
        
        const match = normalizedAuthors.find((author) => {
            const label = `${author.firstName} ${author.lastName}`.trim().toLowerCase();
            return label === normalizedTarget;
        });

        if (match) {
            return match.id;
        }

        const { firstName, lastName } = parseAuthorName(authorName);
        const birthDate = birthYear ? `${birthYear}-01-01` : DEFAULT_BIRTH_DATE;
        
        const newAuthor = {
            firstName,
            lastName,
            birthDate,
        };

        const created = await apiService.post("/Authors/create", newAuthor);
        if (created?.id) {
            return created.id;
        }

        if (onSaved) {
            await onSaved();
        }

        const refreshedAuthors = await apiService.get("Authors/getall");
        const fallback = Array.isArray(refreshedAuthors)
            ? refreshedAuthors
            : refreshedAuthors?.$values || [];
        const fallbackMatch = fallback.find((author) => {
            const label = `${author.firstName} ${author.lastName}`.trim().toLowerCase();
            return label === normalizedTarget;
        });

        if (!fallbackMatch) {
            throw new Error("Failed to resolve author ID after create");
        }

        return fallbackMatch.id;
    };

    const handleSave = async () => {
        if (!selectedBook) {
            return;
        }

        if (!formData.isbn || !formData.publishYear || !formData.price) {
            alert("Please fill in all fields");
            return;
        }

        
        const isDuplicate = savedBooks.some((book) => book.isbn === formData.isbn);
        if (isDuplicate) {
            alert(`Book with ISBN ${formData.isbn} already exists in your library!`);
            return;
        }

        try {
            const primaryAuthor = selectedBook.authors?.[0] || { name: "Unknown Author" };
            const authorId = await findOrCreateAuthor(primaryAuthor);

            const payload = {
                title: selectedBook.title,
                isbn: formData.isbn,
                publishYear: parseInt(formData.publishYear, 10),
                price: parseFloat(formData.price),
                authorId,
            };

            await apiService.post("/Books/create", payload);
            alert("Book added successfully!");
            handleCloseModal();
            if (onSaved) {
                await onSaved();
            }
        } catch (error) {
            console.error("Failed to save book:", error);
            alert(error.message || "Failed to save book");
        }
    };

    return (
        <div className="books-section">
            <div className="books-wrapper">
                <div className="section-header">
                    <h2>Global Library</h2>
                </div>

                <div className="grid-layout">
                    {books.map((book) => (
                        <GlobalLibraryCard
                            key={book.id}
                            book={book}
                            onSave={handleOpenModal}
                            canSave={canSave}
                        />
                    ))}
                </div>
            </div>

            {isModalOpen && canSave && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Save Book</h2>
                            <button className="close-btn" onClick={handleCloseModal}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="isbn">ISBN</label>
                                <input
                                    type="text"
                                    id="isbn"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleInputChange}
                                    placeholder="Enter ISBN"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="publishYear">Publish Year</label>
                                <input
                                    type="number"
                                    id="publishYear"
                                    name="publishYear"
                                    value={formData.publishYear}
                                    onChange={handleInputChange}
                                    placeholder="Enter publish year"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    step="0.01"
                                    value={formData.price}
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
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};