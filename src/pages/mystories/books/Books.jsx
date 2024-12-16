import React, { useState } from 'react'
import './Books.css'
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Modal } from 'react-bootstrap';

function Books() {
    const [activeTab, setActiveTab] = useState('books');
    const [showModal, setShowModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const navigate = useNavigate();

    const [books, setBooks] = useState([
        {
            id: 1,
            bookName: "Küçük Mutluluklar",
            bookCover: "/images/book.jpg",
            releaseDate: "15.03.2022",
            readCount: 125,
            likeCount: 10,
            commentCount: 5,
            onPublished: true
        },
        {
            id: 2,
            bookName: "Kodumun Hataları Niye Bitmiyor?",
            bookCover: "/images/book2.jpeg",
            releaseDate: "22.07.2023",
            readCount: 999,
            likeCount: 185,
            commentCount: 86,
            onPublished: false
        },
        {
            id: 3,
            bookName: "Simyacı",
            bookCover: "/images/simyaci.jpg",
            releaseDate: "22.07.2023",
            readCount: 875,
            likeCount: 60,
            commentCount: 120,
            onPublished: false
        },
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
        navigate(`/addsection/${formattedTitle}`)        
    }

    const handleDeleteClick = (book) => {
        setBookToDelete(book);
        setShowModal(true);
    }

    const confirmDelete = () => {
        setBooks(books.filter((b) => b.id !== bookToDelete.id));
        setShowModal(false);
        setBookToDelete(null);
    }

  return (
    <>
        {activeTab === 'books' && (
                    <div id="books" className={`stories-tab-pane ${activeTab === 'books' ? 'active' : ''}`}>
                        {books.map((book) => (
                            <div className="book-card mb-3" key={book.id}>
                                <div className="my-stories-book-left d-flex gap-3">
                                    <img src={book.bookCover} alt="" width="80" height="120" />
                                    <div className="stories-left-right">
                                        <p className='stories-name'>{book.bookName}</p>
                                        <p className='stories-date'>Yayınlanma Tarihi: {book.releaseDate}</p>
                                        <div className="stories-istatistic">
                                            <p className='me-2'><i class="bi bi-eye-fill me-1"></i>{book.readCount}</p>
                                            <p className='me-2'><i class="bi bi-heart-fill me-1"></i>{book.likeCount}</p>
                                            <p><i class="bi bi-chat-fill me-1"></i>{book.commentCount}</p>
                                        </div>
                                        <Button><i class="bi bi-record-circle me-2"></i>Sesli Kitaba Dönüştür</Button>
                                    </div>
                                </div>
                                <div className="my-stories-book-right d-flex gap-2">
                                    <Dropdown>
                                        <Dropdown.Toggle className='no-toggle'>
                                            <i class="bi bi-three-dots-vertical"></i>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item className='icon-link icon-link-hover' onClick={(e) => handleEdit(e, book.bookName)}><i class="bi bi-pen me-1"></i>Düzenle</Dropdown.Item>
                                            <Dropdown.Item className='icon-link icon-link-hover' onClick={() => handleDeleteClick(book)}><i class="bi bi-trash me-1"></i>Sil</Dropdown.Item>
                                            <Dropdown.Item className='icon-link icon-link-hover'>
                                                <i class="bi bi-book me-1"></i>
                                                {book.onPublished ? (
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
    </>
  )
}

export default Books