import React, { useEffect, useState } from 'react'
import './Notifications.css'
import Footer from "../../layouts/footer/Footer"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const backendBaseUrl = 'http://localhost:3000';
const socket = io(backendBaseUrl);

function Notifications() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 12;
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:3000/notify', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setNotifications(response.data);

                const userId = localStorage.getItem("userId");
                if (userId) {
                    socket.emit('joinRoom', { userId: Number(userId) });
                }

                socket.on('notification', (data) => {
                    setNotifications((prev) => [data, ...prev]); 
                });

                return () => {
                    socket.off('notification');
                };
            } catch (error) {
                console.error("Bildirimler yüklenirken bir hata oluştu:", error);
            }
        };

        fetchNotifications();
    }, []);

    function timeAgo(date){
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);

        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor (diffInSeconds / 3600);
        const days = Math.floor(diffInSeconds / 86400);

        if(diffInSeconds < 60){
            return `${diffInSeconds} saniye önce`;
        } 
        else if (minutes < 60){
            return `${minutes} dakika önce`;
        }
        else if (hours < 24){
            return `${hours} saat önce`;
        }
        else {
            return `${days} gün önce`;
        }

    }

    const handleDeleteNotification = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/notify/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setNotifications(notifications.filter(notification => notification.id !== id));
        } catch (error) {
            console.error("Bildirim silinirken bir hata oluştu:", error);
        }
    };

    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = sortedNotifications.slice(indexOfFirstNotification, indexOfLastNotification);

    const totalPages = Math.ceil(sortedNotifications.length / notificationsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
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
    
    const handleProfileClick = (username) => {
        navigate(`/user/${username}`);
    }

    const handleBookClick = (notification) => {
        const formattedBookName = formatBookNameForURL(notification.bookTitle);
        if (notification.isAudioBook) {
            navigate(`/audio-book-details/${formattedBookName}`)
        } else {
            navigate(`/book-details/${formattedBookName}`);
        }
    }

    return (
        <div className="notifications-page">
            <div className="container d-flex flex-column justify-content-between gap-2">
                <div>
                    <h2 className='text-center mt-5 mb-5'>Bildirimler</h2>
                    <span>Toplam <b>{notifications.length}</b> adet bildirim</span>
                    {currentNotifications.map(notification => (
                        <div className="notification d-flex justify-content-between mb-3" key={notification.id}>
                            <div className='d-flex'>
                                <img 
                                    src={
                                        notification?.author?.profile_image
                                            ? notification.author?.profile_image.startsWith('uploads')
                                                ? `${backendBaseUrl}/${notification.author?.profile_image}`
                                                : notification.author?.profile_image
                                            : 'default-book-cover.jpg'
                                    }
                                    alt="" 
                                    className="rounded-circle object-fit-cover notification-image" 
                                    width="50px" 
                                    height="50px" 
                                    onClick={() => handleProfileClick(notification.author?.username)}
                                />
                                <div className="notification-content d-flex justify-content-center align-items-center ms-3">
                                    <p className="m-0">
                                        {notification.bookTitle ? (
                                            <>
                                                <span 
                                                    className="fw-bold" 
                                                    style={{ cursor: 'pointer' }} 
                                                    onClick={() => handleProfileClick(notification.author?.username)}
                                                >
                                                    {"“" + notification.author?.username + "”"}
                                                </span>{" "}
                                                adlı kullanıcının{" "}
                                                <span style={{ cursor: 'pointer' }} onClick={() => handleBookClick(notification)}>
                                                    {notification.chapterTitle ? (
                                                        <>
                                                            <span className="fw-bold">“{notification.bookTitle}”</span> kitabının{" "}
                                                            <span className="fw-bold">“{notification.chapterTitle}”</span> bölümü
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="fw-bold">“{notification.bookTitle}”</span> kitabı
                                                        </>
                                                    )}
                                                </span>{" "}
                                                yayınlandı. Keşfetmeye ne dersin? 📖🎉🎧
                                            </>
                                        ) : (
                                            <>
                                                <span 
                                                    className="fw-bold" 
                                                    style={{ cursor: 'pointer' }} 
                                                    onClick={() => handleProfileClick(notification.author?.username)}
                                                >
                                                    {"@" + notification.author?.username}
                                                </span>{" "}
                                                yeni bir duyuru yayınladı🎯 : {notification.message}
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="delete-button d-flex flex-column justify-content-between">
                                    <i className="bi bi-trash3-fill" onClick={() => handleDeleteNotification(notification.id)}></i>
                                    <p className='notification-time m-0 text-end'>{timeAgo(notification.createdAt)}</p>
                            </div>
                    </div>
                    ))}
                </div>
                <div className="pagination d-flex justify-content-center mt-3 mb-3">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}><i className="bi bi-arrow-left-square-fill"></i></button>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}><i className="bi bi-arrow-right-square-fill"></i></button>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Notifications