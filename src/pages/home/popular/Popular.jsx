import React, { useRef, useEffect, useState }  from 'react'
import './Popular.css'
import axios from 'axios';

function Popular() {
    const scrollRef = useRef(null);
    const [books, setBook] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const token = localStorage.getItem('token');  
                console.log("Token:", token); 
                if (!token) {
                    console.error("Token bulunamadı!");
                    return;
                }
                const response = await axios.get(`http://localhost:3000/book/trend`, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                console.log("Backend'den gelen yanıt:", response.data); 
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

    return (
        <div className="popular-books mt-5 mb-3">
            <div className="container">
                <h3 className='ms-3 mb-3'>Popülerler</h3>
                <div className="popular-books-wrapper d-flex align-items-center" ref={scrollRef} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    <i className="popular-left-arrow bi bi-arrow-left-circle-fill" onClick={scrollLeft}></i>
                    <div className="book-list-popular" ref={scrollRef}>
                        {books && books.map((book) => (
                            <div key={book.id} className="populerBook d-flex flex-column align-items-center justify-content-center ms-2 me-5">
                                <div className="popular-book-cover">
                                    <img src={book.bookCover} alt="" width="125px"/>
                                </div>
                                <div className="popular-book-content d-flex flex-column align-items-center">
                                    <div className="popular-book-title mt-1">
                                        <h6>{book.title}</h6>
                                    </div>
                                    <div className="popular-book-writer d-flex">
                                        <img src={book.user.profile_image} alt="" className='img-fliud rounded-circle' width="24px" height="24px"/>
                                        <p className='ms-1'>{book.user.username}</p>
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