import React, { useState, useEffect } from 'react'
import './Details.css'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Details() {
    const { bookTitle: encodedAudioBookTitle } = useParams();
    const [bookTags, setTags] = useState([]); 
    const [bookImage, setImage] = useState(""); //kitaba ait resim
    const [bookContentChoice, setContentChoice] = useState(""); //kitabın ait olduğu haklar
    const [title, setBookTitle] = useState(""); //kitaba ait başlık
    const [summary, setBookSummary] = useState(""); //kitaba ait özet
    const [bookCategory, setSelectedCategory] = useState(""); //kitabın ait olduğu category
    const [ageRange, setSelectedAgeRange] = useState(""); //kitabın ait olduğu yaş aralığı
    const [activeTab, setActiveTab] = useState('details');
    const [currentTag, setCurrentTag] = useState("");
    const [tagError, setTagError] = useState("");
    const [showCopyrightAlert, setShowCopyrightAlert] = useState(false);
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [ageRanges, setAgeRange] = useState([]); 
    const [copyrightStatuses, setCopyrightStatuses] = useState([]);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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
                console.log(data);
                
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
    }, [encodedAudioBookTitle]); // URL değiştiğinde verileri yeniden getir
    

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
    
        console.log("Gönderilen Payload:", payload);
    
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
            console.log("Güncellenen Veri:", updatedData);
    
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

return (
    <>
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
                <form className = 'm-0' onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label className='form-label'>Kitap Adı</label>
                            <input 
                                type="text" 
                                className='form-control'
                                value={title}
                                onChange={(e) => setBookTitle(e.target.value)}
                            />
                    </div>
                    <div className="form-group mb-3">
                        <label className='form-label'>Kitap Özeti</label>
                            <textarea 
                                rows="4" 
                                className='form-control'
                                value={summary}
                                onChange={(e) => setBookSummary(e.target.value)}
                            />
                    </div>
                    <div className="form-group mb-3">
                        <label className='form-label'>Kategori</label>
                            <select
                                className="form-select form-select-sm form-select-create"
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
                            </select>
                    </div>
                        <div className="form-group mb-3">
                            <label className='form-label'>Etiketler</label>
                                <div className="tags-container">
                                {Array.isArray(bookTags) && bookTags.map((bookTag, index) => (
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
                            {Array.isArray(ageRanges) && (
                                ageRanges.map((range) => (
                                    <option key={range.id} value={range.id}>
                                        {range.range}
                                    </option>
                                ))
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
                            <select 
                                className="form-select form-select-sm form-select-create" 
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
        {/* Errors */}
        {tagError && (
            <div className="error-message-cover error-message-bottom-left">
                {tagError}
            </div>
        )}
    </>
    
)
}

export default Details