import React, { useState, useEffect } from 'react'
import './AudioBooks.css'
import { Button, Dropdown, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function AudioBooks() {
    const [activeTab, setActiveTab] = useState('audioBooks');
    const [showModal, setShowModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const navigate = useNavigate();
    const [audioBooks, setAudioBooks] = useState([])

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
                        ? { ...audioBook, publish: updatedAudioBook.publish }
                        : audioBook
                )
            );
    
            const statusMessage = updatedAudioBook.publish
                ? 'Kitap başarıyla yayınlandı!'
                : 'Kitap yayından kaldırıldı.';
            alert(statusMessage);
        } catch (error) {
            console.error('Bölümün yayın durumu değiştirilirken hata oluştu:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };    
console.log("asdgas");
return (
    <>
        {activeTab === 'audioBooks' && (
            <div id="audio-books" className={`stories-tab-pane ${activeTab === 'audioBooks' ? 'active' : ''}`}>
                {audioBooks.map((audioBook) => (
                    <div className="audio-book-card mb-3" key={audioBook.id}>
                        <div className="audio-book-left d-flex gap-3">
                            <img src={audioBook.bookCover} alt="" width="80" height="120"/>
                            <div className="audio-book-left-right">
                                <p className='audio-book-name'>{audioBook.title}</p>
                                <p className='stories-date'>
                                Yayınlanma Tarihi: {new Date(audioBook.publish_date).toLocaleDateString('tr-TR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                                </p>                                
                                <div className="audio-book-istatistic">
                                    <p className='me-2'><i className="bi bi-eye-fill me-1"></i>{audioBook.read_count}</p>
                                    <p className='me-2'><i className="bi bi-heart-fill me-1"></i>{audioBook.like_count}</p>
                                    <p><i className="bi bi-chat-fill me-1"></i>{audioBook.comment_count}</p>
                                </div>
                                <p className='audio-book-total-time'>Toplam Süre: {audioBook.duration}</p>
                            </div>
                        </div>
                        <div className="audio-book-right d-flex gap-2">
                            <Dropdown>
                                <Dropdown.Toggle className='no-toggle'>
                                    <i className="bi bi-three-dots-vertical"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item className='icon-link icon-link-hover' onClick={(e) => handleEdit(e, audioBook.title)}><i className="bi bi-pen me-1"></i>Düzenle</Dropdown.Item>
                                    <Dropdown.Item className='icon-link icon-link-hover' onClick={() => handleDeleteClick(audioBook)}><i className="bi bi-trash me-1"></i>Sil</Dropdown.Item>
                                    <Dropdown.Item className="icon-link icon-link-hover">
                                        <i className="bi bi-book me-1"></i>
                                        {audioBook.publish ? (
                                            <button
                                                className="p-0 m-0"
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    padding: '0',
                                                    color: 'inherit',
                                                    cursor: 'pointer',
                                                    fontSize: 'inherit',
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePublish(audioBook.id, audioBook.title);
                                                }}
                                            >
                                                Yayından Kaldır
                                            </button>
                                        ) : (
                                            <button
                                                className="p-0 m-0"
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    padding: '0',
                                                    color: 'inherit',
                                                    cursor: 'pointer',
                                                    fontSize: 'inherit',
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePublish(audioBook.id, audioBook.title);
                                                }}
                                            >
                                                Yayınla
                                            </button>
                                        )}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                ))}
            </div>
        )}
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
    </>
)
}

export default AudioBooks