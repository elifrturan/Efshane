import React, { useEffect, useRef, useState } from 'react'
import './NewSection.css'
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:3000';

function NewSection() {
    const { bookTitle: encodedBookTitle } = useParams();
    const [successPublishShow, setSuccessPublishShow] = useState(false);
    const [successSaveShow, setSuccessSaveShow] = useState(false);
    const handleSuccessSaveShow = () => setSuccessSaveShow(true);
    const handleSuccessPublishShow = () => setSuccessPublishShow(true);
    const [showAlert, setShowAlert] = useState(false);
    const handleCloseAlert = () => setShowAlert(false);

    const handleSuccessSaveClose = () => {
        setSuccessSaveShow(false);
        navigate(`/addsection/${encodedBookTitle}`);
    };

    const handleSuccessPublishClose = () => {
        setSuccessPublishShow(false);
        navigate(`/addsection/${encodedBookTitle}`);
    };

    const navigate = useNavigate(); 

    useEffect(() => {
    }, [encodedBookTitle]);

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
    const [dangerShow, setDangerShow] = useState(false);

    const [updatedContent, setUpdatedContent] = useState('');  
    const [showButtons, setShowButtons] = useState(false); 

    const handleDangerClose = () => setDangerShow(false);

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
                setUpdatedContent(updatedContent);
    
                setInputValue('');

                const newContent = processResponse(updatedContent, content);

                await typeMessage(newContent);

                setContent((prevContent) => `${prevContent} ${newContent}`);
                setShowButtons(true);
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
            e.preventDefault(); 
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isChatOpen]);

    useEffect(() => {
        setDangerShow(true);
    }, []);

    const saveChapter = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Lütfen başlık ve içerik alanlarını doldurun.');
            return;
        }
        const encodedTitle = encodeURIComponent(encodedBookTitle);
    
        const formData = new FormData();
        formData.append('image', image); 
        formData.append('title', title);
        formData.append('content', content);

        const url = `http://localhost:3000/chapter/${encodedTitle}`;
        setLoading(true);
        try {
            const response = await axios.post(
                url, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
            handleSuccessSaveShow(); 
        } catch (error) {
            console.error(error);
            alert('Bölüm kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const analyzeContent = async (content) => {
        try {
            const response = await axios.post('https://f6bb-34-30-41-4.ngrok-free.app/analyze', { text: content });
            return response.data.is_offensive === 0;
        } catch (error) {
            console.error('Content analysis failed:', error.message);
            return false;
        }
    };
    
    const publishChapter = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Lütfen başlık ve içerik alanlarını doldurun.');
            return;
        }
    
        const formData = new FormData();
        formData.append('image', image);
        formData.append('title', title);
        formData.append('content', content);

        const url = `http://localhost:3000/chapter/publish/${encodedBookTitle}`;
        setLoading(true);
        try {
            const response = await axios.post(
                url,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.status === 201) {
                handleSuccessPublishShow(); 
            } else {
                console.error('Yayınlama hatası:', response.data.error);
                alert('Bölüm yayınlanırken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data?.message || 'Bilinmeyen bir hata oluştu.';
                if (error.response.status === 400 && errorMessage.includes('Content contains offensive language')) {
                    setShowAlert(true); 
                } else {
                    alert(`Hata: ${errorMessage}`);
                }
            } else if (error.request) {
                alert('Sunucudan yanıt alınamadı. Lütfen bağlantınızı kontrol edin.');
            } else {
                alert(`Bir hata oluştu: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='new-section-page'>
            <Modal
                show={showAlert}
                onHide={handleCloseAlert}
                centered
                backdrop="static"
                className="danger-alert-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: 'red' }}>Uygunsuz İçerik Uyarısı</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>İçerik uygunsuz kelimeler içeriyor. Lütfen içeriği düzeltin ve tekrar deneyin.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseAlert}>
                        Kapat
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
            <Modal show={dangerShow} onHide={handleDangerClose} className='danger-modal' centered backdrop='static'>
                <Modal.Header closeButton>
                    <Modal.Title>İlham Yolculuğunda Yalnız Değilsin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Her yaratıcı yolculukta bazen mola vermek gerekebilir. <br /><br />İlhamın azaldığını hissettiğinde, 
                    yalnız olmadığını unutma! <br /><br /> <b>'Yardım Al'</b>  butonuna tıklayarak sana özel ipuçları ve desteklerle 
                    yeniden yola koyulabilirsin. Amacımız, ilhamını koruyarak hayallerine ulaşmana yardımcı olmak. 
                    <br /><br />Seni ve yaratıcılığını önemsiyoruz; ilhamın hep seninle olsun! <br /><br />
                    <b>EFshane Ekibi ✨</b>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDangerClose}>
                        Anladım
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="fixed-header">
                <div className="header-buttons">
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
                <div className="image-upload-area" onClick={triggerFileInput}>
                    <Form>
                        <Form.Label className='image-upload-label'>
                            {image ? (
                                <>
                                    <img 
                                        src=
                                        {
                                            image.startsWith('uploads')
                                                ? `${backendBaseUrl}/${image}`
                                                : image
                                        }
                                        alt="Bölüm Görseli" 
                                        className='uploaded-image'
                                    />
                                    <div className="overlay">
                                        <span>Görsel Yükle</span>
                                    </div>    
                                </>
                            ) : (
                                <span>Görsel Ekleyin</span>
                            )}
                        </Form.Label>
                        <Form.Control
                            id='file-input' 
                            type="file"
                            className='image-upload-input'
                            onChange={handleImageUpload}
                            onInput={handleInputResize}
                            accept='image/*' />
                    </Form>
                </div>
                <Form>
                    {/* Add Title */}
                    <Form.Control 
                        type="text"
                        className='section-title'
                        placeholder='Bir başlık ekleyin...'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <hr />
                    {/* Add Content */}
                    <div className="content-toolbar">
                        <Button
                            onClick={() => handleFormat('bold')}
                            className={activeStyle.bold ? 'active' : ''}
                        ><b>B</b></Button>
                        <Button
                            onClick={() => handleFormat('italic')}
                            className={activeStyle.italic ? 'active' : ''}
                        ><i>I</i></Button>
                        <Button
                            onClick={() => handleFormat('underline')}
                            className={activeStyle.underline ? 'active' : ''}
                        ><u>U</u></Button>
                        <Button
                            onClick={() => handleFormat('left')}
                            className={activeStyle.left ? 'active' : ''}
                        ><i className="bi bi-text-left"></i></Button>
                        <Button
                            onClick={() => handleFormat('center')}
                            className={activeStyle.center ? 'active' : ''}
                        ><i className="bi bi-text-center"></i></Button>
                        <Button
                            onClick={() => handleFormat('right')}
                            className={activeStyle.right ? 'active' : ''}
                        ><i className="bi bi-text-right"></i></Button>
                    </div>
                    <div
                        ref={contentRef} 
                        className='form-control section-content'
                        contentEditable="true"
                        onInput={handleContentChange}
                        placeholder='Bölümünüzü buraya yazın...'
                    >
                    </div>
                </Form>
            </div>
            {/* Chatbot modal */}
            <div className={`chat-modal ${isChatOpen ? 'active' : ''}`}>
                <div className="chat-modal-header">
                    <i className="bi bi-chat-left-text"></i> Yardım Al
                    <button className="close-btn" onClick={toggleChat}>&times;</button>
                </div>
                <div className="chat-modal-body" ref={chatBodyRef}>
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
            <div className="robot">
                <button className='help d-flex justify-content-center align-items-center' onClick={toggleChat}>
                    <img src="/images/efso_logo.svg" alt="" width="180px"/>
                </button>
            </div>
        </div>
    );
}

export default NewSection;