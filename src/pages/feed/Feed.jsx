import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Feed.css'
import Footer from "../../layouts/footer/Footer"
import { Button, Dropdown } from 'react-bootstrap';
import AddPost from './addpost/AddPost';
import FollowOthers from './followothers/FollowOthers';

const backendBaseUrl = 'http://localhost:3000';

function Feed() {
    const [modalImage, setModalImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showComments, setShowComments] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [postComment, setPostComment] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/feed', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Hata:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPosts();
        
    }, []);

    const handleProfileClick = (post) => {
        if (!post.user || !post.user.username) {
            console.error("User or username is undefined for post:", post);
            return;
        }
        navigate(`/user/${post.user.username}`);
    };    
    
    const handleAddNewPost = (newPost) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    const reportPost = async (e) => {
        e.stopPropagation();  
        navigate(`/contact-us`);
    }; 
    
    const likeComment = async (commentId, postId) => {
        try {
            const response = await axios.post(
                `http://localhost:3000/feed/comment/like/${commentId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setPostComment((prev) => {
                const updatedComments = prev[postId]?.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            isLiked: response.data.isLiked,
                            analysis: {
                                ...comment.analysis,
                                like_count: response.data.like_count,
                            },
                        };
                    }
                    return comment;
                });

                return {
                    ...prev,
                    [postId]: updatedComments,
                };
            });
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };

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

    function formatNumber(num) {
        if (num === undefined || num === null) return "0";
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

    const handleLike = async (postId, isLiked) => {
        try {
            const response = await axios.post(
                `http://localhost:3000/feed/like/${postId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            analysis: {
                                ...post.analysis,
                                like_count: response.data.like_count, 
                            },
                            isLiked: response.data.isLiked, 
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Beğenme işlemi başarısız:', error);
        }
    };    
    
    const handleRepost = async (postId) => {
        console.log("Repost işlemi yapılıyor...");
        try {
            const response = await axios.post(
                `http://localhost:3000/feed/repost/${postId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            const { originalPost } = response.data;
            console.log("Repost işlemi başarılı:", originalPost);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === originalPost.id
                        ? {
                                ...post,
                                analysis: {
                                    ...post.analysis,
                                    repost_count: originalPost.analysis.repost_count,
                                },
                                isRepostedByUser: originalPost.isRepostedByUser,
                            }
                        : post
                )
            );
    
        } catch (error) {
            console.error('Repost işlemi başarısız:', error);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:3000/feed/comments/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!Array.isArray(response.data)) {
                console.error("API did not return an array:", response.data);
                setPostComment((prev) => ({
                    ...prev,
                    [postId]: [],
                }));
                return;
            }
    
            const commentsWithState = response.data.map(comment => ({
                ...comment,
                replies: comment.replies || [],
                showReplies: false,
                replyInputVisible: false
            }));

            setPostComment((prev) => ({
                ...prev,
                [postId]: commentsWithState,
            }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }; 

    const handleSendComment = async (postId, content) => {
        try {
            const response = await axios.post(
                `${backendBaseUrl}/feed/post/${postId}`,
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            const newComment = {
                ...response.data,
                replies: [],
                showReplies: false,
                replyInputVisible: false
            };

            setPostComment((prev) => ({
                ...prev,
                [postId]: [...(prev[postId] || []), newComment],
            }));

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            analysis: {
                                ...post.analysis,
                                comment_count: post.analysis.comment_count + 1,
                            },
                        }
                        : post
                )
            );
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }; 

    const fetchReplyComments = async (commentId, postId) => {
        try {
            const response = await axios.get(`http://localhost:3000/feed/reply/replys/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            if (!Array.isArray(response.data)) {
                console.error("API did not return an array:", response.data);
                return;
            }
    
            setPostComment((prev) => {
                const updatedComments = prev[postId]?.map((comment) =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            replies: response.data.map(reply => ({
                                ...reply,
                                analysis: reply.analysis || { like_count: 0 },
                                isLiked: reply.isLiked || false
                            })),
                            showReplies: true,
                            replyInputVisible: false 
                        }
                        : comment
                );
                return {
                    ...prev,
                    [postId]: updatedComments,
                };
            });
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    const handleToggleComments = (postId) => {
        setShowAllComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    }

    const toggleComments = (postId) => {
        if (!postComment[postId]) {
            fetchComments(postId);
        }
        setShowComments((prev) => (prev === postId ? null : postId));
    };
    
    const handleReply = async (commentId, content, postId) => {
        try {
            const response = await axios.post(
                `http://localhost:3000/feed/comments/${commentId}`,
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            await fetchReplyComments(commentId, postId);
    
            // const newReply = {
            //     id: response.data.id,
            //     content: response.data.content,
            //     publish_date: response.data.publish_date,
            //     user: response.data.user,
            //     analysis: response.data.analysis || { like_count: 0 },
            //     isLiked: false
            // };
    
            // setPostComment((prev) => {
            //     const updatedComments = prev[postId]?.map((comment) => {
            //         if (comment.id === commentId) {
            //             const existingReplies = Array.isArray(comment.replies) ? comment.replies : [];
            //             return {
            //                 ...comment,
            //                 replies: [...existingReplies, newReply],
            //                 showReplies: true,
            //                 replyInputVisible: false
            //             };
            //         }
            //         return comment;
            //     });
    
            //     return {
            //         ...prev,
            //         [postId]: updatedComments,
            //     };
            // });

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            analysis: {
                                ...post.analysis,
                                comment_count: post.analysis.comment_count + 1,
                            },
                        }
                        : post
                )
            );
        } catch (error) {
            console.error("Error adding reply:", error);
        }
    };
    
    const toggleReplies = async (commentId, postId) => {
        const comment = postComment[postId]?.find(c => c.id === commentId);
        
        if (!comment?.replies?.length) {
            await fetchReplyComments(commentId, postId);
        } else {
            setPostComment((prev) => ({
                ...prev,
                [postId]: prev[postId]?.map((comment) =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            showReplies: !comment.showReplies,
                            replyInputVisible: !comment.replyInputVisible 
                        }
                        : comment
                ),
            }));
        }
    };

    const toggleReplyInput = (commentId, postId) => {
        setPostComment((prev) => ({
            ...prev,
            [postId]: prev[postId]?.map((comment) =>
                comment.id === commentId
                        ? {
                            ...comment,
                            replyInputVisible: !comment.replyInputVisible,
                            showReplies: true,
                        }
                    : comment
            ),
        }));
    };
    
    return (
        <div className='feed-page'>
            <div className="container">
                <div className="feed-page-main mt-5">
                        <div className="posts">
                            <AddPost onNewPost={handleAddNewPost}/>
                            {posts.map((post) => (
                                <div className="feed-post" key={post.id}>
                                    <div className="feed-post-left">
                                        <img 
                                            src={
                                                post?.user?.profile_image
                                                    ? post.user.profile_image.startsWith('uploads')
                                                        ? `${backendBaseUrl}/${post.user.profile_image}`
                                                        : post.user.profile_image
                                                    : 'default-background.jpg' 
                                            }
                                            alt="" 
                                            width="40" 
                                            height="40" 
                                            className='rounded-circle object-fit-cover'
                                            onClick={() => handleProfileClick(post)}/>
                                    </div>
                                    <div className="feed-post-right">
                                        <div className="user-info d-flex justify-content-between">
                                            <p>
                                                {post.user?.name || post.user?.username} 
                                                <br />
                                                <span>@{post.user?.username} 
                                                    <i className="bi bi-dot ms-2"></i> {getTimeDifference(post.createdAt)}
                                                </span>
                                            </p>
                                            <Dropdown>
                                                <Dropdown.Toggle className='no-toggle'>
                                                    <i className="bi bi-three-dots"></i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item><i className="bi bi-emoji-frown me-2"></i>Bu gönderi ilgimi çekmiyor</Dropdown.Item>
                                                    <Dropdown.Item onClick={reportPost}>
                                                        <i className="bi bi-flag me-2"></i>
                                                        Bu gönderiyi bildir
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <div className="content mt-3">
                                            {post.content}
                                        </div>
                                        <div className="post-image">
                                            {post.image ? (
                                                <img 
                                                src={
                                                    post?.image
                                                        ? post.image.startsWith('uploads')
                                                            ? `${backendBaseUrl}/${post.image}`
                                                            : post.image
                                                        : 'default-background.jpg' 
                                                }
                                                onClick={() => openModal(
                                                    post.image.startsWith('uploads')
                                                        ? `${backendBaseUrl}/${post.image}`
                                                        : post.image
                                                )}
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
                                                    className={`bi ${post.isLiked ? "bi-heart-fill me-2" : "bi-heart me-2"}`}
                                                    onClick={() => handleLike(post.id, post.isLiked)}
                                                ></i>
                                                {formatNumber(post.analysis?.like_count)}
                                            </p>
                                                <p>
                                                    <i
                                                        className={`bi ${post.isRepostedByUser  ? "bi-repeat active me-2 text-success" : "bi-repeat me-2"}`}
                                                        onClick={() => handleRepost(post.id)}
                                                    ></i>
                                                    {formatNumber(post.analysis?.repost_count)}
                                                </p>
                                                <div>
                                                    <p onClick={() => toggleComments(post.id)}>
                                                        <i className="bi bi-chat me-2"></i>
                                                        {formatNumber(post.analysis?.comment_count)}
                                                    </p>
                                                </div>
                                            </div>
                                            <i className="bi bi-share"></i>
                                        </div>
                                        {/* Add comment */}
                                        {showComments === post.id && (
                                            <div className="comment-section mt-3">
                                                {(postComment[post.id] || [])
                                                    .slice(0, showAllComments[post.id] ? postComment[post.id]?.length : 3)
                                                    .map((comment)  => (
                                                        <div className="comment-item d-flex align-items-start mb-2" key={comment.id}>
                                                            <div className="comment-item-left">
                                                                <img 
                                                                    src={
                                                                        comment?.user?.profile_image
                                                                            ? comment.user.profile_image.startsWith('uploads')
                                                                                ? `${backendBaseUrl}/${comment.user.profile_image}`
                                                                                : comment.user.profile_image
                                                                            : 'default-background.jpg' 
                                                                    }
                                                                    alt="" 
                                                                    width="30" 
                                                                    height="30"  
                                                                    className='rounded-circle object-fit-cover me-2'
                                                                />
                                                                <div>
                                                                    <p className='m-0 mt-1'>
                                                                        <span>@{comment.user?.username}: </span>{comment.content}
                                                                    </p>
                                                                    <div className="date-reply d-flex gap-3 align-items-center">
                                                                        <small>{getTimeDifference(comment.publish_date)}</small>
                                                                        <a 
                                                                            onClick={() => toggleReplies(comment.id, post.id) }
                                                                            style={{
                                                                                fontSize: "0.7rem",
                                                                                cursor: "pointer",
                                                                                color: "#0D6FED",
                                                                                opacity: "0.8"
                                                                            }}
                                                                        >{postComment[post.id]?.find((c) => c.id === comment.id)?.showReplies
                                                                            ? "Yanıtları Gizle"
                                                                            : `Yanıtları Gör (${comment.replies?.length || 0})`}</a>
                                                                    </div>
                                                                    {comment.showReplies && comment.replies.map((reply) => (
                                                                        <div className="reply-item d-flex align-items-start mt-2" key={reply.id}>
                                                                            <img 
                                                                                src={
                                                                                    reply?.user?.profile_image
                                                                                        ? reply.user.profile_image.startsWith('uploads')
                                                                                            ? `${backendBaseUrl}/${reply.user.profile_image}`
                                                                                            : reply.user.profile_image
                                                                                        : 'default-background.jpg' 
                                                                                }
                                                                                alt=""
                                                                                width="25"
                                                                                height="25"
                                                                                className="rounded-circle object-fit-cover me-2"
                                                                            />
                                                                            <div>
                                                                                <p className="m-0 mt-1">
                                                                                <span>@{reply.user?.username}: </span>
                                                                                {reply.content}
                                                                                </p>
                                                                                <small>{getTimeDifference(reply.publish_date)}</small>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    {comment.replyInputVisible && (
                                                                        <div className="reply-input">
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Yanıtınızı yazın..."
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === "Enter" && e.target.value.trim()) {
                                                                                        handleReply(comment.id, e.target.value.trim(), post.id);
                                                                                        toggleReplyInput(comment.id, post.id);
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
                                                                className={`bi ${comment.isLiked ? "bi-heart-fill me-2" : "bi-heart me-2"}`}
                                                                onClick={() => likeComment(comment.id, post.id, comment.isLiked)}
                                                            ></i>
                                                            {comment.analysis?.like_count}
                                                            </p>
                                                            </div>
                                                        </div>
                                                ))}
                                                {(postComment[post.id] || []).length > 3 && (
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
                                                        id={`input-comment-${post.id}`}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && e.target.value.trim()) {
                                                                handleSendComment(post.id, e.target.value.trim());
                                                                e.target.value = ""; 
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        className="btn btn-primary ms-2"
                                                        onClick={() => {
                                                            const inputField = document.getElementById(`input-comment-${post.id}`);
                                                            if (inputField.value.trim()) {
                                                                handleSendComment(post.id, inputField.value.trim());
                                                                inputField.value = ""; 
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
            <Footer/>
        </div>
    )
}

export default Feed