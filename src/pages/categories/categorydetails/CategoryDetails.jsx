import React, { useEffect } from 'react'
import './CategoryDetails.css'
import Navbar from "../../../layouts/navbar/Navbar"
import Footer from "../../../layouts/footer/Footer"
import { useParams } from 'react-router-dom'

function CategoryDetails() {
    const { categoryName } = useParams();

    const books = [
        { bookImage: "/images/book.jpg", bookName: "Kiraz Mevsimi", writerImage: "/images/woman-pp.jpg", writerName: "prensesingunlugu"},
        { bookImage: "/images/book2.jpeg", bookName: "Oyun Bitti", writerImage: "/images/woman-pp.jpg", writerName: "fermancakil"},
        { bookImage: "/images/book.jpg", bookName: "Kiraz Mevsimi", writerImage: "/images/woman-pp.jpg", writerName: "prensesingunlugu"},
        { bookImage: "/images/book2.jpeg", bookName: "Oyun Bitti", writerImage: "/images/woman-pp.jpg", writerName: "fermancakil"},
        { bookImage: "/images/book.jpg", bookName: "Kiraz Mevsimi", writerImage: "/images/woman-pp.jpg", writerName: "prensesingunlugu"},
        { bookImage: "/images/book2.jpeg", bookName: "Oyun Bitti", writerImage: "/images/woman-pp.jpg", writerName: "fermancakil"},
        { bookImage: "/images/book.jpg", bookName: "Kiraz Mevsimi", writerImage: "/images/woman-pp.jpg", writerName: "prensesingunlugu"},
        { bookImage: "/images/book2.jpeg", bookName: "Oyun Bitti", writerImage: "/images/woman-pp.jpg", writerName: "fermancakil"},
        { bookImage: "/images/book.jpg", bookName: "Kiraz Mevsimi", writerImage: "/images/woman-pp.jpg", writerName: "prensesingunlugu"},
        { bookImage: "/images/book2.jpeg", bookName: "Oyun Bitti", writerImage: "/images/woman-pp.jpg", writerName: "fermancakil"},
        { bookImage: "/images/book.jpg", bookName: "Kiraz Mevsimi", writerImage: "/images/woman-pp.jpg", writerName: "prensesingunlugu"},
        { bookImage: "/images/book2.jpeg", bookName: "Oyun Bitti", writerImage: "/images/woman-pp.jpg", writerName: "fermancakil"},
        { bookImage: "/images/book.jpg", bookName: "Kiraz Mevsimi", writerImage: "/images/woman-pp.jpg", writerName: "prensesingunlugu"}
    ]

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

  return (
    <div className='category-details-page'>
        <Navbar/>
        <div className="container">
                <h2 className='mt-5 mb-5 text-center'>{categoryName}</h2>
                <div className="details-book-list">
                    <div className="row">
                        {books.map((book, index) => (
                            <div className="details-book-card col-lg-3 col-md-4 col-sm-6 col-xs-12 d-flex flex-column align-items-center mb-5" key={index}>
                                <img src={book.bookImage} alt="book-cover" width="180px" height="281px"/>
                                <div className="details-book-content d-flex flex-column align-items-center">
                                    <p className='mt-1'>{book.bookName}</p>
                                    <div className="details-book-writer d-flex">
                                        <img src={book.writerImage} alt="" className='rounded-circle' width="24px" height="24px"/>
                                        <p className='ms-2'>{book.writerName}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
        <Footer/>
    </div>
  )
}

export default CategoryDetails