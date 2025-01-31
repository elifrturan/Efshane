import React, { useState, useEffect } from 'react'
import './BookCase.css'
import Footer from '../../layouts/footer/Footer'
import { Button, Modal } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const backendBaseUrl = 'http://localhost:3000';

function BookCase() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [books, setBooks] = useState([]);
    const [audioBooks, setAudioBooks] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token bulunamadı!');
                    return;
                }

                const response = await axios.get(`${backendBaseUrl}/book-case/allBooks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Tüm öğeler:', response.data);

                const books = response.data.filter(item => item.type === 'book');
                const audioBooks = response.data.filter(item => item.type === 'audioBook');

                setBooks(books);
                setAudioBooks(audioBooks);
            } catch (error) {
                console.error('Öğeler alınırken hata oluştu:', error.response?.data || error.message);
            }
        };
        fetchItems();
    }, []);

    const handleConfirmRemove = async () => {
        if (!selectedBook) return;

        const formattedBookName = formatBookNameForURL(selectedBook);

        try {
            if (audioBooks.some(audioBook => audioBook.title === selectedBook)) {
                const response = await axios.post(
                    `${backendBaseUrl}/book-case/audioBook/${formattedBookName}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                console.log('Sesli kitap kaldırıldı:', response.data);

                setAudioBooks(audioBooks.filter(audioBook => audioBook.title !== selectedBook));
            } else {
                const response = await axios.post(
                    `${backendBaseUrl}/book-case/book/${formattedBookName}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                console.log('Kitap kaldırıldı:', response.data);

                setBooks(books.filter(book => book.title !== selectedBook));
            }

            setShowModal(false);
            setSelectedBook(null);
        } catch (error) {
            console.error('Kitap kaldırma hatası:', error.response?.data || error.message);
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

    const handleShowModal = (bookName) => {
        setSelectedBook(bookName);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBook(null);
    }

    const handleBookClick = (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/book-details/${formattedBookName}`)
    }

    const handleAudioBookClick = (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/audio-book-details/${formattedBookName}`)
    }

    const handleReadBookClick = (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/read-book/${formattedBookName}`);
    }

    const handleListenAudioBookClick = (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/listen-audio-book/${formattedBookName}`);
    }

    return (
        <>
            <div className="library-page">
                <h2 className='text-center mt-5'>Kitaplığım</h2>
                <div className="book-list">
                {books.map((book) => (
                    <div className="book" key={book.id}>
                        <div className="book-img">
                            <img 
                                src={
                                    book?.bookCover
                                        ? book?.bookCover.startsWith('uploads')
                                            ? `${backendBaseUrl}/${book?.bookCover}`
                                            : book?.bookCover
                                        : 'default-background.jpg' 
                                    } 
                                alt={book.title} 
                            />
                            <div className="book-overlay">
                                <Button className="book-button" onClick={() => handleBookClick(book.title)}>Detay</Button>
                                <Button className="book-button" onClick={() => handleReadBookClick(book.title)}>Okumaya Devam Et</Button>
                                <Button className="book-button" onClick={() => handleShowModal(book.title)}>Kitaplıktan Kaldır</Button>
                            </div>
                        </div>
                        <div className="book-name">
                            {book.title}
                        </div>
                    </div>
                ))}

                {audioBooks.map((audioBook) => (
                    <div className="book" key={audioBook.id}>
                        <div className="book-img">
                            <img 
                                src={
                                    audioBook?.bookCover
                                        ? audioBook?.bookCover.startsWith('uploads')
                                            ? `${backendBaseUrl}/${audioBook?.bookCover}`
                                            : audioBook?.bookCover
                                        : 'default-background.jpg' 
                                } 
                                alt={audioBook.title} 
                            />
                            {audioBook && (
                                <img
                                    src="/images/headphone-icon.svg"
                                    className="headphone-icon"
                                />
                            )}
                            <div className="book-overlay">
                                <Button className="book-button" onClick={() => handleAudioBookClick(audioBook.title)}>Detay</Button>
                                <Button className="book-button" onClick={() => handleListenAudioBookClick(audioBook.title)}>Dinlemeye Devam Et</Button>
                                <Button className="book-button" onClick={() => handleShowModal(audioBook.title)}>Kitaplıktan Kaldır</Button>
                            </div>
                        </div>
                        <div className="book-name">{audioBook.title}</div>
                    </div>
                ))}
                </div>  
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className='library-modal' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Emin Misiniz ?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{selectedBook && selectedBook.title} kitabını kitaplıktan kaldırmak istediğinizden emin misiniz?</p>
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

export default BookCase