import React, { useRef, useState, useEffect } from 'react'
import './UserProfile.css'
import Footer from '../../layouts/footer/Footer'
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function UserProfile() {
    const [showModal, setShowModal] = useState(false);
    const [currentImage, setCurrentImage] = useState("");
    const [isHovering, setIsHovering] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const storyScrollRef = useRef(null);
    const readListScrollRef = useRef(null);
    const { username } = useParams();
    const [user, setUserProfile] = useState([])
    const [stories, setStories] = useState([]);
    const [books, setBooks] = useState([]);
    const [anons, setAnons] = useState([]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/profile/${username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUserProfile(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }; 

        fetchUserProfile();
    }, [username]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/book/profile/other/${username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setStories(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
    
        fetchBooks();
    }, [username]);
    
    useEffect(() => {
        const fetchReadingList = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/reading-list/user/${username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setBooks(response.data.books);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }; 

        fetchReadingList();
    }, []);

    useEffect(() => {
        const fetchAnons = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/anons/user/${username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setAnons(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }; 

        fetchAnons();
    }, []);

    const checkIsFollowing = async (username) => {
        try {
            const response = await axios.get(`http://localhost:3000/following/is-following/${username}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data; 
        } catch (error) {
            console.error('Error checking follow status:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchFollowStatus = async () => {
            try {
                const status = await checkIsFollowing(username);
                setIsFollowing(status);
            } catch (error) {
                console.error('Error fetching follow status:', error);
            }
        };
        fetchFollowStatus();
    }, [username]);
    
    const followUser = async (username) => {
        try {
            await axios.post(
                `http://localhost:3000/following/follow/${username}`,
                { username },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
        } catch (error) {
            console.error('Error following user:', error);
            throw error;
        }
    };
    
    const unfollowUser = async (username) => {
        try {
            await axios.post(
                `http://localhost:3000/following/unfollow/${username}`,
                { username },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
        } catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    };
    
    const openModal = (image) => {
        setCurrentImage(image);
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setCurrentImage("");
    }

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await unfollowUser(username); 
                setIsFollowing(false); 
            } else {
                await followUser(username); 
                setIsFollowing(true); 
            }
        } catch (error) {
            console.error('Error toggling follow status:', error);
        }
    };    

    const scrollLeft = (ref) => {
        if(ref.current) {
            ref.current.scrollBy({ left: -150, behavior: 'smooth' });
        }
    }

    const scrollRight = (ref) => {
        if(ref.current) {
            ref.current.scrollBy({ left: 150, behavior: 'smooth' });
        }
    }

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

    function formatDate(dateString) {
        const date = new Date(dateString);
            return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
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

    return (
        <>
            <div className="profile2-page">
                <div className="profile2-page-up">
                    <div className="cover-photo">
                        <img 
                            src={user.image_background} 
                            alt="" 
                            onClick={() => openModal(user.image_background)}
                        />
                    </div>
                    <div className="profile2-details">
                        <div className="profile-photo">
                            <img 
                                src={user.profile_image}
                                alt="" 
                                onClick={() => openModal(user.profile_image)}
                            />
                        </div>
                        {isFollowing ? (
                            <Button 
                            className='unfollow-btn'
                            onClick={handleFollowToggle}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            {isHovering  ? 'Takibi Bırak' : 'Takip Ediliyor'}
                        </Button>
                            
                        ): (
                            <Button className='follow-btn' onClick={handleFollowToggle}>Takip Et</Button>
                        )}
                    </div>
                    {showModal && (
                        <div className="profile2-modal">
                            <div className="modal-overlay" onClick={closeModal}>
                                <div className="modal-content">
                                    <img src={currentImage} alt="" />
                                    <button className='close-modal' onClick={closeModal}>×</button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="profile2-user-details">
                        <div className="username-name">
                            <p>{user.name}</p>
                            <span>@{user.username}</span>
                        </div>
                        <div className="about-section">
                            <span>{user.about}</span>
                        </div>
                        <div className="attend-date">
                            <p><span><i className="bi bi-calendar-week me-2"></i></span>{formatDate(user.date)} tarihinde katıldı</p>
                        </div>

                        <div className="follower-statistics">
                            <p><b>{user.followingCount}</b> <span>Takipçi</span></p>
                            <p><b>{user.followersCount}</b> <span>Takip Edilen</span></p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="profile2-page-down">
                    <div className="left mb-5">
                        <div className="stories">
                            <div className="stories-title d-flex align-items-center justify-content-start">
                                <p className="text-start m-0 p-0 fw-bold" style={{cursor: 'pointer'}}>
                                    Yazdığı Hikayeler
                                </p>
                                <div className="story-controls">
                                    <button onClick={() => scrollLeft(storyScrollRef)} className='scroll-btn'>
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                    <button onClick={() => scrollRight(storyScrollRef)} className='scroll-btn'>
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="story-list" ref={storyScrollRef}>
                                {stories.map((story) => (
                                    <div className="story mt-1" key={story.id}>
                                        <img src={story.bookCover} alt="" width="100px" height="140px" className='object-fit-cover'/>
                                        <span className='mt-1'>{story.title}</span>
                                        <div className="statistics d-flex justify-content-between mt-1">
                                            <p className='d-flex'><i className="bi bi-eye me-1"></i>{formatNumber(story.analysis?.[0]?.read_count ?? 0)}</p>
                                            <p className='d-flex'><i className="bi bi-heart me-1"></i>{formatNumber(story.analysis?.[0]?.like_count ?? 0)}</p>
                                            <p className='d-flex'><i className="bi bi-chat me-1"></i>{formatNumber(story.analysis?.[0]?.comment_count ?? 0)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="my-read-list mt-4">
                            <div className="read-list-title d-flex align-items-center justify-content-start">
                                <p className="text-start fw-bold m-0 p-0">Okuma Listesi</p>
                                <div className="read-list-controls">
                                    <button className="scroll-btn" onClick={() => scrollLeft(readListScrollRef)}>
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                    <button className="scroll-btn" onClick={() => scrollRight(readListScrollRef)}>
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="read-story-list" ref={readListScrollRef}>
                                {books.map((book) => (
                                    <div className="story mt-1" key={book.id}>
                                        <img src={book.bookCover} alt="" width="100px" height="140px" className='object-fit-cover'/>
                                        <span className='mt-1'>{book.title}</span>
                                        <div className="statistics d-flex justify-content-between mt-1">
                                            <p className='d-flex'><i className="bi bi-eye me-1"></i>{formatNumber(book.analysis?.[0]?.read_count ?? 0)}</p>
                                            <p className='d-flex'><i className="bi bi-heart me-1"></i>{formatNumber(book.analysis?.[0]?.like_count ?? 0)}</p>
                                            <p className='d-flex'><i className="bi bi-chat me-1"></i>{formatNumber(book.analysis?.[0]?.comment_count ?? 0)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="right-main">
                            <p className='text-center fw-bold'>Duyurular</p>
                            {anons.map((announcement) => (
                                    <div className="profile2-announcement" key={announcement.id}>
                                        <div className="profile2-announcement-left">
                                            <img 
                                                src={user.profile_image}
                                                alt="" 
                                                width="40" 
                                                height="40" 
                                                className='rounded-circle object-fit-cover'/>
                                        </div>
                                        <div className="profile2-announcement-right">
                                            <div className="user-info d-flex justify-content-between">
                                                <p>
                                                    {user.name}
                                                    <br />
                                                    <span>@{user.username}
                                                        <i className="bi bi-dot ms-2"></i> {getTimeDifference(announcement.date)}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="content mt-3">
                                                {announcement.content}
                                            </div>
                                            <div className="interaction mt-3">
                                                <div className="left">
                                                </div>
                                                <i className="bi bi-share"></i>
                                            </div>
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

export default UserProfile