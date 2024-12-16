import React, { useState } from 'react'
import './AudioBooks.css'
import { Button, Dropdown, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AudioBooks() {
    const [activeTab, setActiveTab] = useState('audiobooks');
    const [showModal, setShowModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const navigate = useNavigate();

    const [audioBooks, setAudioBooks] = useState([
        {
            id: 1,
            bookName: "Aşk ve Gurur",
            bookCover: "/images/ask-ve-gurur.jpg",
            releaseDate: "07.04.2023",
            readCount: "150M",
            likeCount: "555K",
            commentCount: "89.5K",
            totalTime: "5 saat 25 dakika",
            onPublished: true
        },
        {
            id: 2,
            bookName: "Şeker Portakalı",
            bookCover: "/images/seker-portakali.jpg",
            releaseDate: "14.01.2021",
            readCount: "560K",
            likeCount: "99K",
            commentCount: "18.6K",
            totalTime: "3 saat 19 dakika",
            onPublished: false
        }
    ])

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
        setBookToDelete(book);
        setShowModal(true);
    }

    const confirmDelete = () => {
        setAudioBooks(audioBooks.filter((b) => b.id !== bookToDelete.id));
        setShowModal(false);
        setBookToDelete(null);
    }

  return (
    <>
        {activeTab === 'audiobooks' && (
            <div id="audio-books" className={`stories-tab-pane ${activeTab === 'audiobooks' ? 'active' : ''}`}>
                {audioBooks.map((audioBook) => (
                    <div className="audio-book-card mb-3" key={audioBook.id}>
                        <div className="audio-book-left d-flex gap-3">
                            <img src={audioBook.bookCover} alt="" width="80" height="120"/>
                            <div className="audio-book-left-right">
                                <p className='audio-book-name'>{audioBook.bookName}</p>
                                <p className='audio-book-date'>Yayınlanma Tarihi: {audioBook.releaseDate}</p>
                                <div className="audio-book-istatistic">
                                    <p className='me-2'><i class="bi bi-eye-fill me-1"></i>{audioBook.readCount}</p>
                                    <p className='me-2'><i class="bi bi-heart-fill me-1"></i>{audioBook.likeCount}</p>
                                    <p><i class="bi bi-chat-fill me-1"></i>{audioBook.commentCount}</p>
                                </div>
                                <p className='audio-book-total-time'>Toplam Süre: {audioBook.totalTime}</p>
                            </div>
                        </div>
                        <div className="audio-book-right d-flex gap-2">
                            <Dropdown>
                                <Dropdown.Toggle className='no-toggle'>
                                    <i class="bi bi-three-dots-vertical"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item className='icon-link icon-link-hover' onClick={(e) => handleEdit(e, audioBook.bookName)}><i class="bi bi-pen me-1"></i>Düzenle</Dropdown.Item>
                                    <Dropdown.Item className='icon-link icon-link-hover' onClick={() => handleDeleteClick(audioBook)}><i class="bi bi-trash me-1"></i>Sil</Dropdown.Item>
                                    <Dropdown.Item className='icon-link icon-link-hover'>
                                        <i class="bi bi-book me-1"></i>
                                        {audioBook.onPublished ? (
                                            <p className='p-0 m-0'>Yayından Kaldır</p>
                                        ): (
                                            <p className='p-0 m-0'>Yayınla</p>
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