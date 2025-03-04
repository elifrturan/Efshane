import React, { useEffect, useState } from 'react'
import './ReadBook.css'
import Footer from '../../layouts/footer/Footer'
import { Button, Dropdown } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const backendBaseUrl = 'http://localhost:3000';

function ReadBook() {
    const { bookName: formattedBookName } = useParams();
    const [chapters, setChapters] = useState([]);
    const [liked, setLiked] = useState(false);
    const [isAddedToLibrary, setIsAddedToLibrary] = useState(formattedBookName.isAudioBookCase);
    const [selectedSection, setSelectedSection] = useState(1);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    useEffect(() => {
        if (chapters.length > 0 && selectedSection === null) {
            setSelectedSection(chapters[0].id); 
        }
    }, [chapters]);
    

    useEffect(() => {
        const fetchChaptersDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/chapter/read/book/${formattedBookName}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
    
                const { book, chapters } = response.data;
                setChapters(chapters);
                setLiked(book.isLiked); 

                const lastReadResponse = await axios.get(
                    `http://localhost:3000/progress/book/${formattedBookName}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                const lastReadChapter = lastReadResponse.data?.chapters;
                if (lastReadChapter) {
                    const lastReadIndex = chapters.findIndex(chapter => chapter.id === lastReadChapter.id);
                    setSelectedSection(lastReadIndex !== -1 ? lastReadIndex + 1 : 1);
                } else {
                    setSelectedSection(1);
                }
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        };
    
        fetchChaptersDetails();
    }, [formattedBookName]);
    
    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    }

    const handleLike = async () => {
        const previousState = liked; 
        setLiked(!previousState); 

        try {
            const response = await axios.post(
                `http://localhost:3000/book/like/${formattedBookName}`, 
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setLiked(response.data.isLiked);
        } catch (error) {
            console.error("Beğenme işlemi sırasında hata oluştu:", error);
        }
    };

    const handleAddToLibrary = async () => {
        const previousState = isAddedToLibrary; 
        setIsAddedToLibrary(!previousState); 
    
        const encodeBookTitle = encodeURIComponent(formattedBookName);
        try {
            const response = await axios.post(
                `http://localhost:3000/book-case/book/${encodeBookTitle}`,
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

    const updateProgress = async (formattedBookName, chapterId) => {
        try {
            const response = await axios.post(
                `${backendBaseUrl}/progress/book/${formattedBookName}/chapter/${chapterId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
        } catch (error) {
            console.error("Progress update failed:", error.response?.data || error.message);
        }
    };    

    const goToNextSection = async () => {
        if (selectedSection < chapters.length) {
            const nextSection = selectedSection + 1;
            setSelectedSection(nextSection);
            window.scrollTo(0, 0);
    
            const chapterId = chapters[nextSection - 1]?.id; 
            if (chapterId) {
                await updateProgress(formattedBookName, chapterId);
            }
        }
    };    

    const handleSectionChange = async (index) => {
        setSelectedSection(index + 1);
        window.scrollTo(0, 0);
    
        const chapterId = chapters[index]?.id; 
        if (chapterId) {
            await updateProgress(formattedBookName, chapterId);
        }
    };    

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
    };
    
    const handleCommentSubmit = async (bookName, chapterTitle, newCommentContent) => {
        if (newCommentContent.trim() === "") return;
    
        const formattedChapterTitle = formatTitleForUrl(chapterTitle);
    
        try {
            const response = await axios.post(
                `http://localhost:3000/comment/book/${bookName}/${formattedChapterTitle}`,
                { content: newCommentContent },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
        
            const newComment = response.data.comment;
        
            setComments(prevComments => [newComment, ...prevComments]);

            setChapters(prevChapters =>
                prevChapters.map(chapter =>
                    chapter.id === chapters[selectedSection - 1].id
                        ? {
                            ...chapter,
                            comments: [newComment, ...chapter.comments],  
                        }
                        : chapter
                )
            );
        
            setNewComment(""); 
        } catch (error) {
            console.error("Yorum eklenirken hata oluştu:", error.response?.data || error.message);
            alert("Yorum eklenirken bir hata oluştu.");
        }
    };

    const handleCommentScroll = () => {
        const commentSection = document.querySelector('.comments-chapter');
        commentSection.scrollIntoView({ behavior: 'smooth' });
    }

    function formatNumber(num) {
        if (num == null || isNaN(num)) {
            return '0'; 
        }
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

            <div className="read-book-page">
                <div className="read-book-nav">
                    {/* Bölümler Dropdown */}
                    <div className="chapters-dropdown">
                        <Dropdown>
                            <Dropdown.Toggle>
                                Bölümler
                            </Dropdown.Toggle>
    
                            <Dropdown.Menu>
                                {chapters.map((chapter, index) => (
                                    <Dropdown.Item 
                                        key={chapter.id} 
                                        onClick={() => handleSectionChange(index)}
                                    >
                                        {chapter.title}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
    
                    {/* Kitap Başlığı */}
                    {chapters[selectedSection - 1] && (
                        <div className="book-title">
                            <span className="text-center ms-5">
                            {chapters[selectedSection - 1].book?.title}
                            </span>
                        </div>
                    )}
                    {/* Actions */}
                    <div className="actions">
                        {liked === null ? (
                            <span>Yükleniyor...</span>
                        ) : (
                                <span onClick={() => handleLike()} className={liked ? "liked" : ""}>
                                    <i className={`bi me-2 ${liked ? "bi-heart-fill" : "bi-heart"}`}></i>
                                    {liked ? "Beğenildi" : "Beğen"}
                                </span>
                            )}
                            <span onClick={() => handleAddToLibrary(chapters.book?.id)} className={isAddedToLibrary ? "added" : ""}>
                                <i className={`bi me-2 ${isAddedToLibrary ? "bi-book-fill" : "bi-book"}`}></i>
                                {isAddedToLibrary ? "Kitaplıktan Kaldır" : "Kitaplığa Ekle"}
                            </span>
                    </div>
                </div>
                {/* Seçili Bölüm İçeriği */}
                <div className="container">
                    <div className="read-book-content">
                        {chapters[selectedSection - 1] && (
                            <div className="chapter-details">
                                {chapters[selectedSection - 1].image && (
                                    <img 
                                        src={
                                            chapters[selectedSection - 1].image.startsWith('uploads')
                                                ? `${backendBaseUrl}/${chapters[selectedSection - 1].image}`
                                                : chapters[selectedSection - 1].image
                                        } 
                                        alt={chapters[selectedSection - 1].title} 
                                        className="chapter-image"
                                    />
                                )}
                                <h3>{chapters[selectedSection - 1].title}</h3>
                                <div className="statistics d-flex gap-3">
                                    <p className="d-flex"><i className="bi bi-eye me-2"></i>{formatNumber(chapters[selectedSection - 1].analysis[0]?.read_count)}</p>
                                    <p className="d-flex"><i className="bi bi-heart me-2"></i>{formatNumber(chapters[selectedSection - 1].analysis[0]?.like_count)}</p>
                                    <p className="d-flex" onClick={handleCommentScroll} style={{ cursor: "pointer" }}><i className="bi bi-chat me-2"></i>{formatNumber(chapters[selectedSection - 1].analysis[0]?.comment_count)}</p>
                                </div>
                                <div className="content">
                                {chapters[selectedSection - 1].content}
                                </div>
                            </div>
                        )}
        
                        {/* Sonraki Bölüme Geçiş */}
                        {selectedSection < chapters.length && (
                            <Button className="next-chapter-btn" onClick={goToNextSection}>
                                Sonraki Bölüme Geç <i className="bi bi-chevron-right ms-2"></i>
                            </Button>
                        )}
                        {selectedSection === chapters.length && (
                            <div className="alert alert-success mt-3" role="alert">
                                Hikayenin sonuna geldiniz. 
                                <br />
                                Başka bir hikayede tekrar buluşmak dileğiyle...
                            </div>
                        )}
        
                        {/* Yorumlar */}
                        <div className="comments-chapter mt-4">
                            <h4 className="mb-2">Yorumlar</h4>
                            {chapters.length > 0 && chapters[selectedSection - 1] ? (
                                chapters[selectedSection - 1].comments?.length === 0 ? (
                                    <p style={{ fontSize: "0.9rem", opacity: "0.8" }}>Henüz yorum yapılmadı.</p>
                                ) : (
                                    chapters[selectedSection - 1].comments.map((comment, index) => (
                                        <div className="comment d-flex" key={comment.id}>
                                            <img 
                                                src={comment.user?.profile_image.startsWith('uploads')  
                                                    ? `${backendBaseUrl}/${comment.user?.profile_image}`
                                                    : comment.user?.profile_image
                                                } 
                                                alt={comment.user?.username || 'Anonim'} 
                                                className="user-profile-img" 
                                            />
                                            <div className="comment-details ms-3">
                                                <p className="user-name mb-1">
                                                    <strong>{comment.user?.username || 'Anonim'}</strong>
                                                </p>
                                                <p className="comment-content mb-0">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))
                                )
                            ) : (
                                <p style={{ fontSize: "0.9rem", opacity: "0.8" }}>Bölüm yükleniyor...</p>
                            )}
                        </div>
        
                        {/* Yorum Ekleme */}
                        <div className="comment-input mt-3">
                            <textarea
                                className="form-control"
                                value={newComment}
                                onChange={handleCommentChange}
                                rows="3"
                                placeholder="Siz de bir yorum ekleyin..."
                            />
                            <Button
                                className="mt-2"
                                onClick={() => handleCommentSubmit(formattedBookName, chapters[selectedSection - 1].title , newComment)}
                            >
                                Yorum Yap
                            </Button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
    );
    
}

export default ReadBook