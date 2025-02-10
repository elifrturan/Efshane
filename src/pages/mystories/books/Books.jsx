import React, { useState, useEffect } from 'react'
import './Books.css'
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from 'react-feather';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:3000';

function Books() {
    const [activeTab, setActiveTab] = useState('books');
    const [showModal, setShowModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token bulunamadı!');
                    return;
                }
                const response = await axios.get('http://localhost:3000/book/allBooks', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBooks(response.data); 
            } catch (error) {
                console.error('Kitap alınırken hata oluştu:', error.response?.data || error.message);
            }
        };
        fetchBooks();
    }, []);

    const formatTitleForUrl = (title) => {
        const charMap = {
            'ç': 'c',
            'ğ': 'g',
            'ı': 'i',
            'ö': 'o',
            'ş': 's',
            'ü': 'u',
            'Ç': 'c',
            'Ğ': 'g',
            'İ': 'i',
            'Ö': 'o',
            'Ş': 's',
            'Ü': 'u',
        };
        
        const sanitizedTitle = title
            .split('')
            .map(char => charMap[char] || char)
            .join('');
        
        return sanitizedTitle
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') 
            .replace(/\s+/g, '-');
    } 

    const handleEdit = (e, title) => {
        e.preventDefault();

        const formattedTitle = formatTitleForUrl(title);
        navigate(`/addsection/${formattedTitle}`)        
    }

    const convertAudioBook = async (e, title) => {
        e.preventDefault();
        const formattedTitle = formatTitleForUrl(title);

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                `http://localhost:3000/audio-book/convertAudioBook/${formattedTitle}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate(`/add-voice-section/${formattedTitle}`);
        } catch (error) {
            console.error("Sesli kitap oluşturulurken hata:", error);
            alert("Sesli kitap oluşturulamadı! " + error.response?.data?.message || error.message);
        }
    };

    const handleDeleteClick = (book) => {
        if (!book || !book.id) {
            console.error("Silinecek kitabın ID'si bulunamadı!", book);
            return;
        }
        setBookToDelete(book);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!bookToDelete || !bookToDelete.id) {
            console.error("Silinecek kitap bulunamadı!", bookToDelete);
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token bulunamadı!");
                return;
            }
            await axios.delete(`http://localhost:3000/book/${bookToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            setBooks(books.filter((b) => b.id !== bookToDelete.id));
            setShowModal(false);
            setBookToDelete(null);
        } catch (error) {
            console.error('Kitap silinirken hata oluştu:', error.response?.data || error.message);
        }
    };

    const togglePublish = async (bookId, title) => {
        try {
            const encodedTitle = encodeURIComponent(title);
            const url = `http://localhost:3000/book/toggle/${encodedTitle}`;
            const response = await axios.put(
                url,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            const updatedBook = response.data;
            setBooks((prevBooks) =>
                prevBooks.map((book) =>
                    book.id === bookId
                        ? { ...book, publish: updatedBook.publish }
                        : book
                )
            );
    
            if(!updatedBook.publish) {
                setIsSuccess(false);
            } else {
                setIsSuccess(true);
                setTimeout(() => setShowToast(false), 2000);
            }
    
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (error) {
            console.error('Yayın durumu değiştirilirken hata oluştu:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };
    
    function formatNumber(num) {
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
        }
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1_000) {
            return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    }

    return (
        <>
            {activeTab === 'books' && (
                        <div id="books" className={`stories-tab-pane ${activeTab === 'books' ? 'active' : ''}`}>
                            {books.map((book) => (
                                <div className="book-card mb-3" key={book.id}>
                                    <div className="my-stories-book-left d-flex gap-3">
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
                                        <div className="stories-left-right">
                                            <p className='stories-name'>{book.title}</p>
                                            <p className='stories-date'>
                                            Yayınlanma Tarihi: {new Date(book.publish_date).toLocaleDateString('tr-TR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                            </p>
                                            <div className="stories-istatistic">
                                                <p className='me-2'><i className="bi bi-eye-fill me-1"></i>{formatNumber(book.read_count || 0)}</p>
                                                <p className='me-2'><i className="bi bi-heart-fill me-1"></i>{formatNumber(book.like_count || 0)}</p>
                                                <p><i className="bi bi-chat-fill me-1"></i>{formatNumber(book.comment_count || 0)}</p>
                                            </div>
                                            {!book.isAudioBook && (
                                                <Button onClick={(e) => convertAudioBook(e, book.title)}>
                                                    <i className="bi bi-record-circle me-2"></i>Sesli Kitaba Dönüştür
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="my-stories-book-right d-flex gap-2">
                                        <Dropdown>
                                            <Dropdown.Toggle className="no-toggle">
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item 
                                                    className="icon-link icon-link-hover"
                                                    onClick={(e) => handleEdit(e, book.title)}
                                                >
                                                    <i className="bi bi-pen me-1"></i> Düzenle
                                                </Dropdown.Item>
                                                <Dropdown.Item 
                                                    className="icon-link icon-link-hover"
                                                    onClick={() => handleDeleteClick(book)}
                                                >
                                                    <i className="bi bi-trash me-1"></i> Sil
                                                </Dropdown.Item>
                                                <Dropdown.Item 
                                                    className="icon-link icon-link-hover"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        togglePublish(book.id, book.title);
                                                    }}
                                                >
                                                    <i className="bi bi-book me-1"></i>
                                                    {book.publish ? 'Yayından Kaldır' : 'Yayınla'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Silme Modalı */}
                    <Modal show={showModal} onHide={() => setShowModal(false)} centered className='stories-delete-modal'>
                        <Modal.Header closeButton>
                            <Modal.Title>Kitabını silmek mi istiyorsun?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Kitabını silmek istediğin için üzgünüz. Bu işlem geri alınamaz. Emin misin?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => setShowModal(false)}>
                                İptal
                            </Button>
                            <Button onClick={confirmDelete}>
                                Sil
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Yayinlanma Animasyonu */}
                    <AnimatePresence>
                        {showToast && (
                            <motion.div 
                                className="toast-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div 
                                    className={`toast-box ${isSuccess ? "success" : "error"}`} 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: 360 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CheckCircle size={100} />
                                    <p className='mt-4'>
                                        {isSuccess ? "Hikaye başarıyla yayınlandı!" : "Hikaye başarıyla yayından kaldırıldı!"}
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
        </>
    )
}

export default Books