import React, { useState } from 'react'
import './AddVoice.css'
import { Button, Dropdown, Form, InputGroup, Modal } from 'react-bootstrap';

function AddVoice() {
    const [image, setImage] = useState('/images/book2.jpeg');
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState('details');
    const [tags, setTags] = useState(["Roman", "Dram", "Gençlik"]);
    const [currentTag, setCurrentTag] = useState("");
    const [tagError, setTagError] = useState("");
    const [showCopyrightAlert, setShowCopyrightAlert] = useState(false);
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
    
    const [bookTitle, setBookTitle] = useState("Oyun Bitti");
    const [bookSummary, setBookSummary] = useState(
        `Bu kitap, hayallerini gerçekleştirmeye çalışan bir genç kızın hikayesini anlatır.`
    );
    const [selectedCategory, setSelectedCategory] = useState("Dram");
    const [selectedAgeRange, setSelectedAgeRange] = useState("13-17");
    const [copyright, setCopyright] = useState("book-own");    

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if(file){
            const img = new Image();
            img.onload = () => {
                if(img.width > 200 || img.height > 281){
                    setError("Görsel boyutu 200x281 pikselden büyük olamaz.");
                    setTimeout(() => {
                        setError("");
                    }, 5000);
                } else {
                    setError("");
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                }
            };
            img.src = URL.createObjectURL(file);            
        }    
    }

    const handleAddTag = () => {
        if(currentTag && !tags.includes(currentTag)){
            if(tags.length < 8){
                setTags([...tags, currentTag]);
                setCurrentTag("");
                setTagError("");
            }
            else{
                setTagError("Maksimum 8 adet etiket ekleyebilirsiniz.");
                setTimeout(() => {
                    setTagError("");
                }, 5000);
            }
        }
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            handleAddTag();
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    }

    const handleContentChoiceChange = (e) => {
        const selectedValue = e.target.value;
        setCopyright(selectedValue);
        if (selectedValue === "book-own") {
            setShowCopyrightAlert(true);
        } else {
            setShowCopyrightAlert(false);
        }
    }

    const handleAction = (action, sectionId) => {
        if (action === "delete") {
            setSectionToDelete(sectionId);
            setShowModal(true);
        } 
    };

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
    <div className="add-voice-section-page">
        <div className="container">
            <h2 className='text-center mt-5 mb-5'>Sesli Kitap Detay Sayfasına Hoş Geldiniz</h2>
            <div className="add-voice-section-main">
                <div className="add-voice-section-left">
                    {image ? (
                        <img src={image} alt="uploaded" width="200px" height="281px" />
                    ) : (
                        <img src="/images/upload-image.svg" alt="upload-image" width="200px" height="281px" />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
                    <button onClick={() => document.getElementById('image-upload').click()}>Görsel Yükle <i class="bi bi-cloud-arrow-up-fill ms-1"></i></button>
                    {error && <p className='error-message-cover'>{error}</p>}
                    <i className='voice-left-description'>
                        Kitabınız kapağını değiştirmek istiyorsanız
                        görsel yükle butonuna tıklamanız yeterli olacaktır.
                    </i>
                </div>
                <div className="add-voice-section-right">
                    {/* Tabs */}
                    <div className="voice-tabs">
                        <button
                            className={`voice-tab-button ${activeTab === 'details' ? 'active' : ''}`}
                            onClick={() => handleTabClick('details')}
                        >
                        Detay
                        </button>
                        <button
                            className={`voice-tab-button ${activeTab === 'sections' ? 'active' : ''}`}
                            onClick={() => handleTabClick('sections')}
                        >
                            Bölümler
                        </button>
                    </div>
                    {/* Content */}
                    <div className="voice-tab-content">
                        {/* Details */}
                        {activeTab === 'details' && (
                            <div id="details" className={`voice-tab-pane ${activeTab === 'details' ? 'active' : ''}`}>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Kitap Adı</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            value={bookTitle}
                                            onChange={(e) => setBookTitle(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Kitap Özeti</Form.Label>
                                        <Form.Control 
                                            className='bg-transparent' 
                                            as="textarea" 
                                            rows={4}
                                            value={bookSummary}
                                            onChange={(e) => setBookSummary(e.target.value)}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Kategori</Form.Label>
                                        <Form.Select 
                                            size='sm' 
                                            className='form-select-create bg-transparent'
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                        >
                                            <option selected>Kategori Seçiniz...</option>
                                            <option value="Romantik">Romantik</option>
                                            <option value="Korku">Korku</option>
                                            <option value="Mizah">Mizah</option>
                                            <option value="Tarih">Tarih</option>
                                            <option value="Bilim Kurgu">Bilim Kurgu</option>
                                            <option value="Fantastik">Fantastik</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Etiketler</Form.Label>
                                        <div className="tags-container">
                                            {tags.map((tag, index) => (
                                                <div className="tag-item" key={index}>
                                                    <span className="tag-text">{tag}</span>
                                                    <span className="remove-tag" onClick={() => handleRemoveTag(tag)}>x</span>
                                                </div>
                                            ))}
                                        </div>
                                        <InputGroup>
                                            <Form.Control
                                                className='bg-transparent'
                                                placeholder='Etiket ekleyiniz...'
                                                value={currentTag}
                                                onChange={(e) => setCurrentTag(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <span 
                                                className='input-group-text span-plus' 
                                                onClick={handleAddTag}>+</span>
                                        </InputGroup>
                                        
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Yaş Aralığı</Form.Label>
                                        <Form.Select
                                            size='sm' 
                                            className='form-select-create bg-transparent'
                                            value={selectedAgeRange}
                                            onChange={(e) => setSelectedAgeRange(e.target.value)}
                                        >
                                            <option selected>Yaş Aralığı Seçiniz...</option>
                                            <option value="0-12">0-12 Yaş</option>
                                            <option value="13-17">13-17 Yaş</option>
                                            <option value="18-35">18-35 Yaş</option>
                                            <option value="35+">35+ Yaş</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Telif Hakkı</Form.Label>
                                        <Form.Select 
                                            size='sm' 
                                            className='form-select-create bg-transparent'
                                            value={copyright}
                                            onChange={handleContentChoiceChange}
                                        >
                                            <option value="book-own">© Kitabın içeriği tamamen bana aittir. Hiçbir dış kaynaktan alıntı yapılmamıştır.</option>
                                            <option value="book-own-quotes">Kitap içeriği bana aittir, ancak bazı bölümler başka bir kaynaktan alıntı yapılmıştır. Alıntı yapılan kaynaklara gerekli atıflar yapılmıştır.</option>
                                            <option value="book-copied-permission">Kitap içeriği başkalarından kopyalanmıştır, ancak kopyalanan içerikler için gerekli izinler alınmıştır.</option>
                                            <option value="book-public-source">Kitap içeriği tamamen bana aittir, ancak bazı kısımlar kamuya açık kaynaklardan alınmış ve kaynakları belirtilmiştir.</option>
                                            <option value="book-others-wrote">Kitap içeriği başka bir yazar tarafından yazılmıştır, ancak kullanmak için gerekli izinler alınmıştır.</option>
                                        </Form.Select>
                                    </Form.Group>
                                    {showCopyrightAlert && copyright === "book-own" && (
                                        <div className="alert alert-danger d-flex align-items-start" role="alert">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            <div>
                                                "Kitabın içeriği tamamen bana aittir. 
                                                Hiçbir dış kaynaktan alıntı yapılmamıştır." 
                                                seçeneğini seçmiş olmanız durumunda, kitabınızın içeriği 
                                                ile ilgili tüm sorumluluk size aittir. Herhangi bir telif hakkı 
                                                ihlali veya yasal yükümlülük durumunda sorumluluk tamamen 
                                                size ait olacaktır.
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-5 mt-4 d-flex justify-content-center">
                                        <Button className='add-voice-section-btn' type='submit'>Kaydet</Button>
                                    </div>
                                </Form>
                            </div>
                        )}
                        { /* Sections */ }
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
                    </div>
                </div>
            </div>
        </div>
        {/* Errors */}
        {tagError && (
            <div className="error-message-cover error-message-bottom-left">
                {tagError}
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
    </div>
  )
}

export default AddVoice