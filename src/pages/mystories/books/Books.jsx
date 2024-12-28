import React, { useState, useEffect } from 'react'
import './Books.css'
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import axios from 'axios'

function Books() {
    const [activeTab, setActiveTab] = useState('books');
    const [showModal, setShowModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

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
            console.log("Response:", response.data);
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
    
            const statusMessage = updatedBook.publish
                ? 'Kitap başarıyla yayınlandı!'
                : 'Kitap yayından kaldırıldı.';
        } catch (error) {
            console.error('Yayın durumu değiştirilirken hata oluştu:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };
    
return (
    <>
        {activeTab === 'books' && (
                    <div id="books" className={`stories-tab-pane ${activeTab === 'books' ? 'active' : ''}`}>
                        {books.map((book) => (
                            <div className="book-card mb-3" key={book.id}>
                                <div className="my-stories-book-left d-flex gap-3">
                                    <img src={book.bookCover} alt="" width="80" height="120" />
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
                                            <p className='me-2'><i className="bi bi-eye-fill me-1"></i>{book.read_count}</p>
                                            <p className='me-2'><i className="bi bi-heart-fill me-1"></i>{book.like_count}</p>
                                            <p><i className="bi bi-chat-fill me-1"></i>{book.comment_count}</p>
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
                                        <Dropdown.Toggle className='no-toggle'>
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item className='icon-link icon-link-hover' onClick={(e) => handleEdit(e, book.title)}><i className="bi bi-pen me-1"></i>Düzenle</Dropdown.Item>
                                            <Dropdown.Item className='icon-link icon-link-hover' onClick={() => handleDeleteClick(book)}><i className="bi bi-trash me-1"></i>Sil</Dropdown.Item>
                                            <Dropdown.Item className="icon-link icon-link-hover">
                                                <i className="bi bi-book me-1"></i>
                                                {book.publish ? (
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
                                                            togglePublish(book.id, book.title);
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
                                                            togglePublish(book.id, book.title);
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