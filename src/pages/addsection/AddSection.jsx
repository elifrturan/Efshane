import React, { useState, useEffect } from 'react'
import './AddSection.css'
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from 'react-feather';
import axios from 'axios';
import { Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap';

function AddSection() {
    const { bookTitle: encodedBookTitle } = useParams();
    const [bookImage, setImage] = useState(""); //kitaba ait resim
    const [bookTags, setTags] = useState([]); 
    const [bookContentChoice, setContentChoice] = useState(""); //kitabın ait olduğu haklar
    const [title, setBookTitle] = useState(""); //kitaba ait başlık
    const [summary, setBookSummary] = useState(""); //kitaba ait özet
    const [bookCategory, setSelectedCategory] = useState(""); //kitabın ait olduğu category
    const [ageRange, setSelectedAgeRange] = useState(""); //kitabın ait olduğu yaş aralığı
    const [sections, setSections] = useState ([]); // kitaba ait bölümler
    const [loadingSections, setLoadingSections] = useState(false); 
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState('details');
    const [currentTag, setCurrentTag] = useState("");
    const [tagError, setTagError] = useState("");
    const [showCopyrightAlert, setShowCopyrightAlert] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [ageRanges, setAgeRange] = useState([]); 
    const [copyrightStatuses, setCopyrightStatuses] = useState([]);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showToast, setShowToast] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false);

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

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const encodeBookTitle = encodeURIComponent(encodedBookTitle);
                
                const response = await axios.get(
                    `http://localhost:3000/book/${encodeBookTitle}`,
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
                setSelectedCategory(data.categories && data.categories[0].categoryId);
                setSelectedAgeRange(data.ageRange && data.ageRange[0].rangeId );
                setContentChoice(data.bookCopyright && data.bookCopyright[0].bookCopyrightId);
                setTags(data.hashtags ? data.hashtags.map(tag => tag.hashtag.name) : []);
                
            } catch (error) {
                console.error('Kitap bilgilerini çekerken hata oluştu:', error);
            }
        };
    
        fetchBookDetails();
    }, [encodedBookTitle]);

    const handleTabClick = (tab) => {
        setActiveTab(tab); 
    };

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
    
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'; 
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'; 
        }
        return num.toString(); 
    };

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
        setTags(bookTags.filter(tag => tag !== tagToRemove));
    }

    const handleContentChoiceChange = (e) => {
        const selectedValue = e.target.value;
        setContentChoice(selectedValue);
        if (selectedValue === "1") {
            setShowCopyrightAlert(true);
        } else {
            setShowCopyrightAlert(false);
        }
    };

    const toggleDropdown = (id) => {
        setDropdownVisible(prev => (prev === id ? null : id));
    };

    const handleAction = (action, sectionId) => {
        if (action === "delete") {
            setSectionToDelete(sectionId);
            setShowModal(true);
        } else if (action === "edit") {
            const section = sections.find((sec) => sec.id === sectionId);
            if (section) {
                const chapterTitlee = section.title;
                const formattedChapterName = formatTitleForUrl(chapterTitlee); 
                const formattedBookTitle = formatTitleForUrl(encodedBookTitle);
                navigate(`/addsection/edit/${formattedBookTitle}/${formattedChapterName}`);
            }
        }
    };
    
    const handleDeleteCancel = () => {
        setShowModal(false);
        setSectionToDelete(null);
    };

    const handleNewSectionButtonClick = () => {
        const formattedTitle = formatTitleForUrl(encodedBookTitle);
        navigate(`/addsection/${formattedTitle}/newsection`);
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
                const response = await axios.get('http://localhost:3000/book/ageRange');
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
        axios.get('http://localhost:3000/book/copyright')
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

    useEffect(() => {
        const fetchSections = async () => {
            if (activeTab === "sections") { 
                setLoadingSections(true); 
                try {
                    const response = await axios.get(
                        `http://localhost:3000/chapter/${encodedBookTitle}`, 
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    if (response.data) {
                        setSections(response.data); 
                    } else {
                        console.error("Bölüm verisi beklenmeyen formatta:", response.data);
                    }
                } catch (error) {
                    console.error("Bölümleri çekerken hata oluştu:", error);
                } finally {
                    setLoadingSections(false);
                }
            }
        };
    
        fetchSections();
    }, [activeTab]);

    const togglePublish = async (chapterId, chapterTitle) => {
        try {
            const encodedTitle = encodeURIComponent(title);
            const encodedChapterTitle = encodeURIComponent(chapterTitle);
            const url = `http://localhost:3000/chapter/${encodedTitle}/${encodedChapterTitle}`;
            const response = await axios.put(
                url,
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            const updatedChapter = response.data;
            setSections((prevSections) =>
                prevSections.map((section) =>
                    section.id === chapterId ? { ...section, publish: updatedChapter.publish } : section
                )
            );

            if(!updatedChapter.publish) {
                setIsSuccess(false);
            } else {
                setIsSuccess(true);
                setTimeout(() => setShowToast(false), 4000);
            }
    
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);    
        } catch (error) {
            console.error('Bölümün yayın durumu değiştirilirken hata oluştu:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };    

    const handleDeleteConfirm = async () => {
        if (!sectionToDelete || !sectionToDelete.id || !sectionToDelete.title) {
            alert("Silinecek bölüm bilgileri eksik!");
            return;
        }
    
        try {
            const encodedTitle = encodeURIComponent(title);
            const encodedChapterTitle = encodeURIComponent(sectionToDelete.title);
            const url = `http://localhost:3000/chapter/${encodedTitle}/${encodedChapterTitle}`;
    
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            setSections(sections.filter((section) => section.id !== sectionToDelete.id));
            setShowModal(false);
            setSectionToDelete(null);
    
            alert('Bölüm başarıyla silindi!');
        } catch (error) {
            console.error('Bölüm silinirken hata oluştu:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!title.trim() || !summary.trim() || !bookCategory || !ageRange || bookContentChoice === '') {
            setShowErrorAlert(true);
            setShowSuccessAlert(false);
            window.scrollTo(0, 0);
            return;
        }
    
        const payload = {
            title: title.trim(),
            summary: summary.trim(),
            bookCover: typeof bookImage === 'string' ? bookImage : null,
            categories: String(bookCategory),
            ageRange: String(ageRange),
            bookCopyright: String(bookContentChoice),
            hashtags: Array.isArray(bookTags) ? bookTags.map(tag => String(tag)) : [],
        };
    
        try {
            const response = await axios.put(
                `http://localhost:3000/book/${encodedBookTitle}`,
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
            setSelectedCategory(updatedData.categories || '');
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
            setShowErrorAlert(true);
            setShowSuccessAlert(false);
        }
    };

    const handleBookSection = (sectionId) => {
        const section = sections.find((sec) => sec.id === sectionId);
        if (section && section.title) {
            const chapterTitlee = section.title;
            const formattedChapterName = formatTitleForUrl(chapterTitlee); 
            const formattedBookTitle = formatTitleForUrl(encodedBookTitle);
            navigate(`/addsection/edit/${formattedBookTitle}/${formattedChapterName}`);
        } else {
            console.error("Section or sectionName is undefined:", section);
        }
    };    

    const backendBaseUrl = 'http://localhost:3000';

    return (
        <div className="addsection-page">
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
            <div className="container">
                <h2 className='text-center mt-5 mb-5'>Kitap Detay Sayfasına Hoş Geldiniz</h2>
                <div className="add-section-main mt-5">
                    <div className="add-section-left">
                        {bookImage ? (
                            <img 
                                src={bookImage.startsWith('uploads') ? `${backendBaseUrl}/${bookImage}` : bookImage} 
                                alt="uploaded" 
                                className='uploaded-image'
                            />
                        ) : (
                            <img src="/images/upload-image.svg" alt="upload-image"/>
                        )}
                        <Form.Control
                            type="file"
                            accept="image/*"
                            id="image-upload"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <button onClick={() => document.getElementById('image-upload').click()}>Görsel Yükle <i className="bi bi-cloud-arrow-up-fill ms-2"></i></button>
                        {error && <p className='error-message-cover'>{error}</p>}
                        <i className='left-description'>Kitabınız kapağını değiştirmek istiyorsanız
                            görsel yükle butonuna tıklamanız yeterli olacaktır.
                        </i>
                    </div>
                    <div className="add-section-right">
                        {/* Tabs */}
                        <div className="tabs">
                            <button
                                className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                                onClick={() => handleTabClick('details')}
                            >
                            Detay
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'sections' ? 'active' : ''}`}
                                onClick={() => handleTabClick('sections')}
                            >
                                Bölümler
                            </button>
                        </div>
                        {/* Content */}
                        <div className="tab-content">
                            {/* Details */}
                            {activeTab === 'details' && (
                                <div id="details" className={`tab-pane ${activeTab === 'details' ? 'active' : ''}`}>
                                    <Form className='d-flex flex-column gap-4' onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>Kitap Adı</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={title}
                                                onChange={(e) => setBookTitle(e.target.value)}/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Kitap Özeti</Form.Label>
                                            <Form.Control 
                                                as="textarea"
                                                rows={4} 
                                                value={summary}
                                                onChange={(e) => setBookSummary(e.target.value)}/>
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
                                        <Alert key="danger" variant='danger'className='d-flex mb-0'>
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            <span>
                                                "Kitabın içeriği tamamen bana aittir. 
                                                Hiçbir dış kaynaktan alıntı yapılmamıştır." 
                                                seçeneğini seçmiş olmanız durumunda, kitabınızın içeriği 
                                                ile ilgili tüm sorumluluk size aittir. Herhangi bir telif hakkı 
                                                ihlali veya yasal yükümlülük durumunda sorumluluk tamamen 
                                                size ait olacaktır.
                                            </span>
                                        </Alert>
                                        )} 
                                        <div className="add-section-btn">
                                            <Button className='add-section-btn mb-4' type='submit'>Kaydet</Button>
                                        </div>
                                    </Form>
                                </div>
                            )}
                            { /* Sections */ }
                            {activeTab === 'sections' && (
                                <div id="sections" className={`tab-pane ${activeTab === 'sections' ? 'active' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6>{sections.length} adet bölüm</h6>
                                        <Button className='add-new-section-btn' onClick={handleNewSectionButtonClick}>Yeni Bölüm Ekle</Button>
                                    </div>
                                    {sections.map(section => (
                                        <div 
                                            className="section-row d-flex justify-content-between align-items-center" 
                                            key={section.id} 
                                            onClick={() => handleBookSection(section.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span>{section.title}</span>
                                            <div className="statistics d-flex gap-3">
                                                {section.analysis && section.analysis.length > 0 ? (
                                                    section.analysis.map((stat, index) => (
                                                        <span key={index} className="d-flex align-items-center">
                                                            <span className='d-flex gap-1'><i className="bi bi-eye"></i>{formatNumber(stat.read_count)}</span>
                                                            <span className='d-flex gap-1'><i className="bi bi-heart"></i>{formatNumber(stat.like_count)}</span>
                                                            <span className='d-flex gap-1'><i className="bi bi-chat"></i>{formatNumber(stat.comment_count)}</span>
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="no-analysis mb-0">Bu bölüm için analiz verisi yok.</p>
                                                )}
                                            </div>
                                            <div className="dropdown dropdown-section">
                                                <i
                                                    className="bi bi-three-dots-vertical"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleDropdown(section.id);
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                ></i>
                                                {dropdownVisible === section.id && (
                                                    <div className="dropdown-menu show">
                                                        <button className="dropdown-item dropdown-item-section" onClick={() => handleAction('edit', section.id)}>Düzenle</button>
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
                                                        <button 
                                                            className="dropdown-item dropdown-item-section" 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAction('delete', section);
                                                            }} 
                                                        >
                                                            Sil
                                                        </button>
                                                    </div>
                                                )}                                           
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
            { /* Modal */ }
            
            <Modal show={showModal} onHide={() => setShowModal(false)} centered className='delete-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Emin Misiniz?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bu bölümü silmek istediğinizden emin misiniz?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleDeleteCancel} className='cancel'>İptal</Button>
                    <Button onClick={handleDeleteConfirm} className='delete'>Sil</Button>
                </Modal.Footer>
            </Modal>

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
export default AddSection