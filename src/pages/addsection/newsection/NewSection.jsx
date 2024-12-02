import React, { useEffect, useRef, useState } from 'react'
import './NewSection.css'
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function NewSection() {
    const location = useLocation();
    const { bookTitle } = location.state || {};

    useEffect(() => {
    }, [bookTitle]);

    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [activeStyle, setActiveStyle] = useState({
        bold: false, 
        italic: false, 
        left: false, 
        center: false, 
        right: false
    });
    const contentRef = useRef();
    const chatBodyRef = useRef(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    }

    const handleContentChange = (e) => {
        setContent(e.target.innerHTML);
    }

    const handleInputResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    const handleFormat = (style) => {
        if (style === 'left') {
            document.execCommand('justifyLeft');
        } else if (style === 'center') {
            document.execCommand('justifyCenter');
        } else if (style === 'right') {
            document.execCommand('justifyRight');
        } else {
            document.execCommand(style);
        }
        updateActiveStyles();
    };

    const updateActiveStyles = () => {
        setActiveStyle({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            left: document.queryCommandState('justifyLeft'),
            center: document.queryCommandState('justifyCenter'),
            right: document.queryCommandState('justifyRight')
        });
    };

    useEffect(() => {
        if (content !== '') {
            updateActiveStyles();
        }
    }, [content]);

    const fetchChatGPTResponse = async (userInput, currentContent) => {
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
    
        const payload = {
            model: 'gpt-3.5-turbo', 
            prompt: [
                { role: 'system', content: 'You are a helpful assistant for creative writing.' },
                { role: 'user', content: `Content so far: ${currentContent}. User input: ${userInput}. Please continue writing.` }
            ],            
            max_tokens: 200, 
            temperature: 0.7 
        };
    
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
    
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
    
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error fetching response from ChatGPT:', error.response?.data || error.message);
    
            return error.response?.data?.error?.message || 'Bir hata oluştu.';
        }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;
        if (loading) return;

        setMessages((prevMessages) => [...prevMessages, { text: inputValue, sender: 'user' }]);
        setLoading(true);

        await delay(1000); 

        try {
            const botResponse = await fetchChatGPTResponse(inputValue, content);
            setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: 'bot' }]);
            setContent((prevContent) => `${prevContent} ${botResponse}`);
        } catch (error) {
            console.error('Error handling bot response:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
        setInputValue('');
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isChatOpen]);

    const saveChapter = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Lütfen başlık ve içerik alanlarını doldurun.');
            return;
        }
        const encodedTitle = encodeURIComponent(bookTitle);
    
        const url = `http://localhost:3000/chapter/${encodedTitle}`;
        const payload = {
            title,
            content,
            image: image || null,
        };
        console.log(payload);
    
        setLoading(true);
        try {
            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('Bölüm kaydedildi!');
            console.log(response.data);
        } catch (error) {
            console.error(error);
            alert('Bölüm kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };
    
    const publishChapter = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Lütfen başlık ve içerik alanlarını doldurun.');
            return;
        }
    
        const url = `http://localhost:3000/chapter/publish/${bookTitle}`;
        const payload = {
            title,
            content,
            image,
        };
    
        setLoading(true);
        try {
            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('Bölüm yayınlandı!');
            console.log(response.data);
        } catch (error) {
            console.error(error);
            alert('Bölüm yayınlanırken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='new-section-page'>
            <div className="fixed-header">
                <div className="header-buttons">
                <button className="save" onClick={saveChapter} disabled={loading}>
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button className="publish" onClick={publishChapter} disabled={loading}>
                    {loading ? 'Yayınlanıyor...' : 'Yayınla'}
                </button>
                </div>
                <button className='help' onClick={() => setIsChatOpen(!isChatOpen)}>Yardım Al</button>
            </div>

            {/* Chatbot modal */}
            <div className={`chat-modal ${isChatOpen ? 'active' : ''}`}>
                <div className="chat-modal-header">Yardım Al</div>
                <div className="chat-modal-body" ref={chatBodyRef}>
                    Merhaba! Sana hikayeni yazarken destek olmak için buradayım. 
                    Eğer yazdığın bölümde bir yerde takılı kaldıysan ya da hikayene 
                    nasıl devam edeceğini bilemiyorsan, lütfen aşağıya neye ihtiyacın olduğunu yaz. 
                    İster yeni fikirler ister olay örgüsü önerileri olsun, sana yardımcı olmaktan mutluluk duyarım!
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat-message ${message.sender === 'user' ? 'user' : 'bot'}`}
                        >
                            {message.text}
                        </div>
                    ))}
                </div>
                <div className="chat-modal-footer">
                    <input
                        type="text"
                        placeholder="Mesajınızı yazın..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleSendMessage}>Gönder</button>
                </div>
            </div>

            <div className="container">
                {/* Add Image */}
                <div className="image-upload-area" onClick={triggerFileInput}>
                    <form>
                        <label className='form-label image-upload-label'>
                            {image ? (
                                <>
                                    <img src={image} alt="Bölüm Görseli" className='uploaded-image'/>
                                    <div className="overlay">
                                        <span>Görsel Yükle</span>
                                    </div>    
                                </>
                            ) : (
                                <span>Görsel Ekleyin</span>
                            )}
                        </label>
                        <input
                            id='file-input' 
                            type="file"
                            className='image-upload-input form-control'
                            onChange={handleImageUpload}
                            onInput={handleInputResize}
                            accept='image/*' />
                    </form>
                </div>
                <form>
                    {/* Add Title */}
                    <input 
                        type="text"
                        className='form-control section-title'
                        placeholder='Bir başlık ekleyin...'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <hr />
                    {/* Add Content */}
                    <div className="content-toolbar">
                        <button
                            type='button'
                            onClick={() => handleFormat('bold')}
                            className={activeStyle.bold ? 'active' : ''}
                        ><b>B</b></button>
                        <button
                            type='button'
                            onClick={() => handleFormat('italic')}
                            className={activeStyle.italic ? 'active' : ''}
                        ><i>I</i></button>
                        <button
                            type='button'
                            onClick={() => handleFormat('underline')}
                            className={activeStyle.underline ? 'active' : ''}
                        ><u>U</u></button>
                        <button
                            type='button'
                            onClick={() => handleFormat('left')}
                            className={activeStyle.left ? 'active' : ''}
                        ><i className="bi bi-text-left"></i></button>
                        <button
                            type='button'
                            onClick={() => handleFormat('center')}
                            className={activeStyle.center ? 'active' : ''}
                        ><i className="bi bi-text-center"></i></button>
                        <button
                            type='button'
                            onClick={() => handleFormat('right')}
                            className={activeStyle.right ? 'active' : ''}
                        ><i className="bi bi-text-right"></i></button>
                    </div>
                    <div
                        ref={contentRef} 
                        className='form-control section-content'
                        contentEditable="true"
                        onInput={handleContentChange}
                        placeholder='Bölümünüzü buraya yazın...'
                    >
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewSection;