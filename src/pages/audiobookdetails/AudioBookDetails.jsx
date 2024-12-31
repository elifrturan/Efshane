import React, { useEffect, useState } from 'react'
import './AudioBookDetails.css'
import Footer from '../../layouts/footer/Footer'
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import axios from 'axios';

function AudioBookDetails() {
    const navigate = useNavigate();
    const { bookName: formattedBookName } = useParams();
    const [activeTab, setActiveTab] = useState('chapters');
    const [newComment, setNewComment] = useState("");
    const [bookDetails, setBookDetails] = useState({});
    const [chapters, setChapters] = useState([]);
    const [comments, setComments] = useState([]);
    const [isAddedToLibrary, setIsAddedToLibrary] = useState(bookDetails.isLibrary);
    const [isAddedToReadingList, setIsAddedToReadingList] = useState(bookDetails.isReadingList);

    useEffect(() => {
        const fetchAudioBookDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/audio-book/home/${formattedBookName}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log("Response:", response.data);
                setBookDetails(response.data);
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
                console.log("Episode:", response.data);
                setChapters(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }; 
        fetchChapterDetails();
    }, [formattedBookName]);

    useEffect(() => {
        if (bookDetails[0]) {
            setIsAddedToLibrary(bookDetails[0].isLibrary);
            setIsAddedToReadingList(bookDetails[0].isReadingList);
        }
    }, [bookDetails]);

    useEffect(() => {
        if (bookDetails[0]?.comments) {
            setComments(bookDetails[0].comments);
        }
    }, [bookDetails]);

    
    const handleAddToLibrary = () => {
        setIsAddedToLibrary(!isAddedToLibrary);
    }

    const handleAddToReadingList = () => {
        setIsAddedToReadingList(!isAddedToReadingList);
    }

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
            const newComment = response.data;
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
    return (
        <>
            <div className="audio-book-details-page">
                <div className="audio-book-details-up">
                    <div className="book-cover">
                        <img src={bookDetails[0]?.bookCover} alt="" />
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
                                        <Button className="btn-book" onClick={handleAddToLibrary}>
                                            <i className="bi bi-book-fill me-1"></i> Kitaplıktan Kaldır
                                        </Button>
                                    ) : (
                                        <Button className="btn-book" onClick={handleAddToLibrary}>
                                            <i className="bi bi-book me-1"></i> Kitaplığa Ekle
                                        </Button>
                                    )}
                                    {isAddedToReadingList ? (
                                        <Button className="btn-book" onClick={handleAddToReadingList}>
                                            <i className="bi bi-bookmark-check-fill me-1"></i> Okuma Listesinden Kaldır
                                        </Button>
                                    ) : (
                                        <Button className="btn-book" onClick={handleAddToReadingList}>
                                            <i className="bi bi-bookmark me-1"></i> Okuma Listesine Ekle
                                        </Button>
                                    )}
                                </div>
                                <div className='total-time'><p>Toplam Süre: {calculateTotalTime(bookDetails[0]?.duration)}</p></div>
                            </div>
                        </div>
                        <div className="book-info d-flex flex-column mt-3">
                            <div className="author-info d-flex align-items-center gap-2" onClick={handleProfileClick}>
                                <img src={bookDetails[0]?.user.profile_image} alt=""/>
                                <p>{bookDetails[0]?.user.username}</p>
                            </div>
                            <div className="statistics d-flex gap-3">
                                <p className='d-flex'><i className="bi bi-eye-fill me-2"></i>{formatNumber(bookDetails[0]?.analysis[0]?.read_count || 0)}</p>
                                <p className='d-flex'><i className="bi bi-heart-fill me-2"></i>{formatNumber(bookDetails[0]?.analysis[0]?.like_count || 0)}</p>
                                <p className='d-flex'><i className="bi bi-chat-fill me-2"></i>{formatNumber(bookDetails[0]?.analysis[0]?.comment_count || 0)}</p>
                            </div>
                            <div className="read-button">
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
                                <i class="bi bi-list-ul"></i> Bölümler ({chapters.length})
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
                                    {chapters.map((chapter, index) => (
                                        <div className='chapter-item' key={index}>
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
            <Footer/>
        </>
    )
}

export default AudioBookDetails