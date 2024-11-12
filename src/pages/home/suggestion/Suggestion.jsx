import React, { useRef, useEffect, useState } from 'react';
import './Suggestion.css';
import axios from 'axios';


function Suggestion() {
    const scrollRef = useRef(null);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBookSuggestion = async () => {
            try {
                const token = localStorage.getItem('token');  
                if (!token) {
                    console.error("Token bulunamadı!");
                    return;
                }
                const response = await axios.get(`http://localhost:3000/categories/getUser`, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                setBooks(response.data); 
            } catch (error) {
                console.error("Kitap alınırken hata oluştu:", error.response?.data || error.message);
            }
        };
        fetchBookSuggestion();
    }, []);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className="suggestion-books-container mt-5 mb-3">
            <div className="container">
                <h3 className='ms-3 mb-3'>Beğenebileceklerin</h3>
                <div className="suggestion-books d-flex align-items-center">
                    <i className="suggestion-left-arrow bi bi-arrow-left-circle-fill" onClick={scrollLeft}></i>
                    <div className="books-list d-flex" ref={scrollRef}>
                        {books && books.map((book) => (
                            <div key={book.id} className="suggestionBook d-flex flex-column align-items-center justify-content-center ms-2 me-5">
                                <div className="suggestion-book-cover">
                                    <img src={book.bookCover} alt="" width="125px"/>
                                </div>
                                <div className="suggestion-book-content d-flex flex-column align-items-center">
                                    <div className="suggestion-book-title mt-1">
                                        <h6>{book.title}</h6>
                                    </div>
                                    <div className="suggestion-book-writer d-flex">
                                        <img src={book.profile_image} alt="" className='img-fliud rounded-circle' width="24px" height="24px"/>
                                        <p className='ms-1'>{book.username}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <i className="suggestion-right-arrow bi bi-arrow-right-circle-fill" onClick={scrollRight}></i>
                </div>
            </div>
        </div>
    );
}

export default Suggestion;
