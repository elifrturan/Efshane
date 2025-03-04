import React, { useEffect, useState } from 'react'
import './AudioBookDetails.css'
import Footer from '../../layouts/footer/Footer'
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap'
import axios from 'axios';

const backendBaseUrl = 'http://localhost:3000';

function AudioBookDetails() {
    const navigate = useNavigate();
    const { bookName: formattedBookName } = useParams();
    const [activeTab, setActiveTab] = useState('chapters');
    const [newComment, setNewComment] = useState("");
    const [bookDetails, setBookDetails] = useState({});
    const [chapters, setChapters] = useState([]);
    const [comments, setComments] = useState([]);
    const [isAddedToLibrary, setIsAddedToLibrary] = useState(formattedBookName.isAudioBookCase);
    const [isAddedToListeningList, setIsAddedListeningList] = useState(bookDetails.isListeningList);
    const [showModal, setShowModal] = useState(false);
    const [selectedListId, setSelectedListId] = useState(null);
    const [showNewListModal, setShowNewListModal] = useState(false);

    const handleClose = () => {
        setShowModal(false);
        if (selectedListId !== null) {
            setIsAddedListeningList(true); 
        } else {
            setIsAddedListeningList(false);
        }
        
    }

    const handleNewListClose = () => {
        setShowNewListModal(false);
        setShowModal(true);
    }

    const handleNewListOpen = () => {
        setShowNewListModal(true);
        setShowModal(close);
    }

    useEffect(() => {
        const fetchAudioBookDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/audio-book/home/${formattedBookName}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setBookDetails(response.data);
                const isBookInListeningList = response.data[0]?.isListeningList;
                setIsAddedListeningList(isBookInListeningList); 
                const isBookInBookCase = response.data[0]?.isAudioBookCase;
                setIsAddedToLibrary(isBookInBookCase);
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        };

        fetchAudioBookDetails();
    }, [formattedBookName]);

    useEffect(() => {
        if (bookDetails[0]?.comments) {
            setComments(bookDetails[0].comments);
        }
    }, [bookDetails]);

    useEffect(() => {
        const fetchChapterDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/episode/${formattedBookName}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setChapters(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }; 
        fetchChapterDetails();
    }, [formattedBookName]);
    
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

    const handleAddToLibrary = async () => {
        const previousState = isAddedToLibrary; 
        setIsAddedToLibrary(!previousState); 
    
        try {
            const response = await axios.post(
                `http://localhost:3000/book-case/audioBook/${formattedBookName}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            if (response.data.message === "Kütüphaneye eklendi.") {
                setIsAddedToLibrary(true);
            } else if (response.data.message === "Kütüphaneden çıkarıldı.") {
                setIsAddedToLibrary(false);
            }
        } catch (error) {
            console.error("Error adding/removing from book case:", error);
            setIsAddedToLibrary(previousState); 
        }
    };

    const handleAddToListeningList = async () => {
        /*const previousState = isAddedToListeningList; 
        setIsAddedListeningList(!previousState); */
        setShowModal(true);

        /*try {
            const response = await axios.post(
                `http://localhost:3000/reading-list/audioBook/${bookDetails[0]?.id}`,
                { name: bookDetails[0]?.title },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            if (response.data.message === "Kitap okuma listesine eklendi.") {
                setIsAddedListeningList(true);
            } else if (response.data.message === "Kitap okuma listesinden çıkarıldı.") {
                setIsAddedListeningList(false);
            }
    
            setBookDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[0].isListeningList = !setIsAddedListeningList;
                return updatedDetails;
            });
        } catch (error) {
            console.error("Error adding/removing from listening list:", error);
        }*/
    };

    const handleListenAudioBookClick = async (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        
        try {
            const response = await axios.post(
                `${backendBaseUrl}/book-case/audioBook/${formattedBookName}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            if (response.status === 200) {
            } else {
                console.warn('Beklenmeyen durum:', response);
            }
    
            navigate(`/listen-audio-book/${formattedBookName}`);
        } catch (error) {
            console.error('Kitabı başlatırken bir hata oluştu:', error.response?.data || error.message);
        }
    };

    const calculateTotalTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours < 1) {
            return `${minutes} dakika`;
        } else {
            return `${hours} saat ${minutes} dakika`;
        }
    }

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

    const handleProfileClick = (username) => {
        navigate(`/user/${username}`);
    }

    const handleCommentSubmit = async (bookId, newCommentContent) => {
        if (newCommentContent.trim() === "") return;
    
        try {
            const response = await axios.post(
                `http://localhost:3000/comment/audioBook/${bookId}`,
                { content: newCommentContent },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            const newComment = response.data.comment;
            setComments((prevComments) => [newComment, ...prevComments]);
    
            setBookDetails((prevDetails) => {
                const updatedDetails = { ...prevDetails };
                if (updatedDetails[0]?.comments) {
                    updatedDetails[0].comments = [newComment, ...updatedDetails[0].comments];
                }
                return updatedDetails;
            });
    
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error.response?.data || error.message);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    function calculateTimeDifference(date) {
        const commentDate = new Date(date);
        const currentDate = new Date();
        const diffInMs = currentDate - commentDate;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
        if (diffInDays < 1) {
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            if (diffInHours < 1) {
                const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                return `${diffInMinutes} dakika önce`;
            }
            return `${diffInHours} saat önce`;
        } else if (diffInDays < 30) {
            return `${diffInDays} gün önce`;
        } else if (diffInDays < 365) {
            const diffInMonths = Math.floor(diffInDays / 30);
            return `${diffInMonths} ay önce`;
        } else {
            const diffInYears = Math.floor(diffInDays / 365);
            return `${diffInYears} yıl önce`;
        }
    }

    useEffect(() => {
        window.scrollTo(0,0);
    }, [])

    const readingList = [
        {
            id: 1,
            name: "En sevdiklerim",
            img: "/images/seker-portakali.jpg"
        },
        {
            id: 2,
            name: "Okumaya devam ettiklerim",
            img: "/images/book.jpg"
        },
        {
            id: 3,
            name: "Canlarımm",
            img: "/images/ask-ve-gurur.jpg"
        },
        {
            id: 4,
            name: "Canlarımmm2",
            img: "/images/ask-ve-gurur.jpg"
        },
    ]

    const handleReadingListClick = (id) => {
        setSelectedListId(selectedListId === id ? null : id);
    }

    return (
        <>
            <div className="audio-book-details-page">
                <div className="audio-book-details-up">
                    <div className="book-cover">
                        <img 
                            src={
                                bookDetails[0]?.bookCover
                                    ? bookDetails[0]?.bookCover.startsWith('uploads')
                                        ? `${backendBaseUrl}/${bookDetails[0]?.bookCover}`
                                        : bookDetails[0]?.bookCover
                                    : 'default-background.jpg' 
                            }
                            alt="" 
                        />
                        <img src="/images/headphone-icon.svg" alt="" className='headphones-icon'/>
                    </div>
                    <div className="book-header">
                        <div className="book-name">
                            <div className="d-flex flex-column">
                                <p>{bookDetails[0]?.title}</p>
                                <div className="category">
                                    {bookDetails[0]?.categories?.join(', ')}
                                </div>
                            </div>
                            <div className="buttons d-flex flex-column">
                                <div>
                                    {isAddedToLibrary ? (
                                        <Button className="btn-book" onClick={() => handleAddToLibrary(bookDetails[0]?.id)}>
                                            <i className="bi bi-book-fill me-1"></i> Kitaplıktan Kaldır
                                        </Button>
                                    ) : (
                                        <Button className="btn-book" onClick={() => handleAddToLibrary(bookDetails[0]?.id)}>
                                            <i className="bi bi-book me-1"></i> Kitaplığa Ekle
                                        </Button>
                                    )}
                                    {isAddedToListeningList ? (
                                        <Button className="btn-book" onClick={handleAddToListeningList}>
                                            <i className="bi bi-bookmark-check-fill me-1"></i> Dinleme Listesine Eklendi
                                        </Button>
                                    ) : (
                                        <Button className="btn-book" onClick={handleAddToListeningList}>
                                            <i className="bi bi-bookmark me-1"></i> Dinleme Listesine Ekle
                                        </Button>
                                    )}
                                </div>

                                <Modal show={showModal} onHide={handleClose} centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Okuma Listesi Seçiniz</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="add-read-list-button">
                                            <Button className='d-flex gap-1' onClick={handleNewListOpen}><i class="bi bi-bookmark-check-fill"></i> Yeni Okuma Listesi Oluştur</Button>
                                        </div>
                                        <div className='d-flex flex-wrap justify-content-center'>
                                            {readingList.map((list) => (
                                                <div className="d-flex flex-column read-list" key={list.id} onClick={() => handleReadingListClick(list.id)}>
                                                    <img src={list.img} alt=""/>
                                                    <span>{list.name}</span>
                                                    {selectedListId === list.id && (
                                                        <i 
                                                            className="bi bi-check-circle-fill position-absolute" 
                                                            style={{ top: 5, right: 5, fontSize: "1.2rem" }}
                                                        ></i>
                                                    )}
                                                </div>
                                            ))}   
                                        </div>
                                    </Modal.Body>
                                </Modal>

                                <Modal show={showNewListModal} onHide={handleNewListClose} centered className='new-list-form'>
                                    <Modal.Body>
                                        <Form className='d-flex flex-column gap-3 modal-form'>
                                            <Form.Group>
                                                <Form.Label className='d-flex justify-content-center'>Okuma listene bir isim ver</Form.Label>
                                                <Form.Control
                                                    type='text'
                                                    placeholder='Ör: En sevdiğim kitaplar...'
                                                    className='text-center'
                                                />
                                            </Form.Group>
                                        </Form>         
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button onClick={handleNewListClose}>Oluştur</Button>
                                    </Modal.Footer>
                                </Modal>

                                <div className='total-time'><p>Toplam Süre: 15 dakika 35 saniye</p></div>
                            </div>
                        </div>
                        <div className="book-info d-flex flex-column mt-3">
                            <div className="author-info d-flex align-items-center gap-2" onClick={handleProfileClick}>
                                <img 
                                    src={
                                        bookDetails[0]?.user.profile_image
                                            ? bookDetails[0]?.user.profile_image.startsWith('uploads')
                                                ? `${backendBaseUrl}/${bookDetails[0]?.user.profile_image}`
                                                : bookDetails[0]?.user.profile_image
                                            : 'default-background.jpg' 
                                    } 
                                    alt=""
                                />
                                <p>{bookDetails[0]?.user.username}</p>
                            </div>
                            <div className="statistics d-flex gap-3">
                                <p className='d-flex'><i className="bi bi-eye-fill me-2"></i>{formatNumber(bookDetails[0]?.analysis[0]?.read_count || 0)}</p>
                                <p className='d-flex'><i className="bi bi-heart-fill me-2"></i>{formatNumber(bookDetails[0]?.analysis[0]?.like_count || 0)}</p>
                                <p className='d-flex'><i className="bi bi-chat-fill me-2"></i>{formatNumber(bookDetails[0]?.analysis[0]?.comment_count || 0)}</p>
                            </div>
                            <div className="read-button" onClick={() => handleListenAudioBookClick(formattedBookName)}>
                                {bookDetails.isLibrary ? (
                                    <Button>Dinlemeye Devam Et</Button>
                                ) : (
                                    <Button>Dinlemeye Başla</Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="audio-book-details-down">
                    <div className="book-summary">
                        <p className='fw-bold'>Özet</p>
                        <p>
                            {bookDetails[0]?.summary}
                        </p>
                    </div>
                    {bookDetails[0]?.hashtags && (
                    <div className="book-tags">
                        <p className="fw-bold">Etiketler</p>
                        <div className="tags-container">
                        {bookDetails[0]?.hashtags.map((hashtag) => (
                            <span key={hashtag.id} className="badge bg-secondary mx-1">
                                {hashtag.name}
                            </span>
                        ))}
                        </div>
                    </div>
                    )}
                    <div className="book-info-details d-flex mt-2">
                        {bookDetails[0]?.bookCopyright?.length > 0 && (
                        <div className="info-item me-3">
                            <strong><i className="bi bi-c-circle-fill me-1"></i></strong>
                            <span>{bookDetails[0]?.bookCopyright.join(',')}</span>
                        </div>
                        )}
                        <div className="separator me-2">|</div>
                        {bookDetails[0]?.ageRange?.length > 0 && (
                        <div className="info-item">
                            <span>{bookDetails[0]?.ageRange.join(',')}</span>
                        </div>
                        )}
                    </div>
                    <div className="book-tabs mt-4">
                        <div className="tabs">
                            <button
                                className={`tab-button ${activeTab === 'chapters' ? 'active' : ''}`}
                                onClick={() => handleTabClick('chapters')}
                            >
                                <i className="bi bi-list-ul"></i> Bölümler ({chapters.length})
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
                                onClick={() => handleTabClick('comments')}
                            >
                                Yorumlar ({bookDetails[0]?.comments.length})
                            </button>
                        </div>
                        <div className="tab-content">
                            {activeTab === 'chapters' && (
                                <div id="chapters" className={`tab-pane ${activeTab === 'chapters' ? 'active' : ''}`}>
                                    {Array.isArray(chapters) && chapters.map((chapter, index) => (
                                        <div className='section-item' key={index}>
                                            {chapter.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'comments' && (
                                <div id="comments" className={`tab-pane ${activeTab === 'comments' ? 'active' : ''}`}>
                                    {comments.map((comment, index) => (
                                        <div className="comment-item" key={comment.id}>
                                            <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                                                <div className="left d-flex align-items-center gap-2">
                                                    <img
                                                        src={comment.user?.profile_image}
                                                        alt={comment.user?.username}
                                                        className="user-profile-image"
                                                        onClick={handleProfileClick}
                                                    />
                                                    <p className="user-name mb-0 fw-bold" onClick={() => handleProfileClick(comment.user?.username)}>{comment.user?.username}:</p>
                                                    <p className="comment-text mb-0">{comment.content}</p>
                                                </div>
                                                <div>
                                                    <p className="comment-date text-muted small mb-0">
                                                        {calculateTimeDifference(comment.publish_date)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="comment-input-container">
                                        <input
                                            type="text"
                                            placeholder="Yorum yaz..."
                                            className="comment-input"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <Button className="comment-submit-button" onClick={() => handleCommentSubmit(bookDetails[0]?.id, newComment)}>Gönder</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Footer/>
            </div>
        </>
    )
}

export default AudioBookDetails