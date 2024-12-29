import React, { useRef, useEffect, useState } from 'react';
import './Suggestion.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Suggestion() {
    const scrollRef = useRef(null);
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    const username = "prensesingunlugu";
    const bookName = "Aşk ve Gurur";

    const handleProfileClick = () => {
        navigate(`/user/${username}`);
    }

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

    function formatBookNameForURL(bookName) {
        return bookName
          .toLowerCase()
          .replace(/ğ/g, "g")
          .replace(/ü/g, "u")
          .replace(/ş/g, "s")
          .replace(/ı/g, "i")
          .replace(/ö/g, "o")
          .replace(/ç/g, "c")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
    }
  
    const handleBookClick = () => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/book-details/${formattedBookName}`)
    }

    return (
        <div className="suggestion-books-container mt-5 mb-3">
            <div className="container">
                <h3 className='ms-3 mb-3'>Beğenebileceklerin</h3>
                <div className="suggestion-books d-flex align-items-center">
                    <i className="suggestion-left-arrow bi bi-arrow-left-circle-fill" onClick={scrollLeft}></i>
                    <div className="books-list d-flex" ref={scrollRef} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        {books && books.map((book) => (
                            <div key={book.id} className="suggestionBook d-flex flex-column align-items-center justify-content-center ms-2 me-5">
                                <div className="suggestion-book-cover" onClick={handleBookClick} style={{cursor: 'pointer'}}>
                                    <img src={book.bookCover} alt="" width="125px"/>
                                </div>
                                <div className="suggestion-book-content d-flex flex-column align-items-center">
                                    <div className="suggestion-book-title mt-1">
                                        <h6>{book.title}</h6>
                                    </div>
                                    <div className="suggestion-book-writer d-flex mb-3">
                                        <img src={book.profile_image} alt="" className='rounded-circle object-fit-cover' width="20px" height="20px" onClick={handleProfileClick}/>
                                        <p>{book.username}</p>
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
