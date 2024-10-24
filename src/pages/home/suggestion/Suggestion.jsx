import React, { useRef } from 'react'
import './Suggestion.css'

function Suggestion() {
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
    <div className="suggestion-books mt-5 mb-3">
      <div className="container">
        <h3 className='ms-3 mb-3'>Beğenebileceklerin</h3>
        <div className="suggestion-books d-flex" ref={scrollRef} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <i className="suggestion-left-arrow bi bi-arrow-left-circle-fill" onClick={scrollLeft}></i>
          {books.map((book, index) => (
            <div key={index} className="suggestionBook d-flex flex-column align-items-center justify-content-center ms-2 me-5">
              <div className="suggestion-book-cover">
                <img src={book.coverImage} alt="" width="125px"/>
              </div>
              <div className="suggestion-book-content d-flex flex-column align-items-center">
                <div className="suggestion-book-title mt-1">
                  <h6>{book.title}</h6>
                </div>
                <div className="suggestion-book-writer d-flex">
                  <img src={book.authorImage} alt="" className='img-fuild rounded-circle' width="24px" height="24px"/>
                  <p className='ms-1'>{book.author}</p>
                </div>
              </div>
          </div>
          ))}
          
        </div>
        <i className="suggestion-right-arrow bi bi-arrow-right-circle-fill" onClick={scrollRight}></i>
      </div>
    </div>
  )
}

export default Suggestion