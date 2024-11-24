import React, { useEffect, useState } from 'react'
import './CreateStory.css'
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const [bookTitle, setBookTitle] = useState("");
    const [bookSummary, setBookSummary] = useState("");
    const [category, setCategory] = useState("");
    const [ageRange, setAgeRange] = useState("");
    const [isAudioBook, setIsAudioBook] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!bookTitle || !bookSummary || !category || !ageRange || isAudioBook === null || !contentChoice) {
            setShowErrorAlert(true);
            setShowSuccessAlert(false);
            window.scrollTo(0,0);
            return;
        }
        setShowErrorAlert(false);
        setShowSuccessAlert(true);
        window.scrollTo(0, 0);

        const formattedTitle = formatTitleForUrl(bookTitle);

        setTimeout(() => {
            setShowSuccessAlert(false);
            navigate(`/addsection/${formattedTitle}`);
        }, 3000);

    }

    const handleContentChoiceChange = (e) => {
        const selectedValue = e.target.value;
        setContentChoice(selectedValue);
        if (selectedValue === "book-own") {
            setShowCopyrightAlert(true);
        } else {
            setShowCopyrightAlert(false);
        }
    }

  return (
    <div className='create-story-page'>
        {showSuccessAlert && (
            <div className="alert alert-success d-flex" role="alert">
                <i class="bi bi-check-circle-fill me-3"></i>
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
                    <i className='left-description'>Kitabınız için bir kapak resmi yükleyin. 
                        Bu, kitabınızın daha çekici görünmesini sağlayacaktır.
                    </i>
                </div>
                <div className="create-right">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label className='form-label'>Kitap Adı</label>
                            <input type="text" className='form-control' value={bookTitle} onChange={(e) => setBookTitle(e.target.value)}/>
                        </div>
                        <div className="form-group mb-3">
                            <label className='form-label'>Kitap Özeti</label>
                            <textarea rows="4" className='form-control' value={bookSummary} onChange={(e) => setBookSummary(e.target.value)}/>
                        </div>
                        <div className="form-group mb-3">
                            <label className='form-label'>Kategori</label>
                            <select className='form-select form-select-sm form-select-create' value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option selected>Kategori Seçiniz...</option>
                                <option value="Romantik">Romantik</option>
                                <option value="Korku">Korku</option>
                                <option value="Mizah">Mizah</option>
                                <option value="Tarih">Tarih</option>
                                <option value="Bilim Kurgu">Bilim Kurgu</option>
                                <option value="Fantastik">Fantastik</option>
                            </select>
                        </div>
                        <label className='form-label'>Sesli kitap mı?</label>
                        <div className="form-group d-flex mb-3">
                            <div className="form-check">
                                <input type="radio" className='form-check-input' name="flexRadioDefault" id="flexRadioDefault1" checked={isAudioBook === true} onChange={() => setIsAudioBook(true)}/>
                                <label className='form-check-label'>Evet</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" className='form-check-input ms-1'  name="flexRadioDefault" id="flexRadioDefault2" checked={isAudioBook === false} onChange={() => setIsAudioBook(false)}/>
                                <label className='form-check-label'>Hayır</label>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label className='form-label'>Etiketler</label>
                            <div className="tags-container">
                                {tags.map((tag, index) => (
                                    <div className="tag-item" key={index}>
                                        <span className="tag-text">{tag}</span>
                                        <span className="remove-tag" onClick={() => handleRemoveTag(tag)}>x</span>
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
                            <select className='form-select form-select-sm form-select-create' value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
                                <option selected>Yaş Aralığı Seçiniz...</option>
                                <option value="0-12">0-12 Yaş</option>
                                <option value="13-17">13-17 Yaş</option>
                                <option value="18-35">18-35 Yaş</option>
                                <option value="35+">35+ Yaş</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className='form-label'>Telif Hakkı</label>
                            <select className='form-select form-select-sm form-select-create' value={contentChoice} onChange={handleContentChoiceChange}>
                                <option value="" selected>Seçiniz...</option>
                                <option value="book-own">© Kitabın içeriği tamamen bana aittir. Hiçbir dış kaynaktan alıntı yapılmamıştır.</option>
                                <option value="book-own-quotes">Kitap içeriği bana aittir, ancak bazı bölümler başka bir kaynaktan alıntı yapılmıştır. Alıntı yapılan kaynaklara gerekli atıflar yapılmıştır.</option>
                                <option value="book-copied-permission">Kitap içeriği başkalarından kopyalanmıştır, ancak kopyalanan içerikler için gerekli izinler alınmıştır.</option>
                                <option value="book-public-source">Kitap içeriği tamamen bana aittir, ancak bazı kısımlar kamuya açık kaynaklardan alınmış ve kaynakları belirtilmiştir.</option>
                                <option value="book-others-wrote">Kitap içeriği başka bir yazar tarafından yazılmıştır, ancak kullanmak için gerekli izinler alınmıştır.</option>
                            </select>
                        </div>
                        {showCopyrightAlert && contentChoice === "book-own" && (
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
                        <button className='create-story-btn' type='submit'>Kaydet</button>
                    </form>
                </div>
            </div>
        </div>
        {tagError && (
            <div className="error-message-cover error-message-bottom-left">
                {tagError}
            </div>
        )}
    </div>
  )
}

export default CreateStory