import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Aurora from "../Aurora/Aurora.jsx";
import BooksList from './Books/BookList';
import AuthorsList from './Authors/AuthorsList';
import { apiService } from '../../API/apiService';
import '../../styles/ViewLibrary.css';

export const ViewLibrary = ({ authUser }) => {
    const [activeTab, setActiveTab] = useState('books'); 

  
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);

   
    const normalizeList = (data) => {
        if (Array.isArray(data)) return data;
        if (data?.$values) return data.$values;
        return [];
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [booksResponse, authorsResponse, imagesResponse] = await Promise.all([
                    apiService.get('Books/getall'),
                    apiService.get('Authors/getall'),
                    apiService.get('gutendex/images').catch(() => [])
                ]);

                const authorsList = normalizeList(authorsResponse);
                const booksList = normalizeList(booksResponse);
                const imagesList = normalizeList(imagesResponse);

                // Build image map by title
                const imagesByTitle = {};
                imagesList.forEach((img) => {
                    if (img.title) {
                        imagesByTitle[img.title.toLowerCase()] = img.imageUrl;
                    }
                });

                const authorsById = {};
                authorsList.forEach(author => {
                    authorsById[author.id] = `${author.firstName} ${author.lastName}`;
                });

                const booksWithAuthors = booksList.map((book) => ({
                    ...book,
                    authorName: authorsById[book.authorId] || "Unknown",
                    coverUrl: book.imageUrl || imagesByTitle[book.title?.toLowerCase()] || null
                }));

                setAuthors(authorsList);
                setBooks(booksWithAuthors);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchData();
    }, []);

    const handleDeleteBook = async (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await apiService.delete(`Books/${id}/delete`);
                setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
                alert("Book deleted successfully!");
            } catch (error) {
                alert("Failed to delete the book: " + (error.message || "Unknown error"));
            }
        }
    };

    const handleDeleteAuthor = async (id) => {
        if (window.confirm("Are you sure you want to delete this author?")) {
            try {
                await apiService.delete(`Authors/${id}/delete`);
                setAuthors(prevAuthors => prevAuthors.filter(author => author.id !== id));
                alert("Author deleted successfully!");
            } catch (error) {
                alert("Failed to delete the author: " + (error.message || "Unknown error"));
            }
        }
    };

    const handleUpdateBook = async () => {
        try {
            const booksResponse = await apiService.get('Books/getall');
            const booksList = normalizeList(booksResponse);

            const authorsById = {};
            authors.forEach(author => {
                authorsById[author.id] = `${author.firstName} ${author.lastName}`;
            });

            const booksWithAuthors = booksList.map((book) => ({
                ...book,
                authorName: authorsById[book.authorId] || "Unknown"
            }));

            setBooks(booksWithAuthors);
        } catch (error) {
            console.error("Error reloading books:", error);
        }
    };

    const handleUpdateAuthor = async () => {
        try {
            const authorsResponse = await apiService.get('Authors/getall');
            const authorsList = normalizeList(authorsResponse);
            setAuthors(authorsList);
        } catch (error) {
            console.error("Error reloading authors:", error);
        }
    };

    const isAdmin = authUser?.role?.toLowerCase() === 'admin';

    return (
        <div className="view-library-page">
            <Aurora colorStops={["#7cff67", "#B19EEF", "#5227FF"]} blend={0.5} amplitude={1.0} speed={1} />
            
            <div className="content-wrapper">
                
                <nav className="navbar" style={{  position: "sticky", top: 0, zIndex: 1, color: "white" }}>
                    <div className="tabBar">
                         <Link to="/">Home</Link>
                        {isAdmin && <Link to="/add-authors">Add Authors</Link>}
                        {isAdmin && <Link to="/add-books">Add Books</Link>}
                        
                        <div className="nav-dropdown">
                            <span className="dropdown-trigger">
                                View Library ▼
                            </span>
                            
                            <div className="dropdown-menu">
                                <button 
                                    className={activeTab === 'books' ? 'active' : ''} 
                                    onClick={() => setActiveTab('books')}
                                >
                                     Books
                                </button>
                                <button 
                                    className={activeTab === 'authors' ? 'active' : ''} 
                                    onClick={() => setActiveTab('authors')}
                                >
                                     Authors
                                </button>
                            </div>
                        </div>
                        {isAdmin && <Link to="/global-library">Global Library</Link>}
                    </div>
                </nav>

                <div className="library-container">
                  
                   

                    <div className="content-area">
                        {activeTab === 'books' && (
                            <BooksList 
                                books={books}
                                authors={authors}
                                onDelete={handleDeleteBook}
                                onUpdate={handleUpdateBook}
                                canEdit={isAdmin}
                            />
                        )}
                        {activeTab === 'authors' && (
                            <AuthorsList 
                                authors={authors} 
                                onDelete={handleDeleteAuthor}
                                onUpdate={handleUpdateAuthor}
                                canEdit={isAdmin}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};