import React, { useRef } from 'react'
import './Popular.css'

function Popular() {
    const scrollRef = useRef(null);

    const books = [
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      { title: "Oyun Bitti", author: "ferhancalik", coverImage: "/images/book2.jpeg", authorImage: "/images/woman-pp.jpg"},
      
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
    <div className="popular-books mt-5 mb-3">
      <div className="container">
        <h3 className='ms-3 mb-3'>Popülerler</h3>
        <div className="popular-books d-flex" ref={scrollRef} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <i className="popular-left-arrow bi bi-arrow-left-circle-fill" onClick={scrollLeft}></i>
          {books.map((book, index) => (
            <div key={index} className="populerBook d-flex flex-column align-items-center justify-content-center ms-2 me-5">
              <div className="popular-book-cover">
                <img src={book.coverImage} alt="" width="125px"/>
              </div>
              <div className="popular-book-content d-flex flex-column align-items-center">
                <div className="popular-book-title mt-1">
                  <h6>{book.title}</h6>
                </div>
                <div className="popular-book-writer d-flex">
                  <img src={book.authorImage} alt="" className='img-fuild rounded-circle' width="24px" height="24px"/>
                  <p className='ms-1'>{book.author}</p>
                </div>
              </div>
          </div>
          ))}
          
        </div>
        <i className="popular-right-arrow bi bi-arrow-right-circle-fill" onClick={scrollRight}></i>
      </div>
    </div>
  )
}

export default Popular