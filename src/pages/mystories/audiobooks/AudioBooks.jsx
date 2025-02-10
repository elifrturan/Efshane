import React, { useState, useEffect } from 'react'
import './AudioBooks.css'
import { Button, Dropdown, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from 'react-feather';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:3000';

function AudioBooks() {
    const [activeTab, setActiveTab] = useState('audioBooks');
    const [showModal, setShowModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const navigate = useNavigate();
    const [audioBooks, setAudioBooks] = useState([]);
    const [showToast, setShowToast] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchAudioBooks = async () => {
            try {
                const token = localStorage.getItem('token');  
                if (!token) {
                    console.error("Token bulunamadı!");
                    return;
                }
                const response = await axios.get(`http://localhost:3000/audio-book/allAudioBooks`, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                setAudioBooks(response.data); 
            } catch (error) {
                console.error("İlgili sesli kitap alınırken hata oluştu:", error.response?.data || error.message);
            }
        };
        fetchAudioBooks();
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

    const handleEdit = (e, bookName) => {
        e.preventDefault();
        const formattedTitle = formatTitleForUrl(bookName);
        navigate(`/add-voice-section/${formattedTitle}`)        
    }

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
            await axios.delete(`http://localhost:3000/audio-book/${bookToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            setAudioBooks(audioBooks.filter((b) => b.id !== bookToDelete.id));
            setShowModal(false);
            setBookToDelete(null);
        } catch (error) {
            console.error('Kitap silinirken hata oluştu:', error.response?.data || error.message);
        }
    };

    const togglePublish = async (audioBookId, title) => {
        try {
            const encodedTitle = encodeURIComponent(title);
    
            const url = `http://localhost:3000/audio-book/toggle/${encodedTitle}`;
            const response = await axios.put(
                url,
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            const updatedAudioBook = response.data;
    
            setAudioBooks((prevAudioBooks) =>
                prevAudioBooks.map((audioBook) =>
                    audioBook.id === audioBookId
                        ? { ...audioBook, publish: updatedAudioBook.publish, title: decodeURIComponent(updatedAudioBook.title) }
                        : audioBook
                )
            );
    
            if(!updatedAudioBook.publish) {
                setIsSuccess(false);
            } else {
                setIsSuccess(true);
                setTimeout(() => setShowToast(false), 4000);
            }
    
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } catch (error) {
            console.error('Bölümün yayın durumu değiştirilirken hata oluştu:', error);
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
            {activeTab === 'audioBooks' && (
                <div id="audio-books" className={`stories-tab-pane ${activeTab === 'audioBooks' ? 'active' : ''}`}>
                    {audioBooks.map((audioBook) => (
                        <div className="audio-book-card mb-3" key={audioBook.id}>
                            <div className="audio-book-left d-flex gap-3">
                                <img
                                    src={
                                        audioBook.bookCover?.startsWith('uploads')
                                            ? `${backendBaseUrl}/${audioBook.bookCover}`
                                            : audioBook.bookCover
                                        }
                                    alt={audioBook.title}
                                    width="80"
                                    height="120"
                                />
                                <div className="audio-book-left-right">
                                    <p className='audio-book-name'>{audioBook.title}</p>
                                    <p className='stories-date'>
                                        Yayınlanma Tarihi: {new Date(audioBook.publish_date).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>                                
                                    <div className="audio-book-istatistic">
                                        <p className='me-2'><i className="bi bi-eye-fill me-1"></i>{formatNumber(audioBook.read_count || 0)}</p>
                                        <p className='me-2'><i className="bi bi-heart-fill me-1"></i>{formatNumber(audioBook.like_count || 0)}</p>
                                        <p><i className="bi bi-chat-fill me-1"></i>{formatNumber(audioBook.comment_count || 0)}</p>
                                    </div>
                                    <p className='audio-book-total-time'>Toplam Süre: {audioBook.duration}</p>
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
                                            onClick={(e) => handleEdit(e, audioBook.title)}
                                        >
                                            <i className="bi bi-pen me-1"></i> Düzenle
                                        </Dropdown.Item>
                                        <Dropdown.Item 
                                            className="icon-link icon-link-hover"
                                            onClick={() => handleDeleteClick(audioBook)}
                                        >
                                            <i className="bi bi-trash me-1"></i> Sil
                                        </Dropdown.Item>
                                        <Dropdown.Item 
                                            className="icon-link icon-link-hover"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePublish(audioBook.id, audioBook.title);
                                            }}
                                        >
                                            <i className="bi bi-book me-1"></i>
                                            {audioBook.publish ? 'Yayından Kaldır' : 'Yayınla'}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Silme Modalı */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered className='audio-book-delete-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Sesli kitabını silmek mi istiyorsun?</Modal.Title>
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

export default AudioBooks