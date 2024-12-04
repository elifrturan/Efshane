import React, { useState } from 'react'
import './Sections.css'
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';

function Sections() {
    const [activeTab, setActiveTab] = useState('sections');
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);
    const [sectionImage, setSectionImage] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [textFile, setTextFile] = useState(null);
    const [audioDurationError, setAudioDurationError] = useState(false);
    const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
    const [fileType, setFileType] = useState(null);
    const [showNewSectionModal, setShowNewSectionModal] = useState(false);

    const handleClose = () => setShowNewSectionModal(false);
    const handleShow = () => setShowNewSectionModal(true);


    const handleFileSelect = (type) => {
        setFileType(type);
    };

    const [sections, setSections] = useState ([
        {
            id: 1,
            sectionName: "1. Bölüm",
            readCount: "1.5K",
            likeCount: "500",
            commentCount: "12",
            onPublished: true,
            duration: 820
        },
        {
            id: 2,
            sectionName: "2. Bölüm",
            readCount: "1.3K",
            likeCount: "430",
            commentCount: "20",
            onPublished: false,
            duration: 900
        }
    ]); 

    const handleToggle = (sectionId) => {
        setIsOpen((prevState) => ({
            ...prevState,
            [sectionId]: !prevState[sectionId],
        }));
    }

    const handleDeleteConfirm = () => {
        setSections(sections.filter((section) => section.id !== sectionToDelete));
        setShowModal(false);
        setSectionToDelete(null);
    };
    
    const handleDeleteCancel = () => {
        setShowModal(false);
        setSectionToDelete(null);
    };

    const handleAction = (action, sectionId) => {
        if (action === "delete") {
            setSectionToDelete(sectionId);
            setShowModal(true);
        } 
    };


    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} dakika ${remainingSeconds.toString().padStart(2, '0')} saniye`;
    }

    const calculateTotalDuration = () => {
        const totalSeconds = sections.reduce((sum, section) => sum + section.duration, 0);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        if (hours > 1){
            return `${hours} saat ${minutes} dakika ${seconds} saniye`
        } else {
            return `${minutes} dakika ${seconds} saniye`
        }
        
    }

    const handleSectionImageUpload = (e) => {
        const file = e.target.files[0];
        setSectionImage(URL.createObjectURL(file));
    };

    const handleAudioUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const audio = new Audio(URL.createObjectURL(file));
            audio.onloadedmetadata = () => {
                const duration = audio.duration / 60;
                if (duration > 20) {
                    setAudioDurationError(true);
                    setAudioFile(null);
                    setAudioPlayerVisible(false);
                    e.target.value = "";
                    setTimeout(() => {
                        setAudioDurationError(false);
                    }, 5000);
                } else {
                    setAudioFile(file);
                    setAudioDurationError(false);
                    setAudioPlayerVisible(true);
                }
            };
        }
    };

    const handleTextFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTextFile(file);
        }
    };

    
  return (
    <>
        {activeTab === 'sections' && (
            <div id="sections" className={`voice-tab-pane ${activeTab === 'sections' ? 'active' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className='fw-bold'>
                        Toplam {sections.length} adet bölüm 
                        <span className='calculateTotal ms-2 fw-light'>({(calculateTotalDuration())})</span>
                    </h6>
                    <button className='add-voice-new-section-btn' onClick={handleShow}>Yeni Bölüm Ekle</button>
                </div>
                <Modal show={showNewSectionModal} onHide={handleClose} className='custom-modal' centered backdrop='static'>
                    <Modal.Header closeButton className='custom-modal-header'>
                        <Modal.Title className='fs-6 text-dark'>Yeni Bölüm Ekle</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Control size="sm" type="text" placeholder="Bir bölüm başlığı girin..." className='modal-section-title mb-4' />
                        </Form>
                        {/* Görsel Yükleme */}
                        {fileType === 'image' && (
                            <div className='add-voice-image'>
                                <Form.Group className='mt-4 mb-4 d-flex flex-column'>
                                    {sectionImage && <img src={sectionImage} className='img-fluid mb-4'  alt="Bölüm Görseli" width="300" height="200"/>}
                                    <Form.Label>Bölüm görselinizi yükleyin</Form.Label>
                                   <Form.Control
                                        type="file"
                                        accept="image/*"
                                        size='sm'
                                        className='opacity-75 image-modal'
                                        onChange={handleSectionImageUpload}
                                    />
                                </Form.Group>
                            </div>
                        )}
                        {/* Ses Dosyası Yükleme */}
                        {fileType === 'audio' && (
                            <div className='add-voice-file'>
                                <Form.Group className='mb-4'>
                                    <Form.Label>Ses dosyanızı yükleyin</Form.Label>
                                    {audioFile && !audioDurationError && audioPlayerVisible && (
                                        <div className="audio-player mb-4">
                                            <audio controls>
                                                <source src={URL.createObjectURL(audioFile)} />
                                                Tarayıcınız yüklediğiniz dosya uzantısını çalıştırmıyor.
                                            </audio>
                                        </div>
                                    )}
                                    <Form.Control
                                        type="file"
                                        accept="audio/*"
                                        size='sm'
                                        className='opacity-75'
                                        onChange={handleAudioUpload}
                                    />
                                </Form.Group>
                            </div>
                        )}
                        {/* Metin Dosyası Yükleme */}
                        {fileType === 'text' && (
                            <div className="add-text-file">
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Metin dosyanızı yükleyin
                                        <span className="text-danger" style={{ fontSize: '0.8rem' }}>
                                            {' '}
                                            (bu dosyanın uzantısı .txt olmalıdır)
                                        </span>
                                    </Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".txt"
                                        size='sm'
                                        className='opacity-75'
                                        onChange={handleTextFileUpload}
                                    />
                                </Form.Group>
                            </div>
                        )}
                        <div className='modal-file-buttons'>
                            <Button variant="outline-secondary" onClick={() => handleFileSelect('image')}>
                                Bölüm Görseli
                            </Button>
                            <Button variant="outline-secondary" onClick={() => handleFileSelect('audio')}>
                                Ses Dosyası
                            </Button>
                            <Button variant="outline-secondary" onClick={() => handleFileSelect('text')}>
                                Metin Dosyası
                            </Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className='btn-modal-save' onClick={handleClose}>
                            Kaydet
                        </Button>
                        <Button variant="primary" className='btn-modal-publish' onClick={handleClose}>
                            Yayınla
                        </Button>
                    </Modal.Footer>
                </Modal>
                {sections.map(section => (
                    <div className="voice-section-row d-flex justify-content-between align-items-center" key={section.id}>
                        <span>{section.sectionName}</span>
                        <div className="voice-istatistic d-flex me-3">
                            <p><i className="bi bi-eye-fill me-1"></i>{section.readCount}</p>
                            <p><i className="bi bi-balloon-heart-fill ms-4 me-1"></i>{section.likeCount}</p>
                            <p><i className="bi bi-chat-heart-fill ms-4 me-1"></i>{section.commentCount}</p>
                        </div>
                        <div className='d-flex justify-content-center align-items-center'>
                            <span className="section-duration me-3">{formatDuration(section.duration)}</span>
                            <Dropdown show={!!isOpen[section.id]} onToggle={() => handleToggle(section.id)}>
                                <span
                                    onClick={() => handleToggle(section.id)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <i className="bi bi-three-dots-vertical"></i>
                                </span>
                                <Dropdown.Menu>
                                    <Dropdown.Item>Düzenle</Dropdown.Item>
                                    {section.onPublished ? (
                                        <Dropdown.Item href=''>Yayından Kaldır</Dropdown.Item>
                                        ) : (
                                        <Dropdown.Item href=''>Yayınla</Dropdown.Item>
                                    )}
                                    <Dropdown.Item href='' onClick={() => handleAction('delete', section.id)}>Sil</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                ))}
            </div>
        )}
        {audioDurationError && (
                <div className="error-message-cover error-message-bottom-left">
                    Maksimum 20 dakika süreli ses dosyası yükleyebilirsiniz.
                </div>
            )}
        { /* Modal */ }
        <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Bölüm Sil</h5>
                        <button 
                        type="button" 
                        className="btn-close" 
                        aria-label="Close" 
                        onClick={handleDeleteCancel}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>Bu bölümü silmek istediğinize emin misiniz?</p>
                    </div>
                    <div className="modal-footer">
                        <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={handleDeleteConfirm}
                        >
                        Sil
                        </button>
                        <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleDeleteCancel}
                        >
                        İptal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Sections