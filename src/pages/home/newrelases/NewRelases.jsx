import './NewRelases.css'
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

function NewRelases() {
    const scrollRef = useRef(null);
    const [books, setBook] = useState(null);

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
    <div className="new-relases mt-5 mb-3">
      <div className="container">
        <h3 className='ms-3'>Yeni Çıkanlar</h3>
        <div className="new-books d-flex align-items-center" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <i className="left-arrow bi bi-arrow-left-circle-fill" onClick={scrollLeft} ></i>
          <div className="book-list-newrelases" ref={scrollRef} >
            {books && books.map((book) => (
              <div key={book.id} className="book1 d-flex flex-column align-items-center justify-content-center ms-2 me-5">
                <div className="new-book-cover">
                  <img src={book.bookCover} alt="" width="125px"/>
                </div>
                <div className="new-book-content d-flex flex-column align-items-center">
                  <div className="new-book-title mt-1">
                    <h6>{book.title}</h6>
                  </div>
                  <div className="new-book-writer d-flex">
                    <img src={book.user.profile_image} alt="" className='img-fuild rounded-circle' width="24px" height="24px"/>
                    <p className='ms-1'>{book.user.username}</p>
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
