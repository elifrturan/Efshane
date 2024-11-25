import React, { useEffect, useRef, useState } from 'react'
import './NewSection.css'

function NewSection() {
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

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isChatOpen]);

  return (
    <div className='new-section-page'>
        <div className="fixed-header">
            <div className="header-buttons">
                <button className="save">Kaydet</button>
                <button className="publish">Yayınla</button>
            </div>
            <button className='help' onClick={toggleChat}>Yardım Al</button>
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
                {/* Add Title */ }
                <input 
                    type="text"
                    className='form-control section-title'
                    placeholder='Bir başlık ekleyin...'    
                />
                <hr />
                {/* Add Content */ }
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
                    className='form-control section-content'
                    contentEditable="true"
                    onInput={handleContentChange}
                    placeholder='Bölümünüzü buraya yazın...'
                >
                </div>
            </form>
        </div>
    </div>
  )
}

export default NewSection