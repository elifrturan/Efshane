import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ContinueRead.css';

function ContinueRead() {
  const [lastReadBook, setLastReadBook] = useState(null);

  useEffect(() => {
    const fetchLastReadBook = async () => {
        try {
            const token = localStorage.getItem('token');  
            console.log("Token:", token); 
            if (!token) {
                console.error("Token bulunamadı!");
                return;
            }
            const response = await axios.get(`http://localhost:3000/book-case/last`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
            console.log("Backend'den gelen yanıt:", response.data); 
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
                <img src={lastReadBook.book.bookCover} alt="book cover" width="220px"/> 
              </div>
              <div className="col-lg-8">
                <div className="book-content text-start"> 
                  <div className="book-content-up mt-5">
                    <div className="bookName">
                      <h4>{lastReadBook.book.title}</h4> 
                    </div>
                    <div className="writer-info d-flex flex-row align-items-center">
                      <img src={lastReadBook.user.profile_image} alt="30x30" width="30px" height="30px" className='img-fuild rounded-circle'/>
                      <p className='ms-2 d-flex mt-2'>{lastReadBook.user.username}</p>
                    </div>
                    <div className="book-info opacity-75 mt-2">
                      {lastReadBook.book.summary}
                    </div>
                  </div>
                  <div className="book-content-down">
                    <div className="interaction d-flex">
                      <div className="read-count me-3">
                        <p><i className="bi bi-eye-fill"></i> {lastReadBook.book.analysis[0]?.read_count || 0}</p>
                      </div>
                      <div className="like-count me-3">
                        <p><i className="bi bi-balloon-heart-fill"></i>{lastReadBook.book.analysis[0]?.like_count || 0}</p>
                      </div>
                      <div className="comment-count">
                        <p><i className="bi bi-chat-heart-fill"></i> {lastReadBook.book.analysis[0]?.comment_count || 0} </p>
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
