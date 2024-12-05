import React, { useRef, useState } from 'react'
import './Sections.css'
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';

function Sections() {
    const [activeTab, setActiveTab] = useState('sections');
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const [sectionToDelete, setSectionToDelete] = useState(null);
    const [sectionImage, setSectionImage] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [textFile, setTextFile] = useState(null);
    const [audioDurationError, setAudioDurationError] = useState(false);
    const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
    const [fileType, setFileType] = useState(null);
    const [showNewSectionModal, setShowNewSectionModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioDuration, setAudioDuration] = useState(0);
    const [showNewRecordingButton, setShowNewRecordingButton] = useState(false);
    const intervalIdRef = useRef(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleClose = () => setShowNewSectionModal(false);
    const handleShow = () => setShowNewSectionModal(true);

    const handleInfoClose = () => setShowInfoModal(false);
    const handleInfoShow = () => setShowInfoModal(true);

    const handleEditClose = () => setShowEditModal(false);
    const handleEditShow = () => setShowEditModal(true);


    const handleFileSelect = (type) => {
        setSelectedButton(type);
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

    const handleCancel = () => {
        setFileType(null);
        setSectionImage(null);
        setAudioUrl(null);
        setAudioFile(null);
        setAudioDuration(0);
        setAudioPlayerVisible(false);
        setIsRecording(false);
        setIsPaused(false);
        setShowNewRecordingButton(false);
        setTextFile(null);
        setShowNewRecordingButton(false);
        setSelectedButton(null);
        handleClose();
    }

    const handleEditCancel = () => {
        setFileType(null);
        setSectionImage(null);
        setAudioUrl(null);
        setAudioFile(null);
        setAudioDuration(0);
        setAudioPlayerVisible(false);
        setIsRecording(false);
        setIsPaused(false);
        setShowNewRecordingButton(false);
        setTextFile(null);
        setShowNewRecordingButton(false);
        setSelectedButton(null);
        handleEditClose();
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

    const startRecording = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia( {audio: true})
            .then((stream) => {
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                const chunks = [];
                recorder.ondataavailable = (e) => {
                    chunks.push(e.data);
                }

                recorder.onstop = () => {
                    const audioBlob = new Blob(chunks, { type: 'audio/wav'});
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudioUrl(audioUrl);
                    setAudioChunks(chunks);
                }

                recorder.start();
                setIsRecording(true);
                setIsPaused(false);
                setAudioDuration(0);

                intervalIdRef.current = setInterval(() => {
                    setAudioDuration(prevDuration => {
                        if (prevDuration + 1 >= 1200) { 
                            stopRecording();
                            setIsRecording(false);
                            setIsPaused(false);
                            setShowNewRecordingButton(true);
                        }
                        return prevDuration + 1;
                    });
                }, 1000);
            })
            .catch((error) => {
                console.error("Mikrofon erişim hatası: ", error);
            })
        }
    }

    const pauseRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
            setIsPaused(true);
            setShowNewRecordingButton(true);

            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current)
            }
        }
    }

    const resumeRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
            setIsPaused(false);
            setShowNewRecordingButton(false);

            intervalIdRef.current = setInterval(() => {
                setAudioDuration(prevDuration => prevDuration +1);
            }, 1000);
        }
    }

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
            setIsPaused(false);
            setShowNewRecordingButton(true);
        }

        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
    }

    const startNewRecording = () => {
        stopRecording();
        setAudioUrl(null);
        setAudioChunks([]);
        setShowNewRecordingButton(false);
        startRecording();
        setIsPaused(true);
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
                {/* Add New Section */ }
                <Modal show={showNewSectionModal} onHide={handleClose} className='custom-modal' centered backdrop='static'>
                    <Modal.Header closeButton className='custom-modal-header'>
                        <Modal.Title className='fs-6 text-dark me-2'>Yeni Bölüm Ekle</Modal.Title>
                        <i class="bi bi-question-circle-fill" onClick={handleInfoShow}></i>
                        {/* Info Modal */}
                        <Modal show={showInfoModal} onHide={handleInfoClose} className='voice-help-modal'>
                            <Modal.Header closeButton>
                                <Modal.Title>Bilgilendirme!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Merhaba Sevgili Yazar,<br />
                                Yeni bir bölüm eklemek üzeresiniz! İşte bu süreçte size rehberlik edecek birkaç önemli bilgi:
                                <ul className='mt-2'>
                                    <li>
                                        <b>Bölüm Başlığı: </b>
                                        Bölümünüzü tanımlamak için bir bölüm başlığı girmelisiniz.
                                    </li>
                                    <li>
                                        <b>Bölüm Görseli: </b>
                                        Eğer dilerseniz, bölümünüzü temsil eden bir görsel ekleyebilirsiniz. Bunun için 
                                        <b><i> Bölüm Görseli</i></b> seçeneğine tıklamalısınız.
                                        
                                    </li>
                                    <li>
                                        <b>Ses Dosyası Yükleme/Kaydetme:</b>
                                        <ul>
                                            <li>
                                                Kendi sesinizle bölümü seslendirmek istiyorsanız,
                                                <b><i> Ses Kaydet</i></b> seçeneğine tıklayarak kayda başlayabilirsiniz.
                                            </li>
                                            <li>
                                                Eğer kaydınızı başka bir yerde yaptıysanız, <b><i>Ses Dosyası </i></b>
                                                seçeneğine tıklayarak cihazınızdaki ses dosyasını yükleyebilirsiniz.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <b>Yapay Zeka ile Seslendirme: </b>
                                        Kendi sesinizi kullanmak istemiyorsanız, yapay zeka aracımız sizin 
                                        yerinize bölümü seslendirebilir. Bunun için kitabınızın bölümünü 
                                        içeren bir .txt dosyasını yükleyin ve <b><i>Metin Dosyası </i></b> butonuna tıklayın.

                                    </li>
                                    <li>
                                        <b>Süre Sınırları: </b>
                                        Unutmayın, maksimum <b>20 dakika</b> uzunluğunda bir ses kaydı ekleyebilir 
                                        veya yükleyebilirsiniz. Metin dosyasını yüklerken de bu süre sınırını 
                                        göz önünde bulundurun.
                                    </li>
                                    <li>
                                        <b>Yapay Zeka Destekli İçerik Kontrolü: </b>
                                        Sesli veya metin bölümünüzde küfürlü, argo ya da rahatsız edici 
                                        içerikler bulunup bulunmadığını, yapay zeka destekli kontrol 
                                        sistemimiz denetleyecektir. Eğer bu tür içerikler fazla ise, 
                                        bölümünüzün yayınlanmasına izin verilmeyecek ve size bir uyarı 
                                        e-postası gönderilecektir. Ayrıca, bu tür içerikleri birkaç kez 
                                        tekrar ederseniz, kitabınız yayımdan kaldırılacaktır.
                                    </li>
                                    <li>
                                        <b>Bölümünüzü Kaydetme veya Yayınlama: </b>
                                        Bölümünüzü taslak olarak kaydetmek isterseniz <b><i>Kaydet</i></b> butonuna tıklayın.
                                        Hemen yayınlamak istiyorsanız, <b><i>Yayınla</i></b> butonuna basmanız yeterli.
                                    </li>
                                </ul>
                                Yaratıcılığınızı konuşturun ve okuyucularınıza eşsiz bir deneyim yaşatın! 🎉<br /><br />
                                <b>EFshane Ekibi ✨</b>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={handleInfoClose}>Anladım</Button>
                            </Modal.Footer>
                        </Modal>
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
                        {/* Ses Kayıt Etme */}
                        {fileType === 'save' && (
                            <div className="add-voice-save">
                                <Form.Group className='mb-4'>
                                    <div className='save-voice'>
                                        <div className='save-voice-buttons'>
                                            <Button 
                                                variant={isRecording ? 'danger' : 'primary'} 
                                                onClick={isRecording ? stopRecording : startRecording}
                                                disabled={audioUrl}
                                            >
                                                {!isRecording ? (
                                                    <div className='play-voice d-flex flex-column align-items-center justify-content-center me-2'>
                                                        <i class="bi bi-mic-fill"></i>
                                                        <p>Başlat</p>
                                                    </div>
                                                ) : (
                                                    <div className="stop-voice d-flex flex-column align-items-center justify-content-center me-2">
                                                        <i class="bi bi-stop-fill"></i>
                                                        <p>Bitir</p>
                                                    </div>
                                                )}
                                            </Button>

                                            {isRecording && (
                                                <>
                                                    <Button variant="secondary" onClick={isPaused ? resumeRecording : pauseRecording}>
                                                        {!isPaused ? (
                                                            <div className="pause-voice me-2">
                                                                <i class="bi bi-pause-fill"></i>
                                                                <p>Duraklat</p>
                                                            </div>
                                                        ) : (
                                                            <div className="resume-voice me-2">
                                                                <i class="bi bi-play-fill"></i>
                                                                <p>Devam</p>
                                                            </div>
                                                        )}
                                                    </Button>
                                                </>
                                            )}

                                            {showNewRecordingButton && (
                                                <Button onClick={startNewRecording}>
                                                    <div className='restart-voice'>
                                                        <i className="bi bi-arrow-clockwise"></i>
                                                        <p>Yeni</p>
                                                    </div>
                                                </Button>
                                            )}
                                            <p style={{fontSize: '0.7rem', opacity: '0.9'}} className='mt-1'>Kaydın Süresi: {Math.floor(audioDuration / 60)}:{(audioDuration % 60).toString().padStart(2, '0')}</p>
                                        </div>

                                        {audioUrl && (
                                            <div className='save-voice-player'>
                                                <audio controls>
                                                    <source src={audioUrl} type="audio/wav" />
                                                    Tarayıcınız bu dosya türünü desteklemiyor.
                                                </audio>
                                            </div>
                                        )}
                                    </div>
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
                            <Button variant="outline-secondary" className={selectedButton === 'image' ? 'selected-button' : ''} onClick={() => handleFileSelect('image')}>
                                Bölüm Görseli
                            </Button>
                            <Button variant="outline-secondary" className={selectedButton === 'save' ? 'selected-button' : ''} onClick={() => handleFileSelect('save')}>
                                Ses Kaydet
                            </Button>
                            <Button variant="outline-secondary" className={selectedButton === 'audio' ? 'selected-button' : ''} onClick={() => handleFileSelect('audio')}>
                                Ses Dosyası
                            </Button>
                            <Button variant="outline-secondary" className={selectedButton === 'text' ? 'selected-button' : ''} onClick={() => handleFileSelect('text')}>
                                Metin Dosyası
                            </Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='d-flex justify-content-between'>
                        <Button className='btn-modal-cancel' onClick={handleCancel}>
                            İptal
                        </Button>
                        <div className='d-flex gap-2'>
                            <Button variant="secondary" className='btn-modal-save' onClick={handleClose}>
                                Kaydet
                            </Button>
                            <Button variant="primary" className='btn-modal-publish' onClick={handleClose}>
                                Yayınla
                            </Button>
                        </div>
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
                                    <Dropdown.Item onClick={handleEditShow}>Düzenle</Dropdown.Item>
                                    <Modal show={showEditModal} onHide={handleEditClose} className='edit-modal' centered backdrop='static'>
                                        <Modal.Header closeButton className='edit-modal-header'>
                                            <Modal.Title className='fs-6 text-dark me-2'>Düzenle</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form>
                                                <Form.Control size="sm" type="text" placeholder="Bir bölüm başlığı girin..." className='edit-modal-section-title mb-4' value="1. Bölüm"/>
                                            </Form>
                                            {/* Görsel Yükleme */}
                                            {fileType === 'image' && (
                                                <div className='edit-voice-image'>
                                                    <Form.Group className='mt-4 mb-4 d-flex flex-column'>
                                                        <img src="/images/bg.jpg" className='img-fluid mb-4'  alt="Bölüm Görseli" width="300" height="200"/>
                                                        <Form.Label>Bölüm görselinizi yükleyin</Form.Label>
                                                    <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            size='sm'
                                                            className='opacity-75 edit-image-modal'
                                                            onChange={handleSectionImageUpload}
                                                    />
                                                    </Form.Group>
                                                </div>
                                            )}
                                            {/* Ses Kayıt Etme */}
                                            {fileType === 'save' && (
                                                <div className="edit-voice-save">
                                                    <Form.Group className='mb-4'>
                                                        <div className='edit-save-voice'>
                                                            <div className='edit-save-voice-buttons'>
                                                                <Button 
                                                                    variant={isRecording ? 'danger' : 'primary'} 
                                                                    onClick={isRecording ? stopRecording : startRecording}
                                                                    disabled={audioUrl}
                                                                >
                                                                    {!isRecording ? (
                                                                        <div className='play-voice d-flex flex-column align-items-center justify-content-center me-2'>
                                                                            <i class="bi bi-mic-fill"></i>
                                                                            <p>Başlat</p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="stop-voice d-flex flex-column align-items-center justify-content-center me-2">
                                                                            <i class="bi bi-stop-fill"></i>
                                                                            <p>Bitir</p>
                                                                        </div>
                                                                    )}
                                                                </Button>

                                                                {isRecording && (
                                                                    <>
                                                                        <Button variant="secondary" onClick={isPaused ? resumeRecording : pauseRecording}>
                                                                            {!isPaused ? (
                                                                                <div className="pause-voice me-2">
                                                                                    <i class="bi bi-pause-fill"></i>
                                                                                    <p>Duraklat</p>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="resume-voice me-2">
                                                                                    <i class="bi bi-play-fill"></i>
                                                                                    <p>Devam</p>
                                                                                </div>
                                                                            )}
                                                                        </Button>
                                                                    </>
                                                                )}

                                                                {showNewRecordingButton && (
                                                                    <Button onClick={startNewRecording}>
                                                                        <div className='restart-voice'>
                                                                            <i className="bi bi-arrow-clockwise"></i>
                                                                            <p>Yeni</p>
                                                                        </div>
                                                                    </Button>
                                                                )}
                                                                <p style={{fontSize: '0.7rem', opacity: '0.9'}} className='mt-1'>Kaydın Süresi: {Math.floor(audioDuration / 60)}:{(audioDuration % 60).toString().padStart(2, '0')}</p>
                                                            </div>

                                                            {audioUrl && (
                                                                <div className='edit-save-voice-player'>
                                                                    <audio controls>
                                                                        <source src={audioUrl} type="audio/wav" />
                                                                        Tarayıcınız bu dosya türünü desteklemiyor.
                                                                    </audio>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Form.Group>
                                                </div>
                                            )}
                                            {/* Ses Dosyası Yükleme */}
                                            {fileType === 'audio' && (
                                                <div className='edit-voice-file'>
                                                    <Form.Group className='mb-4'>
                                                        <Form.Label>Ses dosyanızı yükleyin</Form.Label>
                                                        {!audioPlayerVisible && (
                                                            <div className="audio-player mb-4">
                                                                <audio controls>
                                                                    <source src="/voice/deneme-masal.m4a" type='audio/mpeg'/>
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
                                                <div className="edit-text-file">
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
                                            <div className='edit-file-buttons'>
                                                <Button variant="outline-secondary" className={selectedButton === 'image' ? 'selected-button' : ''} onClick={() => handleFileSelect('image')}>
                                                    Bölüm Görseli
                                                </Button>
                                                <Button variant="outline-secondary" className={selectedButton === 'save' ? 'selected-button' : ''} onClick={() => handleFileSelect('save')}>
                                                    Ses Kaydet
                                                </Button>
                                                <Button variant="outline-secondary" className={selectedButton === 'audio' ? 'selected-button' : ''} onClick={() => handleFileSelect('audio')}>
                                                    Ses Dosyası
                                                </Button>
                                                <Button variant="outline-secondary" className={selectedButton === 'text' ? 'selected-button' : ''} onClick={() => handleFileSelect('text')}>
                                                    Metin Dosyası
                                                </Button>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer className='d-flex justify-content-between'>
                                            <Button className='edit-modal-cancel' onClick={handleEditCancel}>
                                                İptal
                                            </Button>
                                            <div className='d-flex gap-2'>
                                                <Button variant="secondary" className='edit-modal-save' onClick={handleClose}>
                                                    Kaydet
                                                </Button>
                                                <Button variant="primary" className='edit-modal-publish' onClick={handleClose}>
                                                    Yayınla
                                                </Button>
                                            </div>
                                        </Modal.Footer>
                                    </Modal>
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
        { /* Delete Modal */ }
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