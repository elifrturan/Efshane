import React, { useRef, useState, useEffect } from 'react'
import './Edit.css'
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:3000';

function Edit() {
    const { bookTitle, chapterTitle } = useParams();
    const [successPublishShow, setSuccessPublishShow] = useState(false);
    const [successSaveShow, setSuccessSaveShow] = useState(false);
    const handleSuccessSaveClose = () => setSuccessSaveShow(false);
    const handleSuccessPublishClose = () => setSuccessPublishShow(false);
    const handleSuccessSaveShow = () => setSuccessSaveShow(true);
    const handleSuccessPublishShow = () => setSuccessPublishShow(true);
    const navigate = useNavigate(); 

    useEffect(() => {
    }, [bookTitle, chapterTitle]);
    
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');    
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        const fetchChapterDetails = async () => {
            try {
                const encodedBookTitle = encodeURIComponent(bookTitle);
                const encodedChapterTitle = encodeURIComponent(chapterTitle);

                const url = `http://localhost:3000/chapter/get/${encodedBookTitle}/${encodedChapterTitle}`;
                const response = await axios.get(
                    url,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                const data = response.data;
                setTitle(data.title);
                setImage(data.image);
                setContent(data.content);
            } catch (error) {
                console.error('Chapter bilgileri alınamadı:', error);
            }
        };

        fetchChapterDetails();
    }, [bookTitle, chapterTitle]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imgURL = URL.createObjectURL(file); 
            setImage(imgURL); 
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

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const typeMessage = async (message) => {
        if (contentRef.current) {
            const currentContent = contentRef.current.innerHTML;

            let newContent = ' ';
    
            for (let i = 0; i < message.length; i++) {
                newContent += message[i]; 
                contentRef.current.innerHTML = `${currentContent}${newContent}`;
                await new Promise((resolve) => setTimeout(resolve, 20)); 
            }
        }
    };

    const processResponse = (responseText, currentContent) => {
        if (responseText.startsWith(currentContent)) {
            return responseText.replace(currentContent, ' ').trim();
        }
        return responseText;
    };
    
    const handleSendMessage = async () => {
        const apiUrl = 'http://localhost:3000/openai';

        if (!inputValue.trim()) return;

        setMessages((prevMessages) => [...prevMessages, { text: inputValue, sender: 'user' }]);

        const MAX_TOKENS = 3500;
        const trimmedContent = content.length > MAX_TOKENS 
            ? content.substring(content.length - MAX_TOKENS) 
            : content;

        try {
            const response = await axios.post(
                apiUrl,
                {
                    input: inputValue,
                    content: trimmedContent,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 201) {
                const updatedContent = response.data.updatedContent;
    
                setInputValue('');

                const newContent = processResponse(updatedContent, content);

                await typeMessage(newContent);

                setContent((prevContent) => `${prevContent} ${newContent}`);
            } else {
                console.error('Error:', response.data.error);
            }
        } catch (error) {
            console.error('Request error:', error.message);
        }
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
        const encodedChapterTitle = encodeURIComponent(chapterTitle);
    
        const formData = new FormData();
        formData.append('image', image); 
        formData.append('title', title);
        formData.append('content', content);

        const url = `http://localhost:3000/chapter/save/${encodedTitle}/${encodedChapterTitle}`;
        setLoading(true);
        try {
            const response = await axios.put
            (
                url, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            handleSuccessSaveShow(); 
            navigate(`/addsection/${encodedTitle}`);
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

        const encodedTitle = encodeURIComponent(bookTitle);
        const encodedChapterTitle = encodeURIComponent(chapterTitle);
    
        const formData = new FormData();
        formData.append('image', image); 
        formData.append('title', title);
        formData.append('content', content);

        const url = `http://localhost:3000/chapter/update/publish/${encodedTitle}/${encodedChapterTitle}`;
        setLoading(true);
        try {
            const response = await axios.put(
                url, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            handleSuccessPublishShow(); 
            navigate(`/addsection/${encodedTitle}`);
        } catch (error) {
            console.error(error);
            alert('Bölüm yayınlanırken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='edit-section-page'>
            <Modal show={successPublishShow} onHide={handleSuccessPublishClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Bölüm Yayınlandı!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bölümünüz başarıyla yayınlandı. Tebrikler!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSuccessPublishClose}>
                        Tamam
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={successSaveShow} onHide={handleSuccessSaveClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Bölüm Kaydedildi!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bölümünüz başarıyla kaydedildi. Tebrikler!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSuccessSaveClose}>
                        Tamam
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="edit-fixed-header">
                <div className="edit-header-buttons">
                    <button className="save" onClick={saveChapter} disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                    <button className="publish" onClick={publishChapter} disabled={loading}>
                        {loading ? 'Yayınlanıyor...' : 'Yayınla'}
                    </button>
                </div>
            </div>
            <div className="container">
                {/* Add Image */}
                    <div className='m-0'>
                    <div className="edit-image-upload-area" onClick={triggerFileInput}>
                        <form>
                            <label className="form-label edit-image-upload-label">
                            <img
                                src={
                                    image
                                        ? image?.startsWith('uploads')
                                            ? `${backendBaseUrl}/${image}` 
                                            : image 
                                        : '/default-image.png'
                                }
                                alt="Bölüm Görseli"
                                className="edit-uploaded-image"
                            />
                                <div className="edit-overlay">
                                    <span>Görsel Yükle</span>
                                </div>
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                className="edit-image-upload-input form-control"
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                        </form>
                    </div>
                        <form>
                            {/* Add Title */ }
                            <input 
                                type="text"
                                className='form-control edit-section-title'
                                placeholder='Bir başlık ekleyin...'  
                                value={title}  
                            />
                            <hr />
                            {/* Add Content */ }
                            <div className="edit-content-toolbar">
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
                                className='form-control edit-section-content'
                                contentEditable="true"
                                value={content}
                                onInput={handleContentChange}
                                placeholder='Bölümünüzü buraya yazın...'
                            >
                                {content}
                            </div>
                        </form>
                    </div>
            </div>
            {/* Chatbot modal */}
            <div className={`chat-modal ${isChatOpen ? 'active' : ''}`}>
                <div className="edit-chat-modal-header">
                    <i className="bi bi-chat-left-text"></i> Yardım Al
                    <button className="edit-close-btn" onClick={toggleChat}>&times;</button>
                </div>
                <div className="edit-chat-modal-body" ref={chatBodyRef}>
                    <p>
                        Merhaba! Sana hikayeni yazarken destek olmak için buradayım. 
                        Eğer yazdığın bölümde bir yerde takılı kaldıysan ya da hikayene 
                        nasıl devam edeceğini bilemiyorsan, lütfen aşağıya neye ihtiyacın olduğunu yaz. 
                        İster yeni fikirler ister olay örgüsü önerileri olsun, sana yardımcı olmaktan mutluluk duyarım!
                    </p>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat-message ${message.sender === 'user' ? 'user' : 'bot'}`}
                        >
                            {message.text}
                        </div>
                    ))}
                </div>
                <div className="edit-chat-modal-footer">
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
            <div className="edit-robot">
                <button className='edit-help d-flex justify-content-center align-items-center' onClick={toggleChat}>
                    <img src="/images/efso_logo.svg" alt="" width="180px"/>
                </button>
            </div>
        </div>
    )
}

export default Edit