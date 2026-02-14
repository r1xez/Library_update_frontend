import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Aurora from "../../Aurora/Aurora.jsx";
import { GlobalLibrary } from './GlobalLibrary';
import { apiService } from '../../../API/apiService';
import '../../../styles/ViewLibrary.css';

export const GlobalLibraryPage = ({ authUser }) => {
    const [authors, setAuthors] = useState([]);
    const [books, setBooks] = useState([]);

    const normalizeList = (data) => {
        if (Array.isArray(data)) return data;
        if (data?.$values) return data.$values;
        return [];
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [authorsResponse, booksResponse] = await Promise.all([
                    apiService.get('Authors/getall'),
                    apiService.get('Books/getall')
                ]);
                const authorsList = normalizeList(authorsResponse);
                const booksList = normalizeList(booksResponse);
                setAuthors(authorsList);
                setBooks(booksList);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchData();
    }, []);

    const handleUpdateData = async () => {
        try {
            const [authorsResponse, booksResponse] = await Promise.all([
                apiService.get('Authors/getall'),
                apiService.get('Books/getall')
            ]);
            const authorsList = normalizeList(authorsResponse);
            const booksList = normalizeList(booksResponse);
            setAuthors(authorsList);
            setBooks(booksList);
        } catch (error) {
            console.error("Error reloading data:", error);
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
                        <Link to="/view-library">View Library</Link>
                        {isAdmin && <Link to="/global-library">Global Library</Link>}
                    </div>
                </nav>

                <div className="library-container">
                    <GlobalLibrary
                        authors={authors}
                        books={books}
                        onSaved={handleUpdateData}
                        canSave={isAdmin}
                    />
                </div>
            </div>
        </div>
    );
};
