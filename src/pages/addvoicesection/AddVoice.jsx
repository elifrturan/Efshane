import React, { useEffect, useRef, useState } from 'react'
import './AddVoice.css'
import { Button, Dropdown, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from 'react-feather';
import axios from 'axios';

const backendBaseUrl = 'http://localhost:3000';

function AddVoice() {
    const [activeTab, setActiveTab] = useState('details');
    const { bookTitle: encodedAudioBookTitle } = useParams();
    const [bookTags, setTags] = useState([]); 
    const [bookContentChoice, setContentChoice] = useState(""); //kitabın ait olduğu haklar
    const [title, setBookTitle] = useState(""); //kitaba ait başlık
    const [summary, setBookSummary] = useState(""); //kitaba ait özet
    const [bookCategory, setSelectedCategory] = useState(""); //kitabın ait olduğu category
    const [ageRange, setSelectedAgeRange] = useState(""); //kitabın ait olduğu yaş aralığı
    const [currentTag, setCurrentTag] = useState("");
    const [tagError, setTagError] = useState("");
    const [showCopyrightAlert, setShowCopyrightAlert] = useState(false);
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [ageRanges, setAgeRange] = useState([]); 
    const [copyrightStatuses, setCopyrightStatuses] = useState([]);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [textFile, setTextFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageFilePath, setImageFilePath] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [sectionTitle, setSectionTitle] = useState(""); //kitaba ait başlık
    const [selectedButton, setSelectedButton] = useState(null);
    const [sectionToDelete, setSectionToDelete] = useState(null);
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
    const [sections, setSections] = useState ([]); 
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const handleSuccessModalClose = () => setShowSuccessModal(false);
    const handleInfoClose = () => setShowInfoModal(false);
    const handleInfoShow = () => setShowInfoModal(true);

    const handleEditClose = () => setShowEditModal(false);
    const handleEditShow = () => setShowEditModal(true);
    const [showToast, setShowToast] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'; 
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'; 
        }
        return num.toString(); 
    };

    const handleAction = (action, sectionId) => {
        if (action === "delete") {
            setSectionToDelete(sectionId);
            setShowModal(true);
        } else if (action === "edit") {
            const section = sections.find((sec) => sec.id === sectionId);
        }
    };

    const handleDeleteCancel = () => {
        setShowModal(false);
        setSectionToDelete(null);
    };

    //yeni bölüm ekle kısmı için ama pop-up
    const handleNewSectionButtonClick = () => {
        console.log("yeni bölüm eklemek istersen");
    }

    const [bookImage, setImage] = useState("");
    const [error, setError] = useState("");

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = async () => {
                setImage(file);
            };
            img.src = URL.createObjectURL(file);
        }
    };
    
    useEffect(() => {
        const fetchAudioBookDetails = async () => {
            try {
                const encodeAudioBookTitle = encodeURIComponent(encodedAudioBookTitle);
                
                const response = await axios.get(
                    `http://localhost:3000/audio-book/${encodeAudioBookTitle}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );    
                const data = response.data;
                
                setBookTitle(data.title); 
                setBookSummary(data.summary);
                setImage(data.bookCover);
                setSelectedCategory(data.category && data.category[0]?.categoryId);
                setSelectedAgeRange(data.ageRange && data.ageRange[0]?.rangeId );
                setContentChoice(data.bookCopyright && data.bookCopyright[0]?.bookCopyrightId);
                setTags(data.hashtags ? data.hashtags.map(tag => tag.hashtag.name) : []);
                
            } catch (error) {
                console.error('Kitap bilgilerini çekerken hata oluştu:', error);
            }
        };
    
        fetchAudioBookDetails();
    }, [encodedAudioBookTitle]); 

    const handleAddTag = () => {
        if(currentTag && !bookTags.includes(currentTag)){
            if(bookTags.length < 8){
                setTags([...bookTags, currentTag]);
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/categories');
                if (Array.isArray(response.data)) {
                    setCategory(response.data); 
                } else {
                    console.error('Kategori verisi beklenmeyen formatta:', response.data);
                    setCategory([]); 
                }
            } catch (error) {
                console.error('Kategorileri çekerken hata oluştu:', error);
                setCategory([]);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    useEffect(() => {
        const fetchAgeRanges = async () => {
            try {
                const response = await axios.get('http://localhost:3000/audio-book/get/ageRange');
                if (response.data) {
                    setAgeRange(response.data);
                }
            } catch (error) {
                console.error('Yaş aralıklarını çekerken hata oluştu:', error);
            }
        };
        fetchAgeRanges();
    }, []);

    const handleRangeChange = (e) => {
        setSelectedAgeRange(e.target.value);
    };
    
    useEffect(() => {
        axios.get('http://localhost:3000/audio-book/get/copyright')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setCopyrightStatuses(response.data);
                } else {
                    console.error("Beklenmeyen veri formatı:", response.data);
                }
            })
            .catch(error => {
                console.error('Veri alırken hata oluştu:', error);
            });
    }, []); 

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
            title: title.trim(),
            summary: summary.trim(),
            bookCover: typeof bookImage === 'string' ? bookImage : null,
            categories: String(bookCategory || ''),
            ageRange: String(ageRange || ''),
            bookCopyright: String(bookContentChoice || ''),
            hashtags: Array.isArray(bookTags) ? bookTags.map(tag => String(tag)) : [],
        };
    
    
        try {
            const response = await axios.put(
                `http://localhost:3000/audio-book/${encodedAudioBookTitle}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
    
            const updatedData = response.data;
    
            setBookTitle(updatedData.title);
            setBookSummary(updatedData.summary);
            setImage(updatedData.bookCover || '');
            setSelectedCategory(updatedData.categories);
            setSelectedAgeRange(
                updatedData.ageRange && updatedData.ageRange.length > 0 ? updatedData.ageRange[0].rangeId : ''
            );
            setContentChoice(
                updatedData.bookCopyright && updatedData.bookCopyright.length > 0
                    ? updatedData.bookCopyright[0].bookCopyrightId
                    : ''
            );
            setTags(updatedData.hashtags ? updatedData.hashtags.map(tag => tag.hashtag.name) : []);
    
            setShowSuccessAlert(true);
            setShowErrorAlert(false);
            setTimeout(() => setShowSuccessAlert(false), 3000);
        } catch (error) {
            console.error("Güncelleme Hatası:", error.response?.data || error.message);
    
            setShowErrorAlert(true);
            setShowSuccessAlert(false);
        }
    };

    useEffect(() => {
        const fetchSections = async () => {
            if (activeTab === "sections") {
                try {
                    const response = await axios.get(
                        `http://localhost:3000/episode/${encodedAudioBookTitle}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );

                    if (Array.isArray(response.data.episodes)) {
                        setSections(response.data.episodes);
                    } else {
                        console.error("Beklenmeyen veri formatı:", response.data);
                        setSections([]); 
                    }
                } catch (error) {
                    console.error("API çağrısı sırasında hata oluştu:", error);
                    setSections([]); 
                }
            }
        };            
        fetchSections();
    }, [activeTab]);

    const formatTitleForUrl = (title) => {
        const charMap = {
            'ç': 'c',
            'ğ': 'g',
            'ı': 'i',
            'ö': 'o',
            'ş': 's',
            'ü': 'u',
            'Ç': 'c',
            'Ğ': 'g',
            'İ': 'i',
            'Ö': 'o',
            'Ş': 's',
            'Ü': 'u',
        };
        
        const sanitizedTitle = title
            .split('') 
            .map(char => charMap[char] || char)
            .join('');
        
        return sanitizedTitle
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') 
            .replace(/\s+/g, '-'); 
    };  

    const handleClose = () => setShowNewSectionModal(false);

    const handleShow = () => {
        setBookTitle("");
        setShowNewSectionModal(true);
    };

    const handleFileSelect = (type) => {
        setSelectedButton(type);
        setFileType(type);
    };

    const handleToggle = (sectionId) => {
        setIsOpen((prevState) => ({
            ...prevState,
            [sectionId]: !prevState[sectionId],
        }));
    }

    const handleSectionAction = (action, sectionId) => {
        if (action === "delete") {
            setSectionToDelete(sectionId);
            setShowModal(true);
        } 
    };

    const togglePublish = async (sectionId, episodeTitle) => {
        try {
            const encodedAudioBookTitle = encodeURIComponent(title);
            const encodedEpisodeTitle = encodeURIComponent(episodeTitle);
    
            const url = `http://localhost:3000/episode/toggle/${encodedAudioBookTitle}/${encodedEpisodeTitle}`;
            const response = await axios.put(
                url,
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            const updatedEpisode = response.data;
    
            setSections((prevSections) =>
                prevSections.map((section) =>
                    section.id === sectionId
                        ? { ...section, publish: updatedEpisode.publish }
                        : section
                )
            );

            if(!updatedEpisode.publish) {
                setIsSuccess(false);
            } else {
                setIsSuccess(true);
                setTimeout(() => setShowToast(false), 4000);
            }
    
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000); 
        } catch (error) {
            console.error('Yayın durumu değiştirilirken hata oluştu:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };    

    const handleSectionDeleteCancel = () => {
        setShowModal(false);
        setSectionToDelete(null);
    };

    useEffect(() => {
        if (encodedAudioBookTitle) {
            setBookTitle(decodeURIComponent(encodedAudioBookTitle));
        }
    }, [encodedAudioBookTitle]);
    
    const handleDeleteConfirm = async () => {
        if (!title || !sectionToDelete || !sectionToDelete.title) {
            console.error("Eksik bilgi nedeniyle silme işlemi başarısız!");
            alert("Eksik bilgi nedeniyle silme işlemi yapılamıyor.");
            return;
        }
    
        try {
            const encodedTitle = encodeURIComponent(title);
            const formattedAudioBookTitle = formatTitleForUrl(sectionToDelete.title);
            const url = `http://localhost:3000/episode/${encodedTitle}/${formattedAudioBookTitle}`;
    
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            setSections(sections.filter((section) => section.id !== sectionToDelete.id));
            setShowModal(false);
            setSectionToDelete(null);    
        } catch (error) {
            console.error("Hata detayları:", error.response || error.message);
            alert("Bölüm silinirken bir hata oluştu.");
        }
    };    

    const handleBookSection = (sectionId) => {
        const section = sections.find((sec) => sec.id === sectionId);
        if (section && section.title) {
            const chapterTitlee = section.title;
            const formattedSectionName = formatTitleForUrl(chapterTitlee); 
            const formattedAudioBookTitle = formatTitleForUrl(encodedAudioBookTitle);
        } else {
            console.error("Section or sectionName is undefined:", section);
        }
    };  

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} dakika ${remainingSeconds.toString().padStart(2, '0')} saniye`;
    }

    const calculateTotalDuration = () => {
        if (!Array.isArray(sections) || sections.length === 0) {
            return "0 dakika 0 saniye"; 
        }
        const totalSeconds = sections.reduce((sum, section) => sum + (section.duration || 0), 0);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return hours > 0 
            ? `${hours} saat ${minutes} dakika ${seconds} saniye`
            : `${minutes} dakika ${seconds} saniye`;
    };    

    const handleCancel = () => {
        setFileType(null);
        setImageFile(null);
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
        setBookTitle(" ");
        handleClose();
    }

    const handleEditCancel = () => {
        setFileType(null);
        setImageFile(null);
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

    const handleAudioFileSelect = (e) => {
        setAudioFile(e.target.files[0]);
    };
    
    const handleImageFileSelect = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleTextFileSelect = (e) => {
        setTextFile(e.target.files[0]);
    };

    const handleSectionImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append("image", file);
    
                const response = await axios.post(
                    `http://localhost:3000/episode/uploadImage`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
    
                if (response.status === 201) {
                    const data = response.data;
                    setImageFile(file); 
                    const uploadedImage = response.data.imagePath;
                    setImageFilePath(uploadedImage);
                } else {
                    throw new Error("Görsel yüklenemedi");
                }
            } catch (error) {
                console.error("Görsel yüklenirken hata oluştu:", error);
            }
        }
    };

    const handleAudioUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const maxSizeInMB = 10;
            if (file.size > maxSizeInMB * 1024 * 1024) {
                setError(`Ses dosyası ${maxSizeInMB} MB'den büyük olamaz.`);
                setTimeout(() => setError(""), 5000);
                return;
            }
    
            const audio = new Audio(URL.createObjectURL(file));
            audio.onloadedmetadata = async () => {
                const maxDurationInSeconds = 20 * 60;
                if (audio.duration > maxDurationInSeconds) {
                    setError("Ses dosyasının süresi 20 dakikadan uzun olamaz.");
                    setTimeout(() => setError(""), 5000);
                    return;
                }
    
                setError("");
    
                try {
                    const formData = new FormData();
                    formData.append('audioFile', file);

                    const response = await axios.post(
                        `http://localhost:3000/episode/upload`, 
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
    
                    if (response.status === 201) {
                        const data = response.data;
                        setAudioFile(file);
                    } else {
                        throw new Error('Dosya yüklenemedi');
                    }
                } catch (error) {
                    console.error("Ses dosyası yükleme hatası:", error);
                }
            };
    
            audio.onerror = () => {
                setError("Geçersiz ses dosyası. Lütfen geçerli bir dosya seçin.");
                setTimeout(() => setError(""), 5000);
            };
        }
    };      

    const handleTextFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "text/plain") {
                alert("Yalnızca .txt dosyaları yüklenebilir.");
                return;
            }
    
            try {
                const formData = new FormData();
                formData.append("textFile", file);
    
                const response = await axios.post(
                    `http://localhost:3000/episode/uploadText`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
    
                if (response.status === 201) {
                    const data = response.data;
                    setTextFile(file);
                } else {
                    throw new Error("Metin dosyası yüklenemedi");
                }
            } catch (error) {
                console.error("Metin dosyası yükleme hatası:", error);
            }
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
                    const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                    const audioFile = new File([audioBlob], 'recorded-audio.wav', { type: 'audio/wav' });
                    setAudioFile(audioFile); 
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudioUrl(audioUrl);
                };

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
    
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        }
    };

    const startNewRecording = () => {
        stopRecording();
        setAudioUrl(null);
        setAudioChunks([]);
        setShowNewRecordingButton(false);
        startRecording();
        setIsPaused(true);
    };

    const handlePublishSection = async (publish = true) => {
        if (!title) {
            alert("Bölüm başlığı gerekli!");
            return;
        }

        const formData = new FormData();
        if (imageFile instanceof File) {
            formData.append("image", imageFile); 
        }
        
        if (textFile instanceof File) {
            formData.append("textFile", textFile); 
        }
        
        if (audioFile instanceof File) {
            formData.append("audioFile", audioFile);
        }
    
        formData.append("title", title);
        formData.append("duration", audioDuration.toString());
        formData.append("publish", publish.toString());
    
        setIsLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:3000/episode/publish/${formatTitleForUrl(encodedAudioBookTitle)}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.status === 201) {
                const newSection = response.data; 
                setSections((prevSections) => [...prevSections, newSection]);
                setShowSuccessModal(true); 
                handleClose(); 
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const { message } = error.response.data;
                setShowNewSectionModal(false);
                setWarningMessage(message || "Bu bölüm küfür ve argo içerdiği için yayınlanamaz.");
                setShowWarningModal(true);
            } else {
                console.error("Beklenmeyen hata oluştu:", error);
            } 
        } finally {
            setIsLoading(false); 
        }
    };    

    const handleSaveSection = async (publish = false) => {
        if (!title) {
            alert("Bölüm başlığı gerekli!");
            return;
        }

        const formData = new FormData();

        formData.append("title", title);
        formData.append("duration", audioDuration.toString());
        formData.append("publish", publish.toString());

        if (imageFile instanceof File) {
            formData.append("image", imageFile); 
        }
        
        if (textFile instanceof File) {
            formData.append("textFile", textFile); 
        }
        
        if (audioFile instanceof File) {
            formData.append("audioFile", audioFile);
        }

        try {
            const response = await axios.post(
                `http://localhost:3000/episode/save/${formatTitleForUrl(encodedAudioBookTitle)}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
    
            if (response.status === 201) {
                const newSection = response.data; 
                setSections((prevSections) => [...prevSections, newSection]);
                setShowSuccessModal(true); 
                handleClose(); 
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            console.error("Error while saving section:", error);
        }
    };    

    const handleUpdateSaveSection = async (publish = false, title) => {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("duration", audioDuration.toString());
        formData.append("publish", publish.toString());

        if (imageFile instanceof File) {
            formData.append("image", imageFile); 
        }
        
        if (textFile instanceof File) {
            formData.append("textFile", textFile); 
        }
        
        if (audioFile instanceof File) {
            formData.append("audioFile", audioFile);
        }

        const formattedEpisodeTitle = formatTitleForUrl(title);
        const formattedAudioBookTitle = formatTitleForUrl(encodedAudioBookTitle);
        try {
            const response = await axios.put(
            `http://localhost:3000/episode/save/${formattedAudioBookTitle}/${formattedEpisodeTitle}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
    
            if (response.status === 201) {
                alert("Bölüm başarıyla güncellendi!");
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            console.error("Error while saving section:", error);
        }
    }; 

    return (
        <div className="add-voice-section-page">
            <div className="container">
                <h2 className='text-center mt-5 mb-5'>Sesli Kitap Detay Sayfasına Hoş Geldiniz</h2>
                <div className="add-voice-section-main">
                    <div className="add-voice-section-left">
                        {/* Upload Cover */}
                        {bookImage ? (
                            <img 
                                src={bookImage.startsWith('uploads') ? `${backendBaseUrl}/${bookImage}` : bookImage} 
                                alt="uploaded" 
                                className='uploaded-image'
                            />
                            ) : (
                            <img src="/images/upload-image.svg" alt="upload-image"/>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            id="image-upload"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <button onClick={() => document.getElementById('image-upload').click()}>Görsel Yükle <i className="bi bi-cloud-arrow-up-fill ms-2"></i></button>
                        {error && <p className='error-message-cover'>{error}</p>}
                        <span className='voice-left-description'>
                            Kitabınız kapağını değiştirmek istiyorsanız
                            görsel yükle butonuna tıklamanız yeterli olacaktır.
                        </span>
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
                            {showSuccessAlert && (
                                <div className="alert alert-success d-flex" role="alert">
                                    <i className="bi bi-check-circle-fill me-3"></i>
                                    <div>
                                        Kitap güncelleme işlemi başarılı.
                                    </div>
                                </div>
                            )}
                            {showErrorAlert && (
                                <div className="alert alert-danger d-flex" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-3"></i>
                                    <div>Kitap güncelleme işlemi başarısız.</div>
                                </div>
                            )}                            
                            {activeTab === 'details' && (
                                <div id="details" className={`tab-pane ${activeTab === 'details' ? 'active' : ''}`}>
                                    <Form className='d-flex flex-column gap-4' onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>Kitap Adı</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={title}
                                                onChange={(e) => setBookTitle(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Kitap Özeti</Form.Label>
                                            <Form.Control 
                                                as="textarea"
                                                rows={4}
                                                value={summary}
                                                onChange={(e) => setBookSummary(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Kategori</Form.Label>
                                            <Form.Select
                                                size='sm'
                                                value={bookCategory}  
                                                onChange={handleCategoryChange} 
                                            >
                                                <option value="">Kategori Seçiniz...</option>
                                                {Array.isArray(category) && (
                                                    category.map((categories) => (
                                                        <option key={categories.id} value={categories.id}>
                                                            {categories.name}
                                                        </option>
                                                    ))
                                                )}
                                                </Form.Select>
                                        </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Etiketler</Form.Label>
                                                    <div className="tags-container">
                                                        {Array.isArray(bookTags) && bookTags.map((bookTag, index) => (
                                                            <div className="tag-item" key={index}>
                                                                <span className="tag-text">{bookTag}</span>
                                                                <span className="remove-tag" onClick={() => handleRemoveTag(bookTag)}>x</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <InputGroup>
                                                        <Form.Control  
                                                            value={currentTag}
                                                            onChange={(e) => setCurrentTag(e.target.value)}
                                                            onKeyDown={handleKeyDown}
                                                            placeholder='Etiket ekleyiniz...'
                                                        />
                                                        <InputGroup.Text className='span-plus' onClick={handleAddTag}>+</InputGroup.Text>
                                                    </InputGroup>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Yaş Aralığı</Form.Label>
                                            <Form.Select
                                                size='sm'
                                                value={ageRange} 
                                                onChange={handleRangeChange} 
                                            >
                                                <option value="">Yaş Aralığı Seçiniz...</option>
                                                {Array.isArray(ageRanges) && (
                                                    ageRanges.map((range) => (
                                                        <option key={range.id} value={range.id}>
                                                            {range.range}
                                                        </option>
                                                    ))
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                        {showCopyrightAlert && (
                                            <div className="alert alert-warning d-flex" role="alert">
                                                <i className="bi bi-exclamation-triangle-fill me-3"></i>
                                                    <div>
                                                        Lütfen yasal uyarıyı kontrol ettiğinizden emin olun.
                                                    </div>
                                            </div>
                                        )}
                                        <Form.Group>
                                            <Form.Label>Telif Hakkı</Form.Label>
                                            <Form.Select
                                                size='sm' 
                                                value={bookContentChoice} 
                                                onChange={handleContentChoiceChange}
                                            >
                                                <option value="" selected>Seçiniz...</option>
                                                {Array.isArray(copyrightStatuses) && 
                                                    copyrightStatuses.map(status => (
                                                        <option key={status.id} value={status.id}>
                                                            {status.copyright}
                                                        </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        {showCopyrightAlert && bookContentChoice === "1" && (
                                            <div className="alert alert-danger d-flex align-items-start" role="alert">
                                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                <div>
                                                    "Kitaın içeriği tamamen bana aittir. 
                                                    Hiçbir dış kaynaktan alıntı yapılmamıştır." 
                                                    seçeneğini seçmiş olmanız durumunda, kitabınızın içeriği 
                                                    ile ilgili tüm sorumluluk size aittir. Herhangi bir telif hakkı 
                                                    ihlali veya yasal yükümlülük durumunda sorumluluk tamamen 
                                                    size ait olacaktır.
                                                </div>
                                            </div>
                                        )} 
                                         <div className="add-voice-section-btn">
                                            <Button className='add-voice-section-btn mb-4' type='submit'>Kaydet</Button>
                                        </div>
                                    </Form>
                                </div>
                            )}
                            { /* Sections */ }
                            {isLoading && (
                                <div className="loading-overlay d-flex gap-3">
                                    <img src="/images/efso_logo.svg" alt="" width="320px"/>
                                    <Spinner 
                                        animation="border"
                                        variant="primary"
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                    <p>Merhaba, ben Efso! Bu bölümü sizin için analiz ediyorum. Lütfen biraz bekleyin...</p>
                                </div>
                            )}
                            {activeTab === 'sections' && (
                                <div id="sections" className={`voice-tab-pane ${activeTab === 'sections' ? 'active' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6>
                                            Toplam {sections.length} adet bölüm 
                                            <span className='calculateTotal ms-2 fw-light'>({(calculateTotalDuration())})</span>
                                        </h6>
                                        <Button className='add-voice-new-section-btn' onClick={handleShow}>Yeni Bölüm Ekle</Button>
                                    </div>
                                    {/* Add New Section */ }
                                    <Modal show={showNewSectionModal} onHide={handleClose} className='custom-modal' centered>
                                        <Modal.Header closeButton className='custom-modal-header'>
                                            <Modal.Title className='fs-6 text-dark me-2'>Yeni Bölüm Ekle</Modal.Title>
                                            <i className="bi bi-question-circle-fill" onClick={handleInfoShow}></i>
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
                                                <Form.Control size="sm" type="text" placeholder="Bir bölüm başlığı girin..." className='modal-section-title mb-4' value={title || ""} onChange={(e) => setBookTitle(e.target.value)} />
                                                {/* Görsel Yükleme */}
                                                {fileType === 'image' && (
                                                    <div className='add-voice-image'>
                                                        <Form.Group className='mt-4 mb-4 d-flex flex-column'>
                                                            {imageFile && 
                                                                <img 
                                                                    src={
                                                                        typeof imageFile === "string"
                                                                            ? imageFile
                                                                            : URL.createObjectURL(imageFile)
                                                                    }
                                                                    className='object-fit-cover mb-4'  
                                                                    alt="Bölüm Görseli" 
                                                                    width="300" 
                                                                    height="200"
                                                                />}
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
                                                                                <i className="bi bi-mic-fill"></i>
                                                                                <p>Başlat</p>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="stop-voice d-flex flex-column align-items-center justify-content-center me-2">
                                                                                <i className="bi bi-stop-fill"></i>
                                                                                <p>Bitir</p>
                                                                            </div>
                                                                        )}
                                                                    </Button>
                                                                    {isRecording && (
                                                                        <>
                                                                            <Button variant="secondary" onClick={isPaused ? resumeRecording : pauseRecording}>
                                                                                {!isPaused ? (
                                                                                    <div className="pause-voice me-2">
                                                                                    <i className="bi bi-pause-fill"></i>
                                                                                        <p>Duraklat</p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="resume-voice me-2">
                                                                                        <i className="bi bi-play-fill"></i>
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
                                                                    onChange={handleAudioUpload }
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
                                                                    accept="*.txt"
                                                                    size='sm'
                                                                    className='opacity-75'
                                                                    onChange={handleTextFileUpload}
                                                                />
                                                            </Form.Group>
                                                    </div>
                                                )}
                                            </Form>
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
                                                <Button variant="secondary" className='btn-modal-save' onClick={() => handleSaveSection(false)}>
                                                    Kaydet
                                                </Button>
                                                <Button variant="primary" className='btn-modal-publish' onClick={() => handlePublishSection(true)}>
                                                    Yayınla
                                                </Button>
                                            </div>
                                        </Modal.Footer>
                                    </Modal>
                                    {sections.map(section => (
                                        <div 
                                            className="voice-section-row d-flex justify-content-between align-items-center" 
                                            key={section.id} 
                                            onClick={() => handleBookSection(section.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span>{section.title}</span>
                                            <div className="voice-statistics d-flex gap-3">
                                            {section.analysis && section.analysis.length > 0 ? (
                                                section.analysis.map((stat, index) => (
                                                    <span key={index} className="d-flex align-items-center me-4">
                                                        <span className='d-flex gap-1'><i className="bi bi-eye"></i>{formatNumber(stat.read_count)}</span>
                                                        <span className='d-flex gap-1'><i className="bi bi-heart"></i>{formatNumber(stat.like_count)}</span>
                                                        <span className='d-flex gap-1'><i className="bi bi-chat"></i>{formatNumber(stat.comment_count)}</span>
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="no-analysis mb-0">Bu bölüm için analiz verisi yok.</p>
                                            )}
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
                                                        <Modal show={showEditModal} onHide={handleEditClose} className='edit-modal' centered>
                                                            <Modal.Header closeButton className='edit-modal-header'>
                                                                <Modal.Title className='fs-6 me-2'>Düzenle</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <Form>
                                                                    <Form.Control size="sm" type="text" placeholder="Bir bölüm başlığı girin..." className='edit-modal-section-title mb-4' value={section.title || ""} onChange={(e) => setBookTitle(e.target.value)}/>
                                                                    {/* Görsel Yükleme */}
                                                                    {fileType === 'image' && (
                                                                        <div className='edit-voice-image'>
                                                                            <Form.Group className='mt-4 mb-4 d-flex flex-column'>
                                                                                {section.image && (
                                                                                    <img 
                                                                                        src={
                                                                                            section?.image
                                                                                                ? section.image.startsWith('uploads')
                                                                                                    ? `${backendBaseUrl}/${section.image}`
                                                                                                    : section.image
                                                                                                : 'default-book-cover.jpg'
                                                                                        }
                                                                                        className='object-fit-cover mb-4'  
                                                                                        alt="Bölüm Görseli" 
                                                                                        width="300" 
                                                                                        height="200"
                                                                                    />
                                                                                )}
                                                                                <Form.Label>Bölüm görselinizi yükleyin</Form.Label>
                                                                                <Form.Control
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    size='sm'
                                                                                    className='opacity-75 image-modal'
                                                                                    onChange={handleImageFileSelect}
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
                                                                                                        <i className="bi bi-mic-fill"></i>
                                                                                                        <p>Başlat</p>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <div className="stop-voice d-flex flex-column align-items-center justify-content-center me-2">
                                                                                                        <i className="bi bi-stop-fill"></i>
                                                                                                        <p>Bitir</p>
                                                                                                    </div>
                                                                                                )}
                                                                                            </Button>
                                                                                            {isRecording && (
                                                                                                <>
                                                                                                    <Button variant="secondary" onClick={isPaused ? resumeRecording : pauseRecording}>
                                                                                                        {!isPaused ? (
                                                                                                            <div className="pause-voice me-2">
                                                                                                                <i className="bi bi-pause-fill"></i>
                                                                                                                <p>Duraklat</p>
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <div className="resume-voice me-2">
                                                                                                                <i className="bi bi-play-fill"></i>
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
                                                                                    {section.audioFile ? (
                                                                                        <div className="audio-player mb-4">
                                                                                            <audio controls>
                                                                                                <source src={section.audioFile} type="audio/mpeg" />
                                                                                                Tarayıcınız yüklediğiniz dosya uzantısını çalıştırmıyor.
                                                                                            </audio>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <p>Bu bölüm için ses dosyası bulunamadı.</p>
                                                                                    )}
                                                                                    <Form.Control
                                                                                        type="file"
                                                                                        accept="audio/*"
                                                                                        size='sm'
                                                                                        className='opacity-75'
                                                                                        onChange={handleAudioFileSelect}
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
                                                                                        onChange= {handleTextFileSelect}
                                                                                    />
                                                                                </Form.Group>
                                                                        </div>
                                                                    )}
                                                                </Form>
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
                                                                <Button variant="secondary" className='btn-modal-save' onClick={() => handleUpdateSaveSection(false, section.title)}>
                                                                    Kaydet
                                                                </Button>
                                                                <Button variant="primary" className='btn-modal-publish' onClick={() => handlePublishSection(true)}>
                                                                    Yayınla
                                                                </Button>
                                                                </div>
                                                            </Modal.Footer>
                                                        </Modal>
                                                        {section.publish ? (
                                                            <button
                                                                className="dropdown-item dropdown-item-section"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    togglePublish(section.id, section.title);
                                                                }}
                                                                    >
                                                                        Yayından Kaldır
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="dropdown-item dropdown-item-section"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            togglePublish(section.id, section.title);
                                                                    }}
                                                                    >
                                                                        Yayınla
                                                                    </button>
                                                                )}
                                                        <Dropdown.Item href='' onClick={() => handleAction('delete', section)}>Sil</Dropdown.Item>
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
                            {/* Uyarı Modalı */}
                            <Modal show={showWarningModal} onHide={() => setShowWarningModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Uyarı</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>{warningMessage}</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowWarningModal(false)}>
                                        Kapat
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            { /* Success Modal */ }
                            <Modal show={showSuccessModal} onHide={handleSuccessModalClose} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Başarılı</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <p>Bölüm başarıyla eklendi!</p>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="success" onClick={handleSuccessModalClose}>
                                        Tamam
                                    </Button>
                                </Modal.Footer>
                            </Modal>
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
                                                onClick={handleSectionDeleteCancel}
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
                    </div>
                </div>
            </div>
            {tagError && (
                <div className="error-message-cover error-message-bottom-left">
                    {tagError}
                </div>
            )}

            {/* Yayinlanma Animasyonu */}
            <AnimatePresence>
                {showToast && (
                    <motion.div 
                        className="toast-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className={`toast-box ${isSuccess ? "success" : "error"}`} 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.5 }}
                    >
                            <CheckCircle size={100} />
                            <p className='mt-4'>
                                {isSuccess ? "Bölüm başarıyla yayınlandı!" : "Bölüm başarıyla yayından kaldırıldı!"}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div> 
    )
}

export default AddVoice