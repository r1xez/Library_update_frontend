import React, { useEffect, useState } from 'react';
import Aurora from "../../Aurora/Aurora.jsx";

import "../../../styles/AddBooks.css";
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../../API/apiService';

export const AddBooks = () => {
  
   const [authors, setAuthors] = useState([])

   const [formData, setFormData] = useState({
        title: '',
        isbn: '',
        publishYear: '',
        price: '',
        authorId: ''
   })
   const [errors, setErrors] = useState({});

   useEffect(() => { 
    const fetchAuthors = async () => {
        try {
            const authorsData = await apiService.get('Authors/getall');
            setAuthors(authorsData);
        }
        catch(error) { 
            console.error("Failed to fetch authors", error);
        }
    };
    fetchAuthors();
   },[])
    
   const handleChange =(e) =>  {
    const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
   }
   const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!formData.title || !formData.isbn || !formData.publishYear || !formData.price || !formData.authorId) {
            alert("Please fill in all fields!");
            return;
        }

        try {
           
            const newBook = {
                title: formData.title,
                isbn: formData.isbn,
                publishYear: parseInt(formData.publishYear),
                price: parseFloat(formData.price),
                authorId: parseInt(formData.authorId)
            };

            
            await apiService.post('/Books/create', newBook); 
            
            alert("Book added successfully!");
            setFormData({ title: '', isbn: '', publishYear: '', price: '', authorId: '' });
           

        } catch (error) {
            console.error("Error creating book:", error);
            const errorMessage = error.message || "Something went wrong while creating the book.";
            alert(errorMessage);
            setErrors({ api: errorMessage });
        }
     }
    return ( 
        <div style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            backgroundColor: "#000",
        }}>
             
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
                
              
                <div className="addBooks.form "> 
                    
                    <form className="booksForm" onSubmit={handleSubmit}>
                        <h2>Add New Book</h2>

                        
                        <div className="input.group">
                            <input 
                                type="text" 
                                name="title"
                                placeholder="Title" 
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input.group">
                            <input 
                                type="text" 
                                name="isbn"
                                placeholder="ISBN" 
                                value={formData.isbn}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input.group">
                            <input 
                                type="number" 
                                name="publishYear"
                                placeholder="Publish Year" 
                                value={formData.publishYear}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input.group">
                            <input 
                                type="number" 
                                name="price"
                                placeholder="Price" 
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>  
                        
                        <div className="input.group">
                            <select 
                                name="authorId"
                                value={formData.authorId}
                                onChange={handleChange}
                                className="books-select"
                                required
                            >
                                <option value="" disabled>Select an Author</option>
                             
                                {authors.map((author) => (
                                    <option key={author.id} value={author.id}>
                                        {author.name || author.firstName + " " + author.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="submit-btn-books">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>     
    )
}