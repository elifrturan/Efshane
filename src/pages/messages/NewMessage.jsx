import React, { useState, useEffect } from 'react';
import './NewMessage.css';
import Navbar from "../../layouts/navbar/Navbar";
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function NewMessage() {
    const [username, setUsername] = useState(''); 
    const [messageContent, setMessageContent] = useState('');
    const navigate = useNavigate(); 

    const handleSendMessage = async (e) => {
        e.preventDefault(); 

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token bulunamadı!");
                return;
            }

            const response = await axios.post(`http://localhost:3000/message/send`, {
                receiverUserName: username,
                content: messageContent,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            navigate("/messages"); 
        } catch (error) {
            console.error("Mesaj gönderilirken hata oluştu:", error.response?.data || error.message);
        }
    };

    return (
        <div className='new-message-page'>
            <div className="container">
                <div className="new-message-container mt-5 mb-5">
                    <h2 className='text-center mt-3 mb-2'>Yeni Mesaj Oluştur</h2>
                    <p className='text-center opacity-50 new-message-description'><i>Kullanıcı adını girerek, istediğiniz mesajı dilediğiniz kişiye kolayca gönderebilirsiniz.</i></p>
                    <form onSubmit={handleSendMessage}>
                        <div className="input-group mb-3">
                            <span className='input-group-text'>@</span>
                            <input 
                                type="text" 
                                className='form-control' 
                                placeholder='Kullanıcı Adı' 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>
                        <div className="input-group mb-3 d-flex flex-column">
                            <label className='form-label'>Mesajınız</label>
                            <textarea 
                                className='form-control w-100' 
                                rows="6" 
                                placeholder='Lütfen mesaj içeriğinizi giriniz...' 
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)} 
                            ></textarea>
                        </div>
                        <div className="mb-3 d-flex justify-content-center">
                            <button type="submit" className="btn-new-message-send">Gönder</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NewMessage;
