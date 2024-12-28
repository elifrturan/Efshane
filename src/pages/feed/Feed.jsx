import React, { useState, useEffect } from 'react'
import './Feed.css'
import Navbar from "../../layouts/navbar/Navbar"
import { Button, Dropdown } from 'react-bootstrap';
import AddPost from './addpost/AddPost';
import FollowOthers from './followothers/FollowOthers';
import axios from 'axios';

function Feed() {
    const [modalImage, setModalImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showComments, setShowComments] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [postComment, setPostComment] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/feed', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log('Backend Response:', response.data); 
                setPosts(response.data);
            } catch (error) {
                console.error('Hata:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPosts();
    }, []);
    
    const handleAddNewPost = (newPost) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:3000/feed/comments/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log("Fetched comments:", response.data);

            if (!Array.isArray(response.data)) {
                console.error("API did not return an array:", response.data);
                setPostComment((prev) => ({
                    ...prev,
                    [postId]: [],
                }));
                return;
            }
    
            setPostComment((prev) => ({
                ...prev,
                [postId]: response.data,
            }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };    

    const handleSendComment = async (postId, content) => {
        try {
            const response = await axios.post(
                `http://localhost:3000/feed/post/${postId}`,
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            const newComment = response.data;
    
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
    
            const newReply = response.data;
    
            setPostComment((prev) => {
                const updatedComments = prev[postId]?.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: [...(comment.replies || []), newReply],
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
            console.error("Error adding reply:", error);
        }
    };

    const fetchReplyComments = async (commentId) => {
        try {
            const response = await axios.get(`http://localhost:3000/feed/reply/replys/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            console.log('Fetched Replies for Comment ID:', commentId, response.data);
    
            if (!Array.isArray(response.data)) {
                console.error("API did not return an array:", response.data);
                return;
            }
    
            setPostComment((prev) => ({
                ...prev,
                    [commentId]: prev[commentId] ? {
                        ...(prev[commentId] || {}),
                        replies: Array.isArray(response.data) ? response.data : [response.data], 
                        showReplies: true,
                        replyInputVisible: prev[commentId]?.replyInputVisible || false,
                    } : {
                        replies: response.data,
                        showReplies: true,
                        replyInputVisible: prev[commentId]?.replyInputVisible || false, 
                    },
            }));
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
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
            console.log('Beğenme durumu değiştirildi:', response.data);
        } catch (error) {
            console.error('Beğenme işlemi başarısız:', error);
        }
    };    
    
    const handleRepost = async (postId) => {
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
    
            // Repost edilen gönderiyi güncelle
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === originalPost.id
                        ? {
                                ...post,
                                isRepostedByUser: originalPost.isRepostedByUser,
                                analysis: {
                                    ...post.analysis,
                                    repost_count: originalPost.analysis.repost_count,
                                },
                            }
                        : post
                )
            );
    
            console.log('Repost sonrası güncellenmiş post:', originalPost);
        } catch (error) {
            console.error('Repost işlemi başarısız:', error);
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
    
    const toggleReplies = (commentId, postId) => {
        if (!postComment[commentId]) {
            fetchReplyComments(commentId); 
        }
        setPostComment((prev) => ({
            ...prev,
            [postId]: prev[postId]?.map((comment) =>
                comment.id === commentId
                    ? {
                        ...comment,
                        showReplies: !comment.showReplies, 
                    }
                    : comment
            ),
        }));
    };  

    const toggleReplyInput = (commentId, postId) => {
        setPostComment((prev) => ({
            ...prev,
            [postId]: prev[postId]?.map((comment) =>
                comment.id === commentId
                        ? {
                            ...comment,
                            replyInputVisible: !comment.replyInputVisible,
                        }
                    : comment
            ),
        }));
    };
    
    const renderComments = (comments = [], postId) => {
        //if (!Array.isArray(comments)) {
        //   console.error("Comments is not an array:", comments);
        //    return comments; 
        //}
        console.log("aaa");
        // return comments.map((comment) => (
        //     <div key={comment.id} className="comment-item">
        //         <div className="comment-header">
        //             <img
        //                 src={comment.user?.profile_image || '/default-profile.png'}
        //                 alt="User"
        //                 className="rounded-circle"
        //                 width="30"
        //                 height="30"
        //             />
        //             <span>@{comment.user?.username || 'Unknown'}</span>
        //             <small>{getTimeDifference(comment.publish_date)}</small>
        //         </div>
        //         <p>{comment.content}</p>
        //         <button
        //             onClick={() => toggleReplyInput(comment.id, postId)}
        //             className="btn btn-link"
        //         >
        //             Yanıtla
        //         </button>
        //         {comment.replyInputVisible && (
        //             <input
        //                 type="text"
        //                 placeholder="Yanıtınızı yazın..."
        //                 onKeyDown={(e) => {
        //                     if (e.key === 'Enter' && e.target.value.trim()) {
        //                         handleReply(comment.id, e.target.value.trim(), postId);
        //                         e.target.value = '';
        //                     }
        //                 }}
        //                 className="form-control mt-2"
        //             />
        //         )}
        //         <button
        //             onClick={() => toggleReplies(comment.id, postId)}
        //             className="btn btn-link"
        //         >
        //             {comment.showReplies ? 'Yanıtları Gizle' : 'Yanıtları Gör'}
        //         </button>
        //         {comment.showReplies && renderComments(comment.replies || [], postId)}
        //     </div>
        // ));
    };            

return (
    <div className='feed-page'>
        <Navbar/>
        <div className="container">
            <div className="feed-page-main mt-5">
                    <div className="posts">
                        <AddPost onNewPost={handleAddNewPost}/>
                        {posts.map((post) => (
                            <div className="feed-post" key={post.id}>
                                <div className="feed-post-left">
                                    <img 
                                        src={post.user?.profile_image} 
                                        alt="" 
                                        width="40" 
                                        height="40" 
                                        className='rounded-circle object-fit-cover'/>
                                </div>
                                <div className="feed-post-right">
                                    <div className="user-info d-flex justify-content-between">
                                        <p>
                                            {post.user?.username} 
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
                                                <Dropdown.Item><i class="bi bi-emoji-frown me-2"></i>Bu gönderi ilgimi çekmiyor</Dropdown.Item>
                                                <Dropdown.Item><i class="bi bi-flag me-2"></i>Bu gönderiyi bildir</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <div className="content mt-3">
                                        {post.content}
                                    </div>
                                    <div className="post-image">
                                        {post.image ? (
                                            <img 
                                                src={`http://localhost:3000/${post.image}`}
                                                onClick={() => openModal(post.image)}
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
                                            {post.analysis?.like_count}
                                        </p>
                                            <p>
                                                <i
                                                    className={`bi ${post.isRepostedByUser  ? "bi-repeat active me-2 text-success" : "bi-repeat me-2"}`}
                                                    onClick={() => handleRepost(post.id)}
                                                ></i>
                                                {post.analysis?.repost_count}
                                            </p>
                                            <div>
                                                <p onClick={() => toggleComments(post.id)}>
                                                    <i className="bi bi-chat me-2"></i>
                                                    {post.analysis?.comment_count}
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
                                                                src={comment.user?.profile_image}
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
                                                                {/* {(() => {
                                                                    {renderComments(postComment[comment.replies.id] || [], comment.replies.id)}
                                                                })()} */}
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
    </div>
)
}

export default Feed