import React, { useEffect, useState } from 'react'
import './AudioBookDetails.css'
import Footer from '../../layouts/footer/Footer'
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap'

function AudioBookDetails() {
    const navigate = useNavigate();
    const username = "prensesingunlugu";
    const [activeTab, setActiveTab] = useState('sections');
    const [newComment, setNewComment] = useState("");

    const bookdetails = {
        id: 1,
        bookCover: "/images/ask-ve-gurur.jpg",
        bookName: "Aşk ve Gurur",
        categoryName: "Romantik",
        userImage: "/images/profile.jpg",
        username: "janeaustenkitaplari",
        readCount: "1.9M",
        likeCount: "365K",
        commnetCount: "120K",
        sectionCount: "43",
        isLibrary: true,
        isReadingList: false,
        totalTime: "192"
    }

    const [isAddedToLibrary, setIsAddedToLibrary] = useState(bookdetails.isLibrary);
    const [isAddedToReadingList, setIsAddedToReadingList] = useState(bookdetails.isReadingList);

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

    const handleProfileClick = () => {
        navigate(`/${username}`);
    }

    const sections = [
        "Bölüm 1: Tanışma",
        "Bölüm 2: İlk İzlenim",
        "Bölüm 3: Aşk ve Gurur",
        "Bölüm 4: Düğüm Çözülüyor"
    ]

    const [comments, setComments] = useState([
        {
            id: 1,
            userImage: "/images/profile.jpg",
            userName: "elifturan",
            comment: "Harika bir kitap, Elizabeth'i çok sevdim!",
            date: "2024-12-25"
        },
        {
            id: 2,
            userImage: "/images/woman-pp.jpg",
            userName: "fatmanurozcetin",
            comment: "Romantik bir hikaye için mükemmel bir seçim!",
            date: "2024-12-20"
        },
        {
            id: 3,
            userImage: "/images/profile2.jpg",
            userName: "cemilecan",
            comment: "Darcy'nin dönüşümü inanılmaz etkileyiciydi.",
            date: "2023-12-28"
        }
    ])

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
    
    const handleCommentSubmit = () => {
        if(newComment.trim() === "") return;
        const newCommentData = {
            id: comments.length + 1,
            userImage: "/images/profile.jpg",
            userName: "deryadeniz",
            comment: newComment,
            date: new Date().toISOString()
        };
        setComments([newCommentData, ...comments]);
        setNewComment("");
    }

    useEffect(() => {
        window.scrollTo(0,0);
    }, [])
  return (
    <>
        <div className="audio-book-details-page">
            <div className="audio-book-details-up">
                <div className="book-cover">
                    <img src={bookdetails.bookCover} alt="" />
                    <img src="/images/headphone-icon.svg" alt="" className='headphones-icon'/>
                </div>
                <div className="book-header">
                    <div className="book-name">
                        <div className="d-flex flex-column">
                            <p>{bookdetails.bookName}</p>
                            <div className="category">
                                {bookdetails.categoryName}
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
                            <div className='total-time'><p>Toplam Süre: {calculateTotalTime(parseInt(bookdetails.totalTime))}</p></div>
                        </div>
                    </div>
                    <div className="book-info d-flex flex-column mt-3">
                        <div className="author-info d-flex align-items-center gap-2" onClick={handleProfileClick}>
                            <img src={bookdetails.userImage} alt=""/>
                            <p>{bookdetails.username}</p>
                        </div>
                        <div className="statistics d-flex gap-3">
                            <p className='d-flex'><i className="bi bi-eye-fill me-2"></i>{bookdetails.readCount}</p>
                            <p className='d-flex'><i className="bi bi-heart-fill me-2"></i>{bookdetails.likeCount}</p>
                            <p className='d-flex'><i className="bi bi-chat-fill me-2"></i>{bookdetails.commnetCount}</p>
                        </div>
                        <div className="read-button">
                            {bookdetails.isLibrary ? (
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
                        Bennet ailesi, Mrs. Bennet'in kızlarını zengin bir adamla evlendirmek isteğiyle hareket
                        ederken, Elizabeth babası gibi akıllı ve güzel bir genç kızdır. Charles Bingley'in 
                        malikane kiralamasıyla başlayan hikaye, Jane ve Bingley arasındaki ilginin 
                        gelişmesiyle devam eder. Ancak, Bingley'in kibirli kız kardeşleri ve Darcy'nin 
                        Elizabeth'e olan küstahlığı, aşk hikayesini zorlaştırır.
                    </p>
                </div>
                <div className="book-tags">
                    <p className="fw-bold">Etiketler</p>
                    <div className="tags-container">
                        <div className="tag">Romantik</div>
                        <div className="tag">Aşk</div>
                        <div className="tag">Klasik</div>
                        <div className="tag">Toplumsal</div>
                    </div>
                </div>
                <div className="book-info-details d-flex mt-2">
                    <div className="info-item me-3">
                        <strong><i className="bi bi-c-circle-fill me-1"></i></strong>
                        <span>Bu kitap yayın evinden izin alarak yayınlanmıştır.</span>
                    </div>
                    <div className="separator me-2">|</div>
                    <div className="info-item">
                        <span>18-25 yaş arası için uygundur.</span>
                    </div>
                </div>
                <div className="book-tabs mt-4">
                    <div className="tabs">
                        <button
                            className={`tab-button ${activeTab === 'sections' ? 'active' : ''}`}
                            onClick={() => handleTabClick('sections')}
                        >
                            <i class="bi bi-list-ul"></i> Bölümler ({sections.length})
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
                            onClick={() => handleTabClick('comments')}
                        >
                            Yorumlar
                        </button>
                    </div>
                    <div className="tab-content">
                        {activeTab === 'sections' && (
                            <div id="sections" className={`tab-pane ${activeTab === 'sections' ? 'active' : ''}`}>
                                {sections.map((section, index) => (
                                    <div className='section-item' key={index}>
                                        {section}
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'comments' && (
                            <div id="comments" className={`tab-pane ${activeTab === 'comments' ? 'active' : ''}`}>
                                {comments.map((comment) => (
                                    <div className="comment-item" key={comment.id}>
                                        <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                                            <div className="left d-flex align-items-center gap-2">
                                                <img
                                                    src={comment.userImage}
                                                    alt={comment.userName}
                                                    className="user-profile-image"
                                                    onClick={handleProfileClick}
                                                />
                                                <p className="user-name mb-0 fw-bold" onClick={handleProfileClick}>{comment.userName}:</p>
                                                <p className="comment-text mb-0">{comment.comment}</p>
                                            </div>
                                            <div>
                                                <p className="comment-date text-muted small mb-0">
                                                    {calculateTimeDifference(comment.date)}
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
                                    <Button className="comment-submit-button" onClick={handleCommentSubmit}>Gönder</Button>
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