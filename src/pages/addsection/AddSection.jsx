import React, { useState, useEffect } from 'react'
import './AddSection.css'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AddSection() {
    const location = useLocation();
    const {
        bookTitle,
        bookSummary,
        image,
        isAudioBook,
        tags,
        selectedCategory,
        selectedAgeRange,
        contentChoice,
    } = location.state || {};

    const [bookImage, setImage] = useState(image); //kitaba ait resim
    const [bookTags, setTags] = useState(tags); 
    const [bookContentChoice, setContentChoice] = useState(contentChoice); //kitabın ait olduğu haklar
    const [title, setBookTitle] = useState(bookTitle); //kitaba ait başlık
    const [summary, setBookSummary] = useState(bookSummary); //kitaba ait özet
    const [bookCategory, setSelectedCategory] = useState(selectedCategory); //kitabın ait olduğu category
    const [ageRange, setSelectedAgeRange] = useState(selectedAgeRange); //kitabın ait olduğu yaş aralığı
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

    const handleTabClick = (tab) => {
        setActiveTab(tab); 
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = async () => {
                if (img.width > 200 || img.height > 281) {
                    setError("Görsel boyutu 200x281 pikselden büyük olamaz.");
                    setTimeout(() => setError(""), 5000);
                } else {
                    setError("");
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                    try {
                        const base64Image = await convertToBase64(file); 
                        setImage(base64Image);
                    } catch (error) {
                        console.error("Görsel dönüştürme hatası:", error);
                    }
                }
            };
            img.src = URL.createObjectURL(file);
        }
    };
    
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
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

    const handleAction = (action, section) => {
        if (action === "delete") {
            setSectionToDelete(section);
            setShowModal(true);
        }
    };    

    const handleDeleteCancel = () => {
        setShowModal(false);
        setSectionToDelete(null);
    };

    const handleNewSectionButtonClick = () => {
        const formattedTitle = formatTitleForUrl(bookTitle);
        navigate(`/addsection/${formattedTitle}/newsection`, {
            state: {bookTitle},
        });
        console.log(bookTitle);
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
                if (response.data) setAgeRange(response.data);
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
                        `http://localhost:3000/chapter/${bookTitle}`, 
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
            const encodedTitle = encodeURIComponent(bookTitle);
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
    
        } catch (error) {
            console.error('Bölümün yayın durumu değiştirilirken hata oluştu:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };    

    const handleDeleteConfirm = async () => {
        if (!sectionToDelete || !sectionToDelete.id || !sectionToDelete.title) {
            console.error("Silinecek bölüm bilgileri eksik!");
            alert("Silinecek bölüm bilgileri eksik!");
            return;
        }
    
        try {
            const encodedTitle = encodeURIComponent(bookTitle);
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
        const encodedTitle = encodeURIComponent(bookTitle);
    
        if (!bookTitle || !summary || !bookImage || !bookCategory || !ageRange || isAudioBook === null || !bookContentChoice) {
            setShowErrorAlert(true);
            setShowSuccessAlert(false);
            window.scrollTo(0, 0);
            return;
        }
    
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                alert("Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.");
                return;
            }
    
            console.log("Payload Sent to Backend:", {
                title: bookTitle,
                summary,
                categories: bookCategory,
                ageRange: ageRange,
                bookCopyright: bookContentChoice,
                isAudioBook,
                bookCover: typeof bookImage === 'string' ? bookImage : null,
                hashtags: Array.isArray(bookTags) ? bookTags : [],
            });

            const url = `http://localhost:3000/book/${encodedTitle}`;

            const response = await axios.put(url,
                {
                    title: bookTitle,
                    summary,
                    categories: bookCategory,
                    ageRange: ageRange,
                    bookCopyright: bookContentChoice,
                    isAudioBook,
                    bookCover: typeof bookImage === 'string' ? bookImage : null,
                    hashtags: Array.isArray(bookTags) ? bookTags : [],
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            
            console.log(response.data);
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 3000);
        } catch (error) {
            console.error("Kitap güncelleme işlemi başarısız oldu:", error);
            setShowErrorAlert(true);
        }
    };    

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
            <div className="add-section-main">
                <div className="add-section-left">
                    {bookImage ? (
                        <img src={bookImage} alt="uploaded" width="200px" height="281px" />
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
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label className='form-label'>Kitap Adı</label>
                                        <input 
                                            type="text" 
                                            className='form-control'
                                            value={title}
                                            onChange={(e) => setBookTitle(e.target.value)}/>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className='form-label'>Kitap Özeti</label>
                                        <textarea 
                                            rows="4" 
                                            className='form-control'
                                            value={summary}
                                            onChange={(e) => setBookSummary(e.target.value)}/>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className='form-label'>Kategori</label>
                                        <select
                                            className="form-select form-select-sm form-select-create"
                                            value={bookCategory}  
                                            onChange={handleCategoryChange} 
                                        >
                                            <option value="">Kategori Seçiniz...</option>
                                            {Array.isArray(category) ? (
                                                category.map((categories) => (
                                                    <option key={categories.id} value={categories.id}>
                                                    {categories.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Kategori yüklenemedi</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                    <label className='form-label'>Etiketler</label>
                                    <div className="tags-container">
                                        {bookTags.map((bookTag, index) => (
                                            <div className="tag-item" key={index}>
                                                <span className="tag-text">{bookTag}</span>
                                                <span className="remove-tag" onClick={() => handleRemoveTag(bookTag)}>x</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="input-group">
                                        <input  
                                            className='form-control'
                                            value={currentTag}
                                            onChange={(e) => setCurrentTag(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder='Etiket ekleyiniz...'
                                        />
                                        <span className='input-group-text span-plus' onClick={handleAddTag}>+</span>
                                    </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>Yaş Aralığı</label>
                                        <select
                                            className="form-select form-select-sm form-select-create"
                                            value={ageRange} 
                                            onChange={handleRangeChange} 
                                        >
                                            <option value="">Yaş Aralığı Seçiniz...</option>
                                            {Array.isArray(ageRanges) ? (
                                                ageRanges.map((range) => (
                                                    <option key={range.id} value={range.id}>
                                                    {range.range}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Yaş aralıkları yüklenemedi</option>
                                            )}
                                        </select>
                                    </div>
                                    {showCopyrightAlert && (
                                        <div className="alert alert-warning d-flex" role="alert">
                                            <i className="bi bi-exclamation-triangle-fill me-3"></i>
                                            <div>
                                                Lütfen yasal uyarıyı kontrol ettiğinizden emin olun.
                                            </div>
                                        </div>
                                    )}
                                    <div className="form-group mb-3">
                                        <label className='form-label'>Telif Hakkı</label>
                                        <select className="form-select form-select-sm form-select-create" value={bookContentChoice} onChange={handleContentChoiceChange}>
                                            <option value="" selected>Seçiniz...</option>
                                            {copyrightStatuses.map((status) => (
                                                <option key={status.id} value={status.id}>
                                                    {status.copyright}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                            
                                    {showCopyrightAlert && bookContentChoice === "1" && (
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
                                    <button className='add-section-btn mb-3' type='submit'>Kaydet</button> 
                                </form>
                            </div>
                        )}
                        { /* Sections */ }
                        {activeTab === 'sections' && (
                            <div id="sections" className={`tab-pane ${activeTab === 'sections' ? 'active' : ''}`}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6>{sections.length} adet bölüm</h6>
                                    <button className='add-new-section-btn' onClick={handleNewSectionButtonClick}>Yeni Bölüm Ekle</button>
                                </div>
                                {sections.map(section => (
                                    <div className="section-row d-flex justify-content-between align-items-center" key={section.id}>
                                        <span>{section.title}</span>
                                        <div className="istatistic d-flex me-3">
                                        {section.analysis && section.analysis.length > 0 ? (
                                            section.analysis.map((stat, index) => (
                                                <span key={index} className="d-flex align-items-center me-4">
                                                    <p><i className="bi bi-eye-fill me-1"></i>{formatNumber(stat.read_count)}</p>
                                                    <p><i className="bi bi-balloon-heart-fill ms-4 me-1"></i>{formatNumber(stat.like_count)}</p>
                                                    <p><i className="bi bi-chat-heart-fill ms-4 me-1"></i>{formatNumber(stat.comment_count)}</p>
                                                </span>
                                            ))
                                        ) : (
                                            <p className="no-analysis mb-0">Bu bölüm için analiz verisi yok.</p>
                                        )}
                                        </div>
                                        <div className="dropdown dropdown-section">
                                            <i
                                                className="bi bi-three-dots-vertical"
                                                onClick={() => toggleDropdown(section.id)}
                                                style={{ cursor: 'pointer' }}
                                            ></i>
                                            {dropdownVisible === section.id && (
                                                <div className="dropdown-menu show">
                                                    <button className="dropdown-item dropdown-item-section" onClick={() => handleAction('edit', section.id)}>Düzenle</button>
                                                    {section.publish ? (
                                                        <button
                                                            className="dropdown-item dropdown-item-section"
                                                            onClick={() => togglePublish(section.id, section.title)}
                                                        >
                                                            Yayından Kaldır
                                                        </button>
                                                        ) : (
                                                        <button
                                                            className="dropdown-item dropdown-item-section"
                                                            onClick={() => togglePublish(section.id, section.title)}
                                                        >
                                                            Yayınla
                                                        </button>
                                                    )}
                                                    <button 
                                                        className="dropdown-item dropdown-item-section" 
                                                        onClick={() => handleAction('delete', section)} 
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

export default AddSection