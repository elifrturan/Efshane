import React, { useEffect, useState } from 'react'
import './Messages.css'
import Navbar from "../../layouts/navbar/Navbar"
import { Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment';
import { Button } from 'react-bootstrap'
import Footer from '../../layouts/footer/Footer'

function Messages() {
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 12;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');  
                if (!token) {
                    console.error("Token bulunamadı!");
                    return;
                }
                const response = await axios.get(`http://localhost:3000/message/inbox`, {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                setMessages(response.data); 
            } catch (error) {
                console.error("Mesajlar alınırken hata oluştu:", error.response?.data || error.message);
            }
        };
        
        fetchMessages();
    }, []);

    const handleHideConversation = async (e, messageId) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token'); 
            if (!token) {
                console.error("Token bulunamadı!");
                return;
            }
            
            const message = messages.find(m => m.id === Number(messageId));
            if (!message) return;
    
            const response = await axios.post(
                `http://localhost:3000/message/hideConversation`,
                { messageId: messageId },
                { headers: { Authorization: `Bearer ${token}` }} 
            );
    
            if (response.data && response.data.message) {
            }
    
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
        } catch (error) {
            console.error("Mesajlar gizlenirken hata oluştu:", error.message);
        }
    };
    
    
    function timeAgo(date) {
        const past = moment(date); 
        const now = moment();
        const diffInSeconds = now.diff(past, 'seconds'); 
    
        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(diffInSeconds / 3600);
        const days = Math.floor(diffInSeconds / 86400);
    
        if (diffInSeconds < 60) {
            return `${diffInSeconds} saniye önce`;
        } else if (minutes < 60) {
            return `${minutes} dakika önce`;
        } else if (hours < 24) {
            return `${hours} saat önce`;
        } else {
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
        <div className="container">
            <h2 className="text-center mt-5 mb-5">Mesajlar</h2>
                <div className="messages-up d-flex justify-content-between align-items-center mb-5">
                    <span className='m-0'>Toplam <b>{messages.length}</b> adet mesaj</span>
                    <Link className='btn-new-message-create d-flex gap-2' to="/newmessage">Yeni Mesaj Oluştur <i className="bi bi-pencil-square"></i></Link>
                </div>
                {currentMessages.map(message => (
                    <div className="message-container">
                        <div className="message" key={message.id}>
                            <div className="d-flex justify-content-between">
                                <Link to={`/messages/${message.otherUsername}`} style={{textDecoration: 'none'}}>
                                    <div className="message-content d-flex align-items-center">
                                        <img src={message.otherImage} alt="" className="rounded-circle" width="60px" height="60px"/>
                                        <div className="ms-3">
                                            <span className='m-0'>
                                                <b>{message.isSender ? "@" + message.otherUsername : " "}</b>
                                                <br />
                                                <b>{message.isSender ? "Siz" : "@" + message.otherUsername}: </b>
                                            </span>
                                            <span style={{ fontWeight: message.isRead ? 'normal' : 'bold' }}>
                                                {message.content.length > 120 
                                                    ? `${message.content.slice(0, 120)}...`
                                                    : message.content}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                                
                                <div className="delete-button d-flex flex-column justify-content-between">
                                    <i 
                                        className="bi bi-trash3-fill" 
                                        onClick={async (e) => {
                                            e.preventDefault(); 
                                            await handleHideConversation(e, message.id)
                                        }}
                                    > </i>
                                    <span className='message-time'>{timeAgo(message.sendDate)}</span>
                                </div>
                            </div>
                        </div>
                    </div>            
                ))}

            {messages.length > 0 && (
                <div className="pagination-messages d-flex justify-content-center mt-5 mb-5">
                    <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        <i className="bi bi-arrow-left-circle"></i>
                    </Button>
                    <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        <i className="bi bi-arrow-right-circle"></i>
                    </Button>
            </div>
            )}
            
        </div>
        <Footer/>
    </div>
    )
}

export default Messages;