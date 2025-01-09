import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import './ContinueRead.css';

function ContinueRead({initialLastActivity}) {
    const navigate = useNavigate();
    const [lastActivity, setLastActivity] = useState(null);

    useEffect(() => {
        const fetchLastActivity = async () => {
            const token = localStorage.getItem('token');
            const parsedToken = token && token.startsWith('{') ? JSON.parse(token) : token;
            if (!parsedToken) {
                console.error("Token bulunamadı!");
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3000/book-case/last`, {
                    headers: {
                        Authorization: `Bearer ${parsedToken}`,
                    },
                });
                console.log(response.data);
                setLastActivity(response.data); 
            } catch (error) {
                console.error("Kitap alınırken hata oluştu:", error.response?.data || error.message);
            }
        };
        if (!initialLastActivity) {
            fetchLastActivity();
        }
    }, [initialLastActivity]);

    const handleProfileClick = (username) => {
        navigate(`/user/${username}`);
    }

    const handleBookClick = (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/book-details/${formattedBookName}`)
    }

    const handleAudioBookClick = (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/audio-book-details/${formattedBookName}`)
    }

    const handleReadBookClick = (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/read-book/${formattedBookName}`);
    }

    const handleListenAudioBookClick = (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/listen-audio-book/${formattedBookName}`);
    }

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
        <div className="continue-read-row">
            {lastActivity ? (
                <div className="container mt-5 mb-5">
                    <div className="continue-read text-center">
                        <div className="row">
                            <div className="col-lg-3 book-cover">
                                <h2 className='text-start ms-5 mb-3'>
                                    {lastActivity.type === 'book' ? "Okumaya Devam Et" : "Dinlemeye Devam Et"}
                                </h2>
                                <img 
                                    src={lastActivity.type === 'book' ? lastActivity.book?.bookCover : lastActivity.audioBooks?.bookCover} 
                                    alt="cover" 
                                    width="220px" 
                                    onClick={() =>
                                        lastActivity.type === 'book' 
                                            ? handleBookClick(lastActivity.book?.title) 
                                            : handleAudioBookClick(lastActivity.audioBooks?.title)
                                    } 
                                    style={{cursor: 'pointer'}}
                                /> 
                            </div>
                            <div className="col-lg-8">
                                <div className="book-content text-start"> 
                                    <div className="book-content-up mt-5">
                                        <div className="bookName">
                                            <h4 
                                                onClick={() =>
                                                    lastActivity.type === 'book' 
                                                        ? handleBookClick(lastActivity.book?.title) 
                                                        : handleAudioBookClick(lastActivity.audioBooks?.title)
                                                } 
                                                style={{cursor: 'pointer'}}
                                            >
                                                {lastActivity.type === 'book' ? lastActivity.book?.title : lastActivity.audioBooks?.title}
                                            </h4> 
                                        </div>
                                        <div className="writer-info d-flex flex-row align-items-center" 
                                        onClick={() => handleProfileClick(
                                        lastActivity.type === 'book' 
                                            ? lastActivity.book?.user?.username 
                                            : lastActivity.audioBooks?.user?.username
                                        )}>
                                            <img 
                                            src={
                                                lastActivity.type === 'book' 
                                                ? lastActivity.book?.user?.profile_image 
                                                : lastActivity.audioBooks?.user?.profile_image
                                            }                                             alt="30x30" 
                                            width="25px" 
                                            height="25px" 
                                            className='img-fuild rounded-circle object-fit-cover'
                                            />
                                            <p className='ms-2 d-flex mt-2'>
                                            {lastActivity.type === 'book' 
                                                ? lastActivity.book?.user?.username 
                                                : lastActivity.audioBooks?.user?.username}
                                            </p>                                    </div>
                                        <div className="book-info mt-2">
                                            {lastActivity.type === 'book' ? lastActivity.book?.summary : lastActivity.audioBooks?.summary}
                                        </div>
                                    </div>
                                    <div className="book-content-down">
                                        <div className="interaction d-flex">
                                            <div className="read-count me-3">
                                                <p>
                                                    <i className="bi bi-eye-fill text-muted me-1"></i> 
                                                    {lastActivity.type === 'book' 
                                                        ? formatNumber(lastActivity.book?.analysis[0]?.read_count || 0) 
                                                        : formatNumber(lastActivity.audioBooks?.analysis[0]?.read_count || 0)}
                                                </p>
                                            </div>
                                            <div className="like-count me-3">
                                                <p>
                                                    <i className="bi bi-heart-fill text-muted me-1"></i>
                                                    {lastActivity.type === 'book' 
                                                        ? formatNumber(lastActivity.book?.analysis[0]?.like_count || 0) 
                                                        : formatNumber(lastActivity.audioBooks?.analysis[0]?.like_count || 0)}
                                                </p>
                                            </div>
                                            <div className="comment-count me-3">
                                                <p>
                                                    <i className="bi bi-chat-fill text-muted me-1"></i> 
                                                    {lastActivity.type === 'book' 
                                                        ? formatNumber(lastActivity.book?.analysis[0]?.comment_count || 0) 
                                                        : formatNumber(lastActivity.audioBooks?.analysis[0]?.comment_count || 0)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="continue-read-button">

                                        {lastActivity.type === 'book' ? (
                                            <Button className="btn btn-read-continue" onClick={() => handleReadBookClick(lastActivity.book?.title)}>
                                                Okumaya Devam Et
                                            </Button>
                                            ) : (
                                            <Button className="btn btn-read-continue" onClick={() => handleListenAudioBookClick(lastActivity.audioBooks?.title)}>
                                                Dinlemeye Devam Et
                                            </Button>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Henüz bir aktivite yok.</p>
            )}
        </div>
    );
}

export default ContinueRead;
