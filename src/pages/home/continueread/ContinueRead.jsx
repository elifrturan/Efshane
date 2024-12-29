import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './ContinueRead.css';

function ContinueRead() {
  const navigate = useNavigate();
  const username = "prensesingunlugu";
  const bookName = "Aşk ve Gurur";
  const [lastReadBook, setLastReadBook] = useState(null);

  const handleProfileClick = () => {
    navigate(`/${username}`);
  }

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

  useEffect(() => {
    const fetchLastReadBook = async () => {
      const token = localStorage.getItem('token');
      const parsedToken = token && token.startsWith('{') ? JSON.parse(token) : token;
      if (!parsedToken) {
          console.error("Token bulunamadı!");
          return;
      }
        try {
            const response = await axios.get(`http://localhost:3000/book-case/last`, {
                headers: {
                    Authorization: `Bearer ${parsedToken}`, 
                },
            });

            setLastReadBook(response.data); 
        } catch (error) {
            console.error("Kitap alınırken hata oluştu:", error.response?.data || error.message);
        }
    };
    fetchLastReadBook();
}, []);

  return (
    <div className="continue-read-row">
      {lastReadBook ? (
        <div className="container mt-5 mb-5">
          <div className="continue-read text-center">
            <div className="row">
              <div className="col-lg-3 book-cover">
                <h3 className='text-start ms-5 mb-3'>Okumaya Devam Et</h3>
                <img src={lastReadBook.book.bookCover} alt="book cover" width="220px" onClick={handleBookClick} style={{cursor: 'pointer'}}/> 
              </div>
              <div className="col-lg-8">
                <div className="book-content text-start"> 
                  <div className="book-content-up mt-5">
                    <div className="bookName">
                      <h4 onClick={handleBookClick} style={{cursor: 'pointer'}}>{lastReadBook.book.title}</h4> 
                    </div>
                    <div className="writer-info d-flex flex-row align-items-center" onClick={handleProfileClick}>
                      <img src={lastReadBook.user.profile_image} alt="30x30" width="25px" height="25px" className='img-fuild rounded-circle object-fit-cover'/>
                      <p className='ms-2 d-flex mt-2'>{lastReadBook.user.username}</p>
                    </div>
                    <div className="book-info mt-2">
                      {lastReadBook.book.summary}
                    </div>
                  </div>
                  <div className="book-content-down">
                    <div className="interaction d-flex">
                      <div className="read-count me-3">
                        <p><i className="bi bi-eye-fill text-muted"></i> {lastReadBook.book.analysis[0]?.read_count || 0}</p>
                      </div>
                      <div className="like-count me-3">
                        <p><i className="bi bi-heart-fill text-muted"></i>{lastReadBook.book.analysis[0]?.like_count || 0}</p>
                      </div>
                      <div className="comment-count">
                        <p><i className="bi bi-chat-fill text-muted"></i> {lastReadBook.book.analysis[0]?.comment_count || 0} </p>
                      </div>
                    </div>
                    <div className="continue-read-button">
                      <Link className='btn btn-read-continue'>Okumaya Devam Et</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Henüz bir kitap okunmadı.</p>
      )}
    </div>
  );
}

export default ContinueRead;
