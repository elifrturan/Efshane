import React, { useState, useEffect} from 'react'
import './CreateStory.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { Button, Form, InputGroup } from 'react-bootstrap';

function CreateStory() {
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState("");
    const [tagError, setTagError] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showCopyrightAlert, setShowCopyrightAlert] = useState(false);
    const [contentChoice, setContentChoice] = useState("");
    const [copyrightStatuses, setCopyrightStatuses] = useState([]);
    const navigate = useNavigate();
    const [bookTitle, setBookTitle] = useState("");
    const [bookSummary, setBookSummary] = useState("");
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [ageRanges, setAgeRange] = useState([]); 
    const [selectedAgeRange, setSelectedAgeRange] = useState('');
    const [isAudioBook, setIsAudioBook] = useState(null);
    
    const backendBaseUrl = 'http://localhost:3000';
    const defaultImage = "/images/default-book-cover.webp";
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
                if (response.data) 
                    setAgeRange(response.data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
            if (!bookTitle || !bookSummary || !selectedCategory || !selectedAgeRange || isAudioBook === null || !contentChoice) {
            setShowErrorAlert(true);
            setShowSuccessAlert(false);
            window.scrollTo(0, 0);
            return;
        }
    
        setShowErrorAlert(false);
        setShowSuccessAlert(true);
        window.scrollTo(0, 0);

        const normalizedTitle = bookTitle.toLowerCase().trim();

        const formData = new FormData();
        formData.append('bookCover', image);
        formData.append('title', bookTitle);
        formData.append('summary', bookSummary);
        formData.append('normalizedTitle', bookTitle.toLowerCase().trim());
        formData.append('hashtags', JSON.stringify(tags)); 
        formData.append('categories', selectedCategory);
        formData.append('ageRange', selectedAgeRange);
        formData.append('bookCopyright', contentChoice);
        formData.append('duration', "0");

        const url = isAudioBook ? 'http://localhost:3000/audio-book' : 'http://localhost:3000/book';

        if (url !== 'http://localhost:3000/audio-book') {
            formData.append('isAudioBook', isAudioBook ? 'true' : 'false');
        }

        try {
            const response = await axios.post(
                url, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
    
            if (response.status === 201) {
                const { normalizedTitle } = response.data;
                setTimeout(() => {
                    if (isAudioBook) {
                        navigate(`/add-voice-section/${normalizedTitle}`);
                    } else {
                        navigate(`/addsection/${normalizedTitle}`);
                    }
                }, 3000);
            }

        } catch (error) {
            setShowErrorAlert(true);
            setShowSuccessAlert(false);
            window.scrollTo(0, 0);
            console.error(error);
        }
    };
    
    const handleContentChoiceChange = (e) => {
        const selectedValue = e.target.value;
        setContentChoice(selectedValue);
        if (selectedValue === "1") {
            setShowCopyrightAlert(true);
        } else {
            setShowCopyrightAlert(false);
        }
    };

    return (
        <>
        {showSuccessAlert && (
            <div className="alert alert-success d-flex" role="alert">
                <i className="bi bi-check-circle-fill me-3"></i>
                <div>
                    Kitap oluşturma işlemi başarılı. Yönlendiriliyorsunuz...
                </div>
            </div>
        )}
        {showErrorAlert && (
            <div className="alert alert-danger d-flex" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-3"></i>
                <div>Lütfen tüm alanları doldurun.</div>
            </div>
        )}
        <div className='create-story-page'>
            <div className="container mt-5 mb-5">
                <div className="create-story-title">
                    <h2 className='text-center'>Hikaye Oluştur</h2>
                    <span >
                        <i className='text-center'>
                        Kitabınızın başlık, açıklama, kategori gibi bilgilerini girin ve bir kapak resmi yükleyin. Etiketler ekleyerek kitabınızı daha görünür hale getirebilirsiniz. Tüm alanları doldurduğunuzda kitabınızı kaydedebilirsiniz.
                        </i>
                    </span>
                </div>
                <div className="create-story-main mt-5">
                    <div className="create-left">
                        {image ? (
                            <img 
                                src={typeof image === "string" ? image : URL.createObjectURL(image)}
                                alt="uploaded" 
                                width="200px" 
                                height="281px" 
                            />
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
                        <button onClick={() => document.getElementById('image-upload').click()}>Görsel Yükle <i className="bi bi-cloud-arrow-up-fill ms-1"></i></button>
                        {error && <p className='error-message-cover'>{error}</p>}
                        <i className='left-description'>Kitabınız için bir kapak resmi yükleyin. 
                            Bu, kitabınızın daha çekici görünmesini sağlayacaktır.
                        </i>
                    </div>
                    <div className="create-right">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Kitap Adı</Form.Label>
                                <Form.Control type="text" className='bg-transparent' value={bookTitle} onChange={(e) => setBookTitle(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Kitap Özeti</Form.Label>
                                <Form.Control className='bg-transparent' as="textarea" rows={4} value={bookSummary} onChange={(e) => setBookSummary(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Kategori</Form.Label>
                                <Form.Select 
                                    size='sm' 
                                    className='form-select-create bg-transparent'
                                    value={selectedCategory}  
                                    onChange={handleCategoryChange} 
                                >
                                    <option value="">Kategori Seçiniz...</option>
                                    {Array.isArray(category) && category.length > 0 ? (
                                        category.map((categories) => (
                                            <option key={categories.id} value={categories.id}>
                                                {categories.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Yükleniyor...</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                            <Form.Label>Sesli kitap mı?</Form.Label>
                            <Form.Group className="d-flex align-items-center mb-3">
                                <Form.Check
                                    type='radio'
                                    label='Evet'
                                    className='d-flex align-items-center gap-2 m-0 me-3 bg-transparent'
                                    checked={isAudioBook === true} 
                                    onChange={() => setIsAudioBook(true)}    
                                />
                                <Form.Check
                                    type='radio'
                                    label='Hayır'
                                    className='d-flex align-items-center gap-2 m-0 bg-transparent'
                                    checked={isAudioBook === false} 
                                    onChange={() => setIsAudioBook(false)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
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
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <span className='input-group-text span-plus' onClick={handleAddTag}>+</span>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Yaş Aralığı</Form.Label>
                                <Form.Select
                                    size='sm' 
                                    className='form-select-create bg-transparent'
                                    value={selectedAgeRange} 
                                    onChange={handleRangeChange} 
                                >
                                    <option value="">Yaş Aralığı Seçiniz...</option>
                                    {Array.isArray(ageRanges) && ageRanges.length > 0 ? (
                                        ageRanges.map((range) => (
                                            <option key={range.id} value={range.id}>
                                                {range.range}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Yükleniyor...</option>
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
                                <Form.Group className="mb-4">
                                    <Form.Label>Telif Hakkı</Form.Label>
                                    <Form.Select size='sm' className='form-select-create bg-transparent' value={contentChoice} onChange={handleContentChoiceChange}>
                                        <option value="" selected>Seçiniz...</option>
                                        {copyrightStatuses.map((status) => (
                                            <option key={status.id} value={status.id}>
                                                {status.copyright}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                
                                {showCopyrightAlert && contentChoice === "1" && (
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
                            <Button className='create-story-btn' type='submit'>Kaydet</Button>
                        </Form>
                    </div>
                </div>
            </div>
            {tagError && (
                <div className="error-message-cover error-message-bottom-left">
                    {tagError}
                </div>
            )}
        </div>
        </>
    )
}
export default CreateStory