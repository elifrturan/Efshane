import React, { useRef, useEffect, useState }  from 'react'
import './Popular.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendBaseUrl = 'http://localhost:3000';

function Popular() {
    const scrollRef = useRef(null);
    const [books, setBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            const token = localStorage.getItem('token');
            const parsedToken = token && token.startsWith('{') ? JSON.parse(token) : token;
            if (!parsedToken) {
                console.error("Token bulunamadı!");
                return;
            }
            try {
                const token = localStorage.getItem('token');  
                if (!token) {
                    console.error("Token bulunamadı!");
                    return;
                }
                const response = await axios.get(`http://localhost:3000/book/trend`, {
                    headers: {
                        Authorization: `Bearer ${parsedToken}`, 
                    },
                });
                setBook(response.data); 
            } catch (error) {
                console.error("Kitap alınırken hata oluştu:", error.response?.data || error.message);
            }
        };
        fetchBook();
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

    const handleProfileClick = (username) => {
        navigate(`/user/${username}`);
    }

    const handleBookClick = (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/book-details/${formattedBookName}`)
    }

    const handleAudioBookClick = (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/audio-book-details/${formattedBookName}`)
    }

    return (
        <div className="popular-books mt-5 mb-3">
            <div className="container">
                <h3 className='ms-3 mb-3'>Popülerler</h3>
                <div className="popular-books-wrapper d-flex align-items-center">
                    <i className="popular-left-arrow bi bi-arrow-left-circle-fill" onClick={scrollLeft}></i>
                    <div className="book-list-popular" ref={scrollRef} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    {books && books.map((book) => (
                        <div key={book.id} className="popularBook d-flex flex-column align-items-center justify-content-center ms-2 me-5">
                            <div
                                className="popular-book-cover"
                                onClick={() =>
                                    book.isAudioBook ? handleAudioBookClick(book.title) : handleBookClick(book.title)
                                }
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={
                                            book.bookCover?.startsWith('uploads')
                                            ? `${backendBaseUrl}/${book.bookCover}`
                                            : book.bookCover
                                        }
                                    alt={book.title}
                                    width="80"
                                    height="120"
                                />
                                {book.isAudioBook && (
                                    <img
                                        src="/images/headphone-icon.svg"
                                        className="headphone-icon"
                                    />
                                )}
                            </div>
                            <div className="popular-book-content d-flex flex-column align-items-center">
                                <div className="popular-book-title mt-1">
                                    <h6>{book.title}</h6>
                                </div>
                                <div className="popular-book-writer d-flex mb-3">
                                    <img
                                        src={book.profile_image}
                                        alt=""
                                        className="rounded-circle object-fit-cover"
                                        width="20px"
                                        height="20px"
                                        onClick={() => handleProfileClick(book.username)}
                                    />
                                    <p>{book.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                    <i className="popular-right-arrow bi bi-arrow-right-circle-fill" onClick={scrollRight}></i>
                </div>
            </div>
        </div>
    );
}

export default Popular