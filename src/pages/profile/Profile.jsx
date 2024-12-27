import React, { useRef, useState } from 'react'
import Navbar from '../../layouts/navbar/Navbar'
import Footer from '../../layouts/footer/Footer'
import './Profile.css'
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';

function Profile() {
    const [showModal, setShowModal] = useState(false);
    const [currentImage, setCurrentImage] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const storyScrollRef = useRef(null);
    const readListScrollRef = useRef(null);
    const [content, setContent] = useState("");
    const [notifyFollowers, setNotifyFollowers] = useState(false); 
    const [isAnnouncementVisible, setAnnouncementVisible] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const navigate = useNavigate();
    const [likedPosts, setLikedPosts] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showComments, setShowComments] = useState(null);
    const [likedComments, setLikedComments] = useState([]);

    const handleClose = () => setShowEdit(false);
    const handleShow = () => setShowEdit(true);

    const [userProfile, setUserProfile] = useState({
        coverPhoto: "/images/bg.jpg",
        profilePhoto: "/images/profile.jpg",
        username: "elifturan",
        name: "Elif Turan",
        about: "Bol su iç, cilt bakımını aksatma ve erkeklere güvenme.",
        date: "15 Nisan 2018",
        follower: 5875,
        following: 22
    })

    const [tempProfile, setTempProfile] = useState({
        coverPhoto: userProfile.coverPhoto,
        profilePhoto: userProfile.profilePhoto,
        username: userProfile.username,
        name: userProfile.name,
        about: userProfile.about,
        date: userProfile.date,
        follower: userProfile.follower,
        following: userProfile.following
    })

    const openModal = (image) => {
        setCurrentImage(image);
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setCurrentImage("");
    }

    const handlePhotoChange = (event, photoType) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setTempProfile((prevState) => ({
              ...prevState,
              [photoType]: e.target.result
            }));
          };
          reader.readAsDataURL(file);
        }
    }

    const handleSave = () => {
        setUserProfile(tempProfile);
        handleClose();
    }

    const stories = [
        {
            id: 1,
            image: "/images/ask-ve-gurur.jpg",
            storyName: "Aşk ve Gurur"
        },
        {
            id: 2,
            image: "/images/simyaci.jpg",
            storyName: "Simyacı"
        },
        {
            id: 3,
            image: "/images/seker-portakali.jpg",
            storyName: "Şeker Portakalı"
        },
        {
            id: 4,
            image: "/images/book.jpg",
            storyName: "Kiraz Mevsimi"
        }
    ]

    const scrollLeft = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({ left: -150, behavior: 'smooth' });
        }
    };

    const scrollRight = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({ left: 150, behavior: 'smooth' });
        }
    };

    const storiesClick = () => {
        navigate('/my-stories');
    }

    const handleAddAnnouncement = () => {
        setContent('');
        setNotifyFollowers(false);
        setAnnouncementVisible(false);
        setCharCount(0);
    };

    const handleTextareaFocus = () => {
        setAnnouncementVisible(true); 
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        const charCount = newContent.length;
        
        if (charCount <= 200) {
            setContent(newContent);
            setCharCount(charCount);
        }
    };

    const getTimeDifference = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;

        const diffSeconds = Math.floor(diffMs / (1000) % 60);
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
        const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));

        if (diffYears > 0) {
            return past.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
        }

        if (diffMonths > 0) {
            return past.toLocaleDateString("tr-TR", { day: "2-digit", month: "long" });
        }

        if(diffWeeks > 0) return `${diffWeeks}h`;
        if(diffDays > 0) return `${diffDays}g`;
        if(diffHours > 0) return `${diffHours}s`;
        if(diffMinutes > 0) return `${diffMinutes}d`;
        if(diffSeconds > 0) return `${diffSeconds}sn`;
    };

    const [posts, setPosts] = useState([
        {
            id: 1,
            likeCount: 458,
            quotationCount: 60,
            commentCount: 25,
            postImage: true,
            postImageSrc: "/images/ask-ve-gurur.jpg",
            publishedDate: "2023-09-10T14:30:00"
        },
        {
            id: 2,
            likeCount: 458,
            quotationCount: 60,
            commentCount: 25,
            postImage: true,
            postImageSrc: "/images/voice-ai.jpg",
            publishedDate: "2024-12-10T14:30:00"
        }
    ]);

    const [postComment, setPostComment] = useState([
        {
            id: 1,
            postId: 1,
            images: "/images/pp.jpg",
            username: "camdakikiz",
            commentContent: "Çok güzel gerçekten.",
            commentDate: "2024-09-10T14:30:00",
            commentLike: 5,
            replies: [],
            showReplyInput: false,
            showReplies: false,
        },
        {
            id: 2,
            postId: 1,
            images: "/images/woman-pp.jpg",
            username: "camdakifeslegen",
            commentContent: "Bayıldımmmmmmm.",
            commentDate: "2024-10-10T15:20:00",
            commentLike: 3,
            replies: [],
            showReplyInput: false,
            showReplies: false,
        },
        {
            id: 3,
            postId: 1,
            images: "/images/woman-pp.jpg",
            username: "mutsuzbirkisi",
            commentContent: "Abartılan bir kitap, neyini seviyorsunuz?.",
            commentDate: "2024-09-10T15:35:00",
            commentLike: 1,
            replies: [],
            showReplyInput: false,
            showReplies: false,
        },
        {
            id: 4,
            postId: 1,
            images: "/images/pp.jpg",
            username: "kelebeklerdiyari",
            commentContent: "Ah Eliza üzümlü kekimmmmm",
            commentDate: "2024-09-10T15:34:00",
            commentLike: 3,
            replies: [],
            showReplyInput: false,
            showReplies: false,
        },
        {
            id: 5,
            postId: 2,
            images: "/images/woman-pp.jpg",
            username: "isimsizuser",
            commentContent: "Yani??? Boş yapmayın ya.",
            commentDate: "2024-08-10T14:30:00",
            commentLike: 15,
            replies: [],
            showReplyInput: false,
            showReplies: false,
        }
    ]);

    const handleLike = (postId) => {
        setPosts((prev) => 
            prev.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        likeCount: likedPosts.includes(postId)
                            ? post.likeCount - 1
                            : post.likeCount + 1,
                    };
                }
                return post;
            })
        );

        setLikedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };

    const handleToggleComments = (postId) => {
        setShowAllComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const toggleComments = (postId) => {
        setShowComments(prev => prev === postId ? null : postId);
    };

    const handleCommentLike = (commentId) => {
        setPostComment((prev) =>
            prev.map((comment) => {
                if(comment.id === commentId) {
                    return {
                        ...comment,
                        commentLike: likedComments.includes(commentId) 
                        ? comment.commentLike - 1
                        : comment.commentLike + 1, 
                    };
                }
                return comment;
            })
        );

        setLikedComments((prev) =>
            prev.includes(commentId)
            ? prev.filter((id) => id !== commentId)
            : [...prev, commentId]
        );
    };

    const handleReply = (commentId, replyContent) => {
        setPostComment((prev) => 
            prev.map((comment) => {
                if(comment.id === commentId) {
                    return {
                        ...comment,
                        replies : [
                            ...comment.replies,
                            {
                                id: comment.replies.length + 1,
                                username: "elif",
                                replyContent,
                                replyDate: new Date().toISOString(),
                            },
                        ],
                        showReplyInput: false,
                    };
                }
                return comment;
            })
        );
    };

    const toggleReplies = (commentId) => {
        setPostComment((prev) =>
            prev.map((comment) =>
                comment.id === commentId
                    ? { ...comment, showReplies: !comment.showReplies, showReplyInput: !comment.showReplyInput }
                    : comment
            )
        );
    };

    const toggleReplyInput = (commentId) => {
        setPostComment((prev) =>
            prev.map((comment) =>
                comment.id === commentId
                    ? { ...comment, showReplyInput: !comment.showReplyInput }
                    : comment
            )
        );
    }

    const handleDeleteClick = (postId) => {
        setPosts((prevPosts) => {
            const updatedPosts = prevPosts.filter((p) => p.id !== postId);
            return updatedPosts;
        });
    };
    

  return (
    <>
        <Navbar/>
        <div className="profile-page">
            <div className="profile-page-up">
                <div className="cover-photo">
                    <img src={userProfile.coverPhoto} alt="" onClick={() => openModal(userProfile.coverPhoto)} className='clickable-photo'/>
                </div>

                <div className="profile-details">
                    <div className="profile-photo">
                        <img src={userProfile.profilePhoto} alt="" onClick={() => openModal(userProfile.profilePhoto)} className='clickable-photo'/>
                    </div>
                    <Button className='edit-profile-btn' onClick={handleShow}>Profili düzenle</Button>
                </div>
                
                {showModal && (
                    <div className="user-profile-model">
                        <div className="modal-overlay" onClick={closeModal}>
                            <div className="modal-content">
                                <img src={currentImage} alt="Büyütülmüş Görsel" />
                                <button className="close-modal" onClick={closeModal}>
                                    ×
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="profile-user-details">
                    <div className="username-name">
                        <p>{userProfile.name}</p>
                        <span>@{userProfile.username}</span>
                    </div>

                    <div className="about-section">
                        <span>{userProfile.about}</span>
                    </div>
                            
                    <div className="attend-date">
                        <p><span><i class="bi bi-calendar-week me-2"></i></span>{userProfile.date} tarihinde katıldı</p>
                    </div>
                            
                    <div className="follower-statistics">
                        <p><b>{userProfile.following}</b> <span>Takip Edilen</span></p>
                        <p><b>{userProfile.follower}</b> <span>Takipçi</span></p>
                    </div>
                </div>

                {/* Edit Modal */}
                <Modal show={showEdit} onHide={handleClose} className='profile-edit-modal' centered>
                    <Modal.Header>
                        <div className="close">
                            <p className='p-0 m-0 me-2 fs-3' onClick={handleClose}><i class="bi bi-x"></i></p>
                            <Modal.Title>Profili Düzenle</Modal.Title>
                        </div>
                        <Button onClick={handleSave}>Kaydet</Button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="cover-photo">
                            <label htmlFor="coverPhotoInput" className="w-100">
                                <img src={tempProfile.coverPhoto} alt="" />
                            </label>
                            <input
                                id="coverPhotoInput"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handlePhotoChange(e, "coverPhoto")}
                            />
                        </div>

                        <div className="profile-details">
                            <div className="profile-photo">
                                <label htmlFor="profilePhotoInput" className="clickable-photo w-100">
                                    <img src={tempProfile.profilePhoto} alt="" />
                                </label>
                                <input
                                    id="profilePhotoInput"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handlePhotoChange(e, "profilePhoto")}
                                />
                            </div>
                        </div>

                        <Form>
                            <Form.Group className='mb-3'>
                                <Form.Label>İsim</Form.Label>
                                <Form.Control 
                                    type='text' 
                                    value={tempProfile.name}
                                    onChange={(e) => 
                                        setTempProfile((prevState) => ({
                                            ...prevState,
                                            name: e.target.value,
                                        }))
                                    }
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Hakkında</Form.Label>
                                <Form.Control 
                                    as='textarea' 
                                    rows={3} 
                                    value={tempProfile.about}
                                    onChange={(e) => 
                                        setTempProfile((prevState) => ({
                                            ...prevState,
                                            about: e.target.value,
                                        }))
                                    }
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
            <hr />
            <div className="profile-page-down">
                <div className="left mb-5">
                   <div className="stories">
                    <div className="stories-title d-flex align-items-center justify-content-start">
                        <p className="text-start m-0 p-0 fw-bold" onClick={storiesClick} style={{cursor: 'pointer'}}>Hikayelerim</p>
                        <div className="story-controls">
                            <button onClick={() => scrollLeft(storyScrollRef)} className="scroll-btn">
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <button onClick={() => scrollRight(storyScrollRef)} className="scroll-btn">
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    <div className="story-list" ref={storyScrollRef}>
                        {stories.map((story) => (
                            <div className="story mt-1" key={story.id}>
                                <img src={story.image} alt="" width="100px" height="140px" className='object-fit-cover'/>
                                <span className='mt-1'>{story.storyName}</span>
                                <div className="statistics d-flex justify-content-between mt-1">
                                    <p className='d-flex'><i class="bi bi-eye me-1"></i>1.8K</p>
                                    <p className='d-flex'><i class="bi bi-heart me-1"></i>1.2K</p>
                                    <p className='d-flex'><i class="bi bi-chat me-1"></i>395</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                   </div>
                   <div className="my-read-list mt-4">
                    <div className="read-list-title d-flex align-items-center justify-content-start">
                        <p className="text-start fw-bold m-0 p-0">Okuma Listem</p>
                        <div className="read-list-controls">
                            <button onClick={() => scrollLeft(readListScrollRef)} className="scroll-btn">
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <button onClick={() => scrollRight(readListScrollRef)} className="scroll-btn">
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    <div className="read-story-list" ref={readListScrollRef}>
                        {stories.map((story) => (
                            <div className="story mt-1" key={story.id}>
                                <img src={story.image} alt="" width="100px" height="140px" className='object-fit-cover'/>
                                <span className='mt-1'>{story.storyName}</span>
                                <div className="statistics d-flex justify-content-between mt-1">
                                    <p className='d-flex'><i class="bi bi-eye me-1"></i>1.8K</p>
                                    <p className='d-flex'><i class="bi bi-heart me-1"></i>1.2K</p>
                                    <p className='d-flex'><i class="bi bi-chat me-1"></i>395</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                   </div>
                </div>
                <div className="right">
                    <div className="right-main">
                        <p className='text-center fw-bold'>Duyurular</p>
                        <div className="add-announcement">
                            <div className="add-announcement-left">
                                <img
                                    src="/images/pp.jpg"
                                    alt=""
                                    width="40"
                                    height="40"
                                    className="rounded-circle object-fit-cover"
                                />
                            </div>
                            <div className="add-announcement-right d-flex flex-column">
                                <div className="d-flex">
                                    <textarea
                                        className="form-control"
                                        placeholder="Bir şeyler yazmak için tıklayın..."
                                        value={content}
                                        onChange={handleContentChange}
                                        onFocus={handleTextareaFocus} 
                                    ></textarea>
                                </div> 
                                {isAnnouncementVisible && (
                                    <>
                                        <div className={`char-count ${charCount >= 195 ? 'text-danger' : ''}`}>
                                            {charCount}/200
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-2 announcement-buttons">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="notifyFollowers"
                                                    checked={notifyFollowers}
                                                    onChange={(e) => setNotifyFollowers(e.target.checked)}
                                                />
                                                <label
                                                    className="form-check-label"
                                                >
                                                    Bunu takipçilerine duyur
                                                </label>
                                            </div>
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleAddAnnouncement}
                                                disabled={charCount > 200}
                                            >
                                                Yayınla
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>   
                        </div>
                        {posts.map((post) => (
                                <div className="profile-announcement" key={post.id}>
                                    <div className="profile-announcement-left">
                                        <img 
                                            src="/images/pp.jpg"
                                            alt="" 
                                            width="40" 
                                            height="40" 
                                            className='rounded-circle object-fit-cover'/>
                                    </div>
                                    <div className="profile-announcement-right">
                                        <div className="user-info d-flex justify-content-between">
                                            <p>
                                                Elif Turan 
                                                <br />
                                                <span>@elifturan 
                                                    <i className="bi bi-dot ms-2"></i> {getTimeDifference(post.publishedDate)}
                                                </span>
                                            </p>
                                            <Dropdown>
                                                <Dropdown.Toggle className='no-toggle'>
                                                    <i className="bi bi-three-dots"></i>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item className='icon-link icon-link-hover' onClick={() => handleDeleteClick(post.id)}><i class="bi bi-trash me-1"></i>Sil</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <div className="content mt-3">
                                            Yeni bölüm yayında
                                        </div>
                                        <div className="interaction mt-3">
                                            <div className="left">
                                                <p>
                                                    <i
                                                        className={`bi ${likedPosts.includes(post.id) ? "bi-heart-fill me-2" : "bi-heart me-2"}`}
                                                        onClick={() => handleLike(post.id)}
                                                    ></i>
                                                    {post.likeCount}
                                                </p>
                                                <p><i className="bi bi-chat me-2" onClick={() => toggleComments(post.id)}></i>{post.commentCount}</p>
                                            </div>
                                            <i className="bi bi-share"></i>
                                        </div>

                                        {/* Add comment */}
                                        {showComments === post.id && (
                                            <div className="profile-comment-section mt-3">
                                                {postComment
                                                    .filter((comment) => comment.postId === post.id)
                                                    .slice(0, showAllComments[post.id] ? postComment.length : 3)
                                                    .map((comment) => (
                                                        <div className="comment-item d-flex align-items-start mb-2" key={comment.id}>
                                                            <div className="comment-item-left">
                                                                <img 
                                                                    src={comment.images}
                                                                    alt="" 
                                                                    width="30" 
                                                                    height="30"  
                                                                    className='rounded-circle object-fit-cover me-2'
                                                                />
                                                                <div>
                                                                    <p className='m-0 mt-1'>
                                                                        <span>@{comment.username}: </span>{comment.commentContent}
                                                                    </p>
                                                                    <div className="date-reply d-flex gap-3 align-items-center">
                                                                        <small>{getTimeDifference(comment.commentDate)}</small>
                                                                        <a 
                                                                            onClick={() => toggleReplies(comment.id)}
                                                                            style={{
                                                                                fontSize: "0.7rem",
                                                                                cursor: "pointer",
                                                                                color: "#0D6FED",
                                                                                opacity: "0.8"
                                                                            }}
                                                                        >{comment.showReplies ? "Yanıtları Gizle" : `Yanıtları Gör (${comment.replies.length})`}</a>
                                                                    </div>
                                                                    {comment.showReplies && comment.replies.map((reply) => (
                                                                        <div className="reply-item d-flex align-items-start mt-2" key={reply.id}>
                                                                            <img 
                                                                                src="/images/pp.jpg"
                                                                                alt=""
                                                                                width="25"
                                                                                height="25"
                                                                                className="rounded-circle object-fit-cover me-2"
                                                                            />
                                                                            <div>
                                                                                <p className="m-0 mt-1">
                                                                                <span>@{reply.username}: </span>
                                                                                {reply.replyContent}
                                                                                </p>
                                                                                <small>{getTimeDifference(reply.replyDate)}</small>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    {comment.showReplyInput && (
                                                                        <div className="reply-input">
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Yanıtınızı yazın..."
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === "Enter" && e.target.value.trim()) {
                                                                                        handleReply(comment.id, e.target.value.trim());
                                                                                        toggleReplyInput(comment.id);
                                                                                        e.target.value = "";
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="comment-item-right">
                                                            <p>
                                                                <i
                                                                    className={`bi ${likedComments.includes(comment.id) ? "bi-heart-fill me-2" : "bi-heart me-2"}`}
                                                                    onClick={() => handleCommentLike(comment.id)}
                                                                ></i>
                                                                {comment.commentLike}
                                                            </p>
                                                            </div>
                                                        </div>
                                                ))}
                                                {postComment.filter((comment) => comment.postId === post.id).length > 3 && (
                                                    <Button
                                                        variant="link"
                                                        onClick={() => handleToggleComments(post.id)}
                                                        className="show-more-comments"
                                                    >
                                                        {showAllComments[post.id] ? "Daha Az Göster" : "Daha Fazla Göster"}
                                                    </Button>
                                                )}
                                                <div className="comment-input d-flex">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Bir yorum yaz..."
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && e.target.value.trim()) {
                                                                const newComment = {
                                                                    id: Math.random(),
                                                                    postId: post.id,
                                                                    username: "elif",
                                                                    images: "/images/profile.jpg",
                                                                    commentContent: e.target.value.trim(),
                                                                    commentDate: new Date().toISOString(),
                                                                    commentLike: 0,
                                                                    replies: [],
                                                                    showReplyInput: false,
                                                                    showReplies: false,
                                                                };
                                                                setPostComment([...postComment, newComment]);
                                                                e.target.value = "";
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        className="btn btn-primary ms-2"
                                                        onClick={(e) => {
                                                            const input = e.target.previousElementSibling;
                                                            if (input.value.trim()) {
                                                                const newComment = {
                                                                    id: Math.random(),
                                                                    postId: post.id,
                                                                    username: "elif",
                                                                    images: "/images/profile.jpg",
                                                                    commentContent: input.value.trim(),
                                                                    commentDate: new Date().toISOString(),
                                                                    commentLike: 0,
                                                                    replies: [],
                                                                    showReplyInput: false,
                                                                    showReplies: false,
                                                                };
                                                                setPostComment([...postComment, newComment]);
                                                                input.value = "";
                                                            }
                                                        }}
                                                    >
                                                        Gönder
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default Profile