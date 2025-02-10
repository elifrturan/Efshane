import React, { useEffect, useRef, useState } from 'react';
import './MessageDetails.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:3000';

function MessageDetails() {
    const { username } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token bulunamadı!");
                return;
            }

            const response = await axios.post(`http://localhost:3000/message/send`, {
                receiverUserName: username,
                content: newMessage,
                date: new Date().toISOString(),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    ...response.data,
                    date: new Date(response.data.sendDate),
                    profileImage: response.data.senderImage,
                    sentByCurrentUser: true,
                }
            ]);

            setNewMessage("");
        } catch (error) {
            console.error("Mesaj gönderilirken hata oluştu:", error.message);
        }
    };

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("Token bulunamadı!");
                    return;
                }
    
                const response = await axios.get(`http://localhost:3000/message/conversation/${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                const updatedMessages = response.data.map((message) => {
                    return {
                        ...message,
                        sentByCurrentUser: message.username !== username,
                    };
                });
    
                setMessages(updatedMessages);
    
                const unreadMessageIds = updatedMessages
                    .filter((msg) => msg.otherUsername !== username && !msg.isRead)
                    .map((msg) => msg.id);
    
                if (unreadMessageIds.length > 0) {
                    await markAsRead(unreadMessageIds);
                }
            } catch (error) {
                console.error("Mesajlar alınırken hata oluştu:", error.message);
            }
        };
    
        const markAsRead = async (messageIds) => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token bulunamadı!");
                return;
            }
    
            try {
                await axios.put(`http://localhost:3000/message/markAsRead`, { messageIds }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
                    )
                );
            } catch (error) {
                console.error("Mesajlar okundu olarak işaretlenirken hata oluştu:", error.message);
            }
        };
        fetchChat(); 
    
    }, [username]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className='message-details-page'>
            <div className='chat-page text-center mt-5 mb-5'>
                <h2>{username} ile Sohbet</h2>

                <div className="chat-messages mt-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message-details ${message.sentByCurrentUser ? 'sent' : 'received'} mb-3`}
                        >
                            <img
                                src={
                                    message?.profileImage
                                        ? message.profileImage.startsWith('uploads')
                                            ? `${backendBaseUrl}/${message.profileImage}`
                                            : message.profileImage
                                        : 'default-book-cover.jpg'
                                }
                                alt={`${message.sentByCurrentUser ? 'Your' : message.otherUsername} profile`}
                                className="profile-pic"
                            />
                            <p className="message-content-details">{message.content}</p>
                            <p className="message-time time-right">
                                {new Date(message.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="message-input mt-3">
                    <input
                        type="text"
                        placeholder="Bir mesaj yaz..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit">Gönder</button>
                </form>
            </div>
        </div>
    );
}

export default MessageDetails;
