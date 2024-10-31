import React, { useEffect, useState } from 'react'
import './Notifications.css'
import Navbar from "../../layouts/navbar/Navbar"
import Footer from "../../layouts/footer/Footer"

function Notifications() {
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 12;

    const [notifications, setNotifications] = useState([
        { 
            id: 1,
            username: "elif",
            image: "/images/woman-pp.jpg",
            bookName: "", 
            title: " yeni bir duyuru yayınladı.",
            subtitle: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi similique delectus officia inventore iusto incidunt! Asperiores tenetur accusantium hic perferendis dolorem explicabo cupiditate necessitatibus ipsum nulla veniam ipsam iure, recusandae in et voluptas unde laboriosam ratione aliquid quae facere eius?",

            sentDate: "2024-10-31 15:30:00"
        },
        { 
            id: 2,
            username: "fatmanurOzcetin",
            image: "/images/woman-pp.jpg",
            bookName: "",  
            title: " yeni bir duyuru yayınladı.",
            subtitle: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam aliquid modi qui recusandae neque quidem magnam deserunt officia, nulla corrupti consectetur similique ad deleniti? In tenetur sequi neque impedit ut.",
            sentDate: "2024-10-30 15:30:00"
        },
        { 
            id: 3,
            username: "elifrTuran",
            image: "/images/woman-pp.jpg",
            bookName: "Yeni Gün",
            episodeName: "1. Bölüm",  
            title: " isimli kitabına ",
            titleEnd: "isimli yeni bir bölüm ekledi",
            subtitle: "",
            sentDate: "2024-10-31 16:08:00"
        },
        { 
            id: 4,
            username: "duduTuran",
            image: "/images/woman-pp.jpg", 
            bookName: "Yeni Sabah",
            title: " isimli kitabına ",
            episodeName: "1. Bölüm",  
            titleEnd: "isimli yeni bir bölüm ekledi",
            subtitle: "",
            sentDate: "2024-10-29 16:08:00"
        },
        { 
            id: 5,
            username: "kevserCakir",
            image: "/images/woman-pp.jpg", 
            title: " yeni bir duyuru yayınladı",
            subtitle: "Bugün hava çok güzel, biraz dışarı çıkıp gezmek istedim.",
            sentDate: "2024-10-31 12:09:00"
        },
        { 
            id: 6,
            username: "deryaCakir",
            image: "/images/woman-pp.jpg", 
            title: " yeni bir duyuru yayınladı",
            subtitle: "Bugün hava çok güzel, biraz dışarı çıkıp gezmek istedim.",
            sentDate: "2024-10-30 12:09:00"
        },
        { 
            id: 7,
            username: "selmaCakir",
            image: "/images/woman-pp.jpg", 
            bookName: "Mutlu Günler",
            episodeName: "1. Bölüm",  
            title: " isimli kitabına ",
            titleEnd: "isimli yeni bir bölüm ekledi",
            subtitle: "",
            sentDate: "2024-08-28 12:09:00"
        },
        { 
            id: 8,
            username: "dudukuzuturan",
            image: "/images/woman-pp.jpg", 
            title: " yeni bir duyuru yayınladı",
            subtitle: "Namazları aksatamayın",
            sentDate: "2024-10-31 16:49:00"
        },
        { 
            id: 9,
            username: "abc",
            image: "/images/woman-pp.jpg", 
            title: " yeni bir duyuru yayınladı",
            subtitle: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem aperiam deleniti quidem neque, corrupti officiis repellendus similique quia suscipit magni saepe praesentium, soluta id in ullam dolor obcaecati numquam ad voluptates perspiciatis, minus dicta iure sunt? Eaque dolorem accusamus iusto, cum esse soluta corrupti ratione?",
            sentDate: "2024-10-31 12:49:00"
        },

        { 
            id: 10,
            username: "acvd",
            image: "/images/woman-pp.jpg", 
            title: " yeni bir duyuru yayınladı",
            subtitle: "lorem ipsum",
            sentDate: "2024-10-31 14:49:00"
        },
        { 
            id: 11,
            username: "merhababenisimsiz",
            image: "/images/woman-pp.jpg", 
            bookName: "İsimsiz",
            episodeName: "1. Bölüm",  
            title: " isimli kitabına ",
            titleEnd: "isimli yeni bir bölüm ekledi",
            subtitle: "",
            sentDate: "2024-10-30 16:49:00"
        },
        { 
            id: 12,
            username: "isimbulamiyorum",
            image: "/images/woman-pp.jpg", 
            title: " yeni bir duyuru yayınladı",
            subtitle: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem aperiam deleniti quidem neque, corrupti officiis repellendus similique quia suscipit magni saepe praesentium, soluta id in ullam dolor obcaecati numquam ad voluptates perspiciatis, minus dicta iure sunt? Eaque dolorem accusamus iusto, cum esse soluta corrupti ratione?",
            sentDate: "2024-04-16 16:49:00"
        },
        { 
            id: 13,
            username: "isimlifatmanur",
            image: "/images/woman-pp.jpg", 
            title: " yeni bir duyuru yayınladı",
            subtitle: "Size bir çarparım görürsünüz.",
            sentDate: "2024-10-31 16:29:00"
        },
        { 
            id: 14,
            username: "abcd",
            image: "/images/woman-pp.jpg", 
            bookName: "ABCDE",
            episodeName: "1. Bölüm",  
            title: " isimli kitabına ",
            titleEnd: "isimli yeni bir bölüm ekledi",
            subtitle: "",
            sentDate: "2024-09-31 16:49:00"
        },
        { 
            id: 15,
            username: "isimlifatmanur",
            image: "/images/woman-pp.jpg", 
            title: " yeni bir duyuru yayınladı",
            subtitle: "Size bir çarparım görürsünüz.",
            sentDate: "2024-10-26 16:29:00"
        },
    ]);

    useEffect(() => {
        window.scrollTo(0,0);
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

    const handleDeleteIcon = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    }

    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));

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
        <Navbar/>
        <div className="container">
            <h2 className='text-center mt-5 mb-5'>Bildirimler</h2>
            <div className="row">
                <p>Toplam <b>{notifications.length}</b> adet bildirim</p>
            </div>
            {currentNotifications.map(notification => (
                <div className="notification d-flex justify-content-between mb-3" key={notification.id}>
                    <div className='d-flex'>
                        <img src={notification.image} alt="" className="rounded-circle" width="60px" height="60px"/>
                        <div className="notification-content d-flex flex-column justify-content-between ms-3">
                            <div className={`notification-title ${notification.subtitle === "" ? "centered-title" : ""}`}>
                               <p><b>@{notification.username}</b> {notification.bookName} {notification.title} {notification.episodeName} {notification.titleEnd}</p>
                            </div>
                            <div className="notification-subtitle">
                                {notification.subtitle.length > 150 
                                    ? `${notification.subtitle.slice(0,150)}...`
                                    : notification.subtitle}
                            </div>
                        </div>
                    </div>
                    <div className="delete-button d-flex flex-column justify-content-between">
                            <i className="bi bi-trash3-fill" onClick={() => handleDeleteIcon(notification.id)}></i>
                            <p className='notification-time m-0 text-end'>{timeAgo(notification.sentDate)}</p>
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