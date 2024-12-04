import React, { useRef, useState, useEffect } from 'react'
import './Edit.css'

function Edit() {
    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');
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

    const sectionContent = [
        {
            id: 1,
            media: "/images/bg4.jpg",
            title: "Bölüm başlığı burada",
            content: "Bugün hava çok güzeldi. Kuşlar cıvıldıyordu. Prenses Elif sarayında çok mutluydu."
        }
    ]

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if(file){
            setImage(URL.createObjectURL(file));
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

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;
    
        const newMessage = { text: inputValue, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    
        const botResponse = { text: 'Bu bir bot cevabıdır.', sender: 'bot' };
        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, botResponse]);
        }, 1000);
    
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

  return (
    <div className='edit-section-page'>
        <div className="edit-fixed-header">
            <div className="edit-header-buttons">
                <button className="save">Kaydet</button>
                <button className="publish">Yayınla</button>
            </div>
        </div>
        <div className="container">
            {/* Add Image */}
            {sectionContent.map((section) => (
                <div className='m-0' key={section.id}>
                    <div className="edit-image-upload-area" onClick={triggerFileInput}>
                        <form>
                            <label className='form-label edit-image-upload-label'>
                                {image ? (
                                    <>
                                        <img src={image} alt="Bölüm Görseli" className='edit-uploaded-image'/>
                                        <div className="edit-overlay">
                                            <span>Görsel Yükle</span>
                                        </div>    
                                    </>
                                ) : (
                                    <img src={section.media} className='edit-uploaded-image'/>
                                )}
                            </label>
                            <input
                                id='file-input' 
                                type="file"
                                className='edit-image-upload-input form-control'
                                onChange={handleImageUpload}
                                onInput={handleInputResize}
                                accept='image/*' />
                        </form>
                    </div>
                    <form>
                        {/* Add Title */ }
                        <input 
                            type="text"
                            className='form-control edit-section-title'
                            placeholder='Bir başlık ekleyin...'  
                            value={section.title}  
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
                            ><i class="bi bi-text-left"></i></button>
                            <button
                                type='button'
                                onClick={() => handleFormat('center')}
                                className={activeStyle.center ? 'active' : ''}
                            ><i class="bi bi-text-center"></i></button>
                            <button
                                type='button'
                                onClick={() => handleFormat('right')}
                                className={activeStyle.right ? 'active' : ''}
                            ><i class="bi bi-text-right"></i></button>
                        </div>
                        <div
                            ref={contentRef} 
                            className='form-control edit-section-content'
                            contentEditable="true"
                            onInput={handleContentChange}
                            placeholder='Bölümünüzü buraya yazın...'
                        >
                            {section.content}
                        </div>
                    </form>
                </div>
            ))}
        </div>
        {/* Chatbot modal */}
        <div className={`chat-modal ${isChatOpen ? 'active' : ''}`}>
            <div className="edit-chat-modal-header">
                <i class="bi bi-chat-left-text"></i> Yardım Al
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
                <i class="bi bi-robot"></i>
            </button>
        </div>
    </div>
  )
}

export default Edit