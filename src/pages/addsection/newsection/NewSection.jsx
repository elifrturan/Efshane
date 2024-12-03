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
    const [dangerShow, setDangerShow] = useState(false);

    const handleDangerClose = () => setDangerShow(false);

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
                <button className='help' onClick={() => setIsChatOpen(!isChatOpen)}><i class="bi bi-question-circle me-2"></i>Yardım Al</button>
            </div>

            {/* Chatbot modal */}
            <div className={`chat-modal ${isChatOpen ? 'active' : ''}`}>
                <div className="chat-modal-header">Yardım Al</div>
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