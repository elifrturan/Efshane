import React, { useState, useEffect } from 'react'
import './Library.css'
import Footer from '../../layouts/footer/Footer'
import { Button, Modal } from 'react-bootstrap'
import axios from 'axios'

//kullanıcının okuduğu ve dinlediği kitapların listelendiği sayfa
function Library() {
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const [books, setBooks] = useState([
        {
            id: 1,
            name: "Aşk ve Gurur",
            image: "/images/ask-ve-gurur.jpg"
        },
        {
            id: 2,
            name: "İki Şehrin Hikayesi",
            image: "/images/iki-sehrin-hikayesi.jpeg"
        },
        {
            id: 3,
            name: "Şeker Portakalı",
            image: "/images/seker-portakali.jpg"
        },
        {
            id: 4,
            name: "Böğürtlen Kışı",
            image: "/images/bogurtlen-kisi.jpeg"
        },
        {
            id: 5,
            name: "Pamuk İpliğinden Hayaller",
            image: "/images/pamuk-ipliginden-hayaller.jpeg"
        },
        {
            id: 6,
            name: "Pamuk İpliğinden Hayaller",
            image: "/images/pamuk-ipliginden-hayaller.jpeg"
        },
        {
            id: 7,
            name: "Böğürtlen Kışı",
            image: "/images/bogurtlen-kisi.jpeg"
        },
    ])

    const handleShowModal = (bookName) => {
        setSelectedBook(bookName);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBook(null);
    }

    const handleConfirmRemove = () => {
        setBooks(books.filter(book => book.id !== selectedBook.id));
        setShowModal(false);
        setSelectedBook(null);
    }

    return (
        <>
            <div className="library-page">
                <h2 className='text-center mt-5'>Kitaplığım</h2>
                <div className="book-list">
                    {books.map((book) => (
                        <div className="book" key={book.id}>
                            <div className="book-img">
                                <img src={book.image} alt={book.name}/>
                                <div className="book-overlay">
                                    <Button className='book-button' href='/book-details/ask-ve-gurur'>Detay</Button>
                                    <Button className='book-button' href='/read-book/ask-ve-gurur'>Okumaya Devam Et</Button>
                                    <Button className='book-button' onClick={() => handleShowModal(book)}>Kitaplıktan Kaldır</Button>
                                </div>
                            </div>
                            <div className="book-name">
                                {book.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className='library-modal' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Emin Misiniz ?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{selectedBook && selectedBook.name} kitabını kitaplıktan kaldırmak istediğinizden emin misiniz?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseModal}>İptal</Button>
                    <Button onClick={handleConfirmRemove}>Evet, Kaldır</Button>
                </Modal.Footer>
            </Modal>
            <Footer/>
        </>
    )
}

export default Library