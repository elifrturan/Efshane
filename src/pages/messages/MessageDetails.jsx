import React, { useEffect, useRef, useState } from 'react';
import './MessageDetails.css';
import Navbar from "../../layouts/navbar/Navbar";
import { useParams } from 'react-router-dom';

function MessageDetails() {
    const { username } = useParams();
    const [messages, setMessages] = useState([
        { id: 1, senderImage: "/images/woman-pp.jpg", sender: username, content: "Naber, görüşmeyeli nasılsın?", sentByCurrentUser: false, sendDate: "2024-10-16 16:49:00"  },
        { id: 2, receiverImage: "/images/pp.jpg", sender: "currentUser", content: "Merhaba! İyiyim, teşekkürler. Sen nasılsın?", sentByCurrentUser: true, sendDate: new Date().toISOString() },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;

        const newMsg = { id: messages.length + 1, receiverImage: "/images/pp.jpg", sender: "currentUser", content: newMessage, sentByCurrentUser: true, sendDate: new Date().toISOString() };
        setMessages([...messages, newMsg]);
        setNewMessage("");
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    return (
        <div className='message-details-page'>
            <Navbar />
            <div className='chat-page text-center mt-5 mb-5'>
                <h2>{username} ile Sohbet</h2>

                <div className="chat-messages mt-4">
                    {messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={`message-details ${message.sentByCurrentUser ? 'sent' : 'received'}`}
                        >
                            {!message.sentByCurrentUser && (
                                <img src={message.senderImage} alt={`${username} profile`} className="profile-pic" />
                            )}
                            <p className="message-content-details">{message.content}</p>
                            <p className={`message-time ${message.sentByCurrentUser ? 'time-left' : 'time-right'}`}>
                                {new Date(message.sendDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {message.sentByCurrentUser && (
                                <img src={message.receiverImage} alt="Your profile" className="profile-pic" />
                            )}
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
