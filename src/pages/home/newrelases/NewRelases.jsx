import React, { useRef } from 'react'
import './NewRelases.css'

function NewRelases() {
    const scrollRef = useRef(null);

    const books = [
      { title: "Kiraz Mevsimi", author: "prensesingunlugu", coverImage: "/images/book.jpg", authorImage: "/images/woman-pp.jpg"},
      { title: "Kiraz Mevsimi", author: "prensesingunlugu", coverImage: "/images/book.jpg", authorImage: "/images/woman-pp.jpg"},
      { title: "Kiraz Mevsimi", author: "prensesingunlugu", coverImage: "/images/book.jpg", authorImage: "/images/woman-pp.jpg"},
      { title: "Kiraz Mevsimi", author: "prensesingunlugu", coverImage: "/images/book.jpg", authorImage: "/images/woman-pp.jpg"},
      { title: "Kiraz Mevsimi", author: "prensesingunlugu", coverImage: "/images/book.jpg", authorImage: "/images/woman-pp.jpg"},
      { title: "Kiraz Mevsimi", author: "prensesingunlugu", coverImage: "/images/book.jpg", authorImage: "/images/woman-pp.jpg"},
      { title: "Kiraz Mevsimi", author: "prensesingunlugu", coverImage: "/images/book.jpg", authorImage: "/images/woman-pp.jpg"},
      { title: "Kiraz Mevsimi", author: "prensesingunlugu", coverImage: "/images/book.jpg", authorImage: "/images/woman-pp.jpg"},
      { title: "Kiraz Mevsimi", author: "prensesingunlugu", coverImage: "/images/book.jpg", authorImage: "/images/woman-pp.jpg"},
      { title: "Kiraz Mevsimi", author: "prensesingunlugu", coverImage: "/images/book.jpg", authorImage: "/images/woman-pp.jpg"}
    ]

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
        <h3 className='ms-3 mb-3'>Yeni Çıkanlar</h3>
        <div className="new-books d-flex" ref={scrollRef} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <i className="left-arrow bi bi-arrow-left-circle-fill" onClick={scrollLeft}></i>
          {books.map((book, index) => (
            <div key={index} className="book1 d-flex flex-column align-items-center justify-content-center ms-2 me-5">
              <div className="new-book-cover">
                <img src={book.coverImage} alt="" width="125px"/>
              </div>
              <div className="new-book-content d-flex flex-column align-items-center">
                <div className="new-book-title mt-1">
                  <h6>{book.title}</h6>
                </div>
                <div className="new-book-writer d-flex">
                  <img src={book.authorImage} alt="" className='img-fuild rounded-circle' width="24px" height="24px"/>
                  <p className='ms-1'>{book.author}</p>
                </div>
              </div>
          </div>
          ))}
          
        </div>
        <i className="right-arrow bi bi-arrow-right-circle-fill" onClick={scrollRight}></i>
      </div>
    </div>
  )
}

export default NewRelases