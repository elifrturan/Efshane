import React, { useEffect, useState } from 'react'
import './Notifications.css'
import Footer from "../../layouts/footer/Footer"
import axios from 'axios';

function Notifications() {
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
                console.log(response.data);
                setNotifications(response.data);
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

    const handleDeleteIcon = async (id) => {
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

    return (
        <div className="notifications-page">
            <div className="container">
                <h2 className='text-center mt-5 mb-5'>Bildirimler</h2>
                <div className="row">
                    <p>Toplam <b>{notifications.length}</b> adet bildirim</p>
                </div>
                {currentNotifications.map(notification => (
                    <div className="notification d-flex justify-content-between mb-3" key={notification.id}>
                        <div className='d-flex'>
                            <img src={notification.user.profile_image} alt="" className="rounded-circle" width="60px" height="60px"/>
                            <div className="notification-content d-flex flex-column justify-content-between ms-3">
                                <p>{notification.message}</p>
                            </div>
                        </div>
                        <div className="delete-button d-flex flex-column justify-content-between">
                                <i className="bi bi-trash3-fill" onClick={() => handleDeleteIcon(notification.id)}></i>
                                <p className='notification-time m-0 text-end'>{timeAgo(notification.createdAt)}</p>
                        </div>
                </div>
                ))}
                <div className="pagination d-flex justify-content-center mt-3 mb-3">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}><i class="bi bi-arrow-left-square-fill"></i></button>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}><i class="bi bi-arrow-right-square-fill"></i></button>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Notifications