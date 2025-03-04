import React, { useState, useEffect } from 'react';
import './NewMessage.css';
import Navbar from "../../layouts/navbar/Navbar";
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { Form, InputGroup } from 'react-bootstrap';

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
                    <span className='text-center new-message-description'><span>Kullanıcı adını girerek, istediğiniz mesajı dilediğiniz kişiye kolayca gönderebilirsiniz.</span></span>
                    <Form onSubmit={handleSendMessage} className='d-flex flex-column gap-3 mt-4'>
                        <InputGroup>
                            <InputGroup.Text>@</InputGroup.Text>
                            <Form.Control 
                                type="text" 
                                placeholder='Kullanıcı Adı' 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </InputGroup>
                        <Form.Group>
                            <Form.Label>Mesajınız</Form.Label>
                            <Form.Control
                                as='textarea' 
                                rows="6" 
                                placeholder='Lütfen mesaj içeriğinizi giriniz...' 
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)} 
                            ></Form.Control>
                        </Form.Group>
                        <div className="btn-new-message-send">
                            <button type="submit" className="btn-new-message-send">Gönder</button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default NewMessage;
