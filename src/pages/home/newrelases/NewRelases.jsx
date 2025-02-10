import './NewRelases.css'
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendBaseUrl = 'http://localhost:3000';

function NewRelases(initialLastActivity) {
    const scrollRef = useRef(null);
    const [books, setBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      const parsedToken = token && token.startsWith('{') ? JSON.parse(token) : token;
    
      if (!parsedToken) {
        console.error("Token bulunamadı!");
        return;
      }
    
      const fetchBook = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/book`, {
            headers: {
              Authorization: `Bearer ${parsedToken}`,
            },
          });
          const filteredBooks = response.data.filter(book => book.publish === true);
          setBook(filteredBooks);
        } catch (error) {
          console.error("Kitap alınırken hata oluştu:", error.response?.data || error.message);
        }
      };
    
      fetchBook();
    }, [initialLastActivity]);

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
    <div className="new-relases mt-5 mb-3">
      <div className="container">
        <h3 className='ms-3'>Yeni Çıkanlar</h3>
        <div className="new-books d-flex align-items-center">
          <i className="left-arrow bi bi-arrow-left-circle-fill" onClick={scrollLeft} ></i>
          <div className="book-list-newrelases" ref={scrollRef} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {books && books.map((book) => (
                    <div key={book.id} className="book1 d-flex flex-column align-items-center justify-content-center ms-2 me-5">
                        <div
                            className="new-book-cover"
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
                        <div className="newrelases-book-content d-flex flex-column align-items-center">
                            <div className="newrelases-book-title mt-1">
                                <h6>{book.title}</h6>
                            </div>
                            <div className="newrelases-book-writer d-flex mb-3">
                                <img
                                    src={
                                        book?.profile_image
                                            ? book.profile_image.startsWith('uploads')
                                                ? `${backendBaseUrl}/${book.profile_image}`
                                                : book.profile_image
                                            : 'default-background.jpg' 
                                    }
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
          <i className="right-arrow bi bi-arrow-right-circle-fill" onClick={scrollRight}></i>
        </div>
      </div>
    </div>
  )
}

export default NewRelases;
