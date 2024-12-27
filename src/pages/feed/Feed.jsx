import React, { useState } from 'react'
import './Feed.css'
import Navbar from "../../layouts/navbar/Navbar"
import { Button, Dropdown } from 'react-bootstrap';
import AddPost from './addpost/AddPost';
import FollowOthers from './followothers/FollowOthers';

function Feed() {
    const [likedPosts, setLikedPosts] = useState([]);
    const [quotationPosts, setQuotationPosts] = useState([]);
    const [modalImage, setModalImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showComments, setShowComments] = useState(null);
    const [likedComments, setLikedComments] = useState([]);

    const openModal = (imageSrc) => {
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalImage(null);
        setIsModalOpen(false);
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
    }

    const [posts, setPosts] = useState([
        {
            id: 1,
            image: "/images/woman-pp.jpg",
            name: "Pamuk Şeker",
            username: "pamukseker",
            content: "Gurur ve kibir eş anlamlı olarak kullanılsalar da aslında farklı şeylerdir." + 
                    " Bir kişi kibirli olmadan gururlu olabilir. Kibir başkalarının hakkımızda ne düşünmesini " 
                    + "istediğimiz, gurur ise kendi kendimizi değerlendirmemizdir. - Aşk ve Gurur",
            likeCount: 458,
            quotationCount: 60,
            commentCount: 25,
            postImage: true,
            postImageSrc: "/images/ask-ve-gurur.jpg",
            publishedDate: "2023-09-10T14:30:00"
        },
        {
            id: 2,
            image: "/images/woman-pp.jpg",
            name: "Pamuk Şeker",
            username: "pamukseker",
            content: "Gurur ve kibir eş anlamlı olarak kullanılsalar da aslında farklı şeylerdir." + 
                    " Bir kişi kibirli olmadan gururlu olabilir. Kibir başkalarının hakkımızda ne düşünmesini " 
                    + "istediğimiz, gurur ise kendi kendimizi değerlendirmemizdir. - Aşk ve Gurur",
            likeCount: 458,
            quotationCount: 60,
            commentCount: 25,
            postImage: true,
            postImageSrc: "/images/voice-ai.jpg",
            publishedDate: "2024-12-10T14:30:00"
        }
    ])

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
    ])

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
    }

    const handleQuotation = (postId) => {
        setPosts((prev) => 
            prev.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        quotationCount: quotationPosts.includes(postId)
                            ? post.quotationCount - 1
                            : post.quotationCount + 1,
                    };
                }
                return post;
            })
        );

        setQuotationPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    }

    const handleToggleComments = (postId) => {
        setShowAllComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    }

    const toggleComments = (postId) => {
        setShowComments(prev => prev === postId ? null : postId);
    }

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
    }

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
    }

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
    
  return (
    <div className='feed-page'>
        <Navbar/>
        <div className="container">
            <div className="feed-page-main mt-5">

                    <div className="posts">
                        <AddPost/>
                        {posts.map((post) => (
                            <div className="feed-post" key={post.id}>
                                <div className="feed-post-left">
                                    <img 
                                        src={post.image} 
                                        alt="" 
                                        width="40" 
                                        height="40" 
                                        className='rounded-circle object-fit-cover'/>
                                </div>
                                <div className="feed-post-right">
                                    <div className="user-info d-flex justify-content-between">
                                        <p>
                                            {post.name} 
                                            <br />
                                            <span>@{post.username} 
                                                <i className="bi bi-dot ms-2"></i> {getTimeDifference(post.publishedDate)}
                                            </span>
                                        </p>
                                        <Dropdown>
                                            <Dropdown.Toggle className='no-toggle'>
                                                <i className="bi bi-three-dots"></i>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item><i class="bi bi-emoji-frown me-2"></i>Bu gönderi ilgimi çekmiyor</Dropdown.Item>
                                                <Dropdown.Item><i class="bi bi-flag me-2"></i>Bu gönderiyi bildir</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <div className="content mt-3">
                                        {post.content}
                                    </div>
                                    <div className="post-image">
                                        {post.postImage ? (
                                            <img 
                                                src={post.postImageSrc}
                                                onClick={() => openModal(post.postImageSrc)}
                                                style={{cursor: "pointer"}}
                                            />
                                        ): (
                                            <img src="" style={{display: 'none'}}/>
                                        )}
                                    </div>
                                    {isModalOpen && (
                                        <div className="modal-overlay" onClick={closeModal}>
                                            <div className="modal-content">
                                                <img src={modalImage} alt="Post Görseli" />
                                                <button className="close-modal" onClick={closeModal}>×</button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="interaction mt-3">
                                        <div className="left">
                                            <p>
                                                <i
                                                    className={`bi ${likedPosts.includes(post.id) ? "bi-heart-fill me-2" : "bi-heart me-2"}`}
                                                    onClick={() => handleLike(post.id)}
                                                ></i>
                                                {post.likeCount}
                                            </p>
                                            <p>
                                                <i
                                                    className={`bi ${quotationPosts.includes(post.id) ? "bi-repeat active me-2" : "bi-repeat me-2"}`}
                                                    onClick={() => handleQuotation(post.id)}
                                                ></i>
                                                {post.quotationCount}
                                            </p>
                                            <p><i className="bi bi-chat me-2" onClick={() => toggleComments(post.id)}></i>{post.commentCount}</p>
                                        </div>
                                        <i className="bi bi-share"></i>
                                    </div>

                                    {/* Add comment */}
                                    {showComments === post.id && (
                                        <div className="comment-section mt-3">
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
                    <div className="follow-other">
                        <FollowOthers/>
                    </div>

            </div>
        </div>
    </div>
  )
}

export default Feed