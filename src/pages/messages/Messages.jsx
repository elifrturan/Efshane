import React, { useEffect, useState } from 'react'
import './Messages.css'
import Navbar from "../../layouts/navbar/Navbar"
import Footer from "../../layouts/footer/Footer"
import { Link } from 'react-router-dom'

function Messages() {
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 12;

    const [messages, setMessages] = useState([
        { id: 1, senderImage: "/images/woman-pp.jpg", senderUsername: "pamukprenses", message: "Naber, görüşmeyeli nasılsın?", sendDate: "2024-10-16 16:49:00"},
        { id: 2, senderImage: "/images/woman-pp.jpg", senderUsername: "zehirlielma", message: "Naber, görüşmeyeli nasılsın?", sendDate: "2024-11-01 10:50:00"},  
    ]);

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    const handleDeleteIcon = (id) => {
        setMessages(messages.filter(message => message.id !== id));
    }

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

    const sortedMessages = [...messages].sort((a, b) => new Date(b.sendDate) - new Date(a.sendDate));

    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = sortedMessages.slice(indexOfFirstMessage, indexOfLastMessage);

    const totalPages = Math.ceil(sortedMessages.length / messagesPerPage);

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
    <div className='messages-page'>
        <Navbar/>
        <div className="container">
            <h2 className="text-center mt-5 mb-5">Mesajlar</h2>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <p className='m-0'>Toplam <b>{messages.length}</b> adet mesaj</p>
                <Link className='btn-new-message-create'>Yeni Mesaj Oluştur <i class="bi bi-pencil-square ms-2"></i></Link>
            </div>
            {currentMessages.map(message => (
                <Link className="message-container" to={`/messages/${message.senderUsername}`}>
                    <div className="message mb-3" key={message.id}>
                        <div className="d-flex justify-content-between">
                            <div className="message-content d-flex align-items-center">
                                <img src={message.senderImage} alt="" className="rounded-circle" width="60px" height="60px"/>
                                <div className="ms-3">
                                    <p className='m-0'><b>@{message.senderUsername}:</b> {message.message.length > 120 
                                        ? `${message.message.slice(0,120)}...`
                                        : message.message}</p>
                                </div>
                            </div>
                            <div className="delete-button d-flex flex-column justify-content-between">
                                <i className="bi bi-trash3-fill" onClick={() => handleDeleteIcon(message.id)}></i>
                                <p className='message-time m-0 text-end'>{timeAgo(message.sendDate)}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            <div className="pagination-messages d-flex justify-content-center mt-3 mb-3">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}><i class="bi bi-arrow-left-square-fill"></i></button>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}><i class="bi bi-arrow-right-square-fill"></i></button>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Messages