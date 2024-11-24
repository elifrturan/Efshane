import React, { useState } from 'react'
import './AddSection.css'

function AddSection() {
    const [image, setImage] = useState('/images/book2.jpeg');
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState('details');
    const [tags, setTags] = useState(["Roman", "Dram", "Gençlik"]);
    const [currentTag, setCurrentTag] = useState("");
    const [tagError, setTagError] = useState("");
    const [showCopyrightAlert, setShowCopyrightAlert] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);

    const [sections, setSections] = useState ([
        {
            id: 1,
            sectionName: "1. Bölüm",
            readCount: "1.5K",
            likeCount: "500",
            commentCount: "12",
            onPublished: true
        },
        {
            id: 2,
            sectionName: "2. Bölüm",
            readCount: "1.3K",
            likeCount: "430",
            commentCount: "20",
            onPublished: false
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

    const toggleDropdown = (id) => {
        setDropdownVisible(prev => (prev === id ? null : id));
    };

    const handleAction = (action, sectionId) => {
        if (action === "delete") {
            setSectionToDelete(sectionId);
            setShowModal(true);
        } 
    };

    const handleDeleteConfirm = () => {
        setSections(sections.filter((section) => section.id !== sectionToDelete));
        setShowModal(false);
        setSectionToDelete(null);
    };
    
    const handleDeleteCancel = () => {
        setShowModal(false);
        setSectionToDelete(null);
    };

  return (
    <div className="addsection-page">
        <div className="container">
            <h2 className='text-center mt-5 mb-5'>Kitap Detay Sayfasına Hoş Geldiniz</h2>
            <div className="add-section-main">
                <div className="add-section-left">
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
                    <i className='left-description'>Kitabınız kapağını değiştirmek istiyorsanız
                        görsel yükle butonuna tıklamanız yeterli olacaktır.
                    </i>
                </div>
                <div className="add-section-right">
                    {/* Sekmeler */}
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
                    {/* İçerik */}
                    <div className="tab-content">
                        {/* Details */}
                        {activeTab === 'details' && (
                            <div id="details" className={`tab-pane ${activeTab === 'details' ? 'active' : ''}`}>
                                <form>
                                    <div className="form-group mb-3">
                                        <label className='form-label'>Kitap Adı</label>
                                        <input 
                                            type="text" 
                                            className='form-control'
                                            value={bookTitle}
                                            onChange={(e) => setBookTitle(e.target.value)}/>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className='form-label'>Kitap Özeti</label>
                                        <textarea 
                                            rows="4" 
                                            className='form-control'
                                            value={bookSummary}
                                            onChange={(e) => setBookSummary(e.target.value)}/>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className='form-label'>Kategori</label>
                                        <select 
                                            className='form-select form-select-sm form-select-create'
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
                                        </select>
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
                                                placeholder='Etiket ekleyiniz...'
                                                value={currentTag}
                                                onChange={(e) => setCurrentTag(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <span 
                                                className='input-group-text span-plus' 
                                                onClick={handleAddTag}>+</span>
                                        </div>
                                        
                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>Yaş Aralığı</label>
                                        <select 
                                            className='form-select form-select-sm form-select-create'
                                            value={selectedAgeRange}
                                            onChange={(e) => setSelectedAgeRange(e.target.value)}
                                        >
                                            <option selected>Yaş Aralığı Seçiniz...</option>
                                            <option value="0-12">0-12 Yaş</option>
                                            <option value="13-17">13-17 Yaş</option>
                                            <option value="18-35">18-35 Yaş</option>
                                            <option value="35+">35+ Yaş</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>Telif Hakkı</label>
                                        <select 
                                            className='form-select form-select-sm form-select-create'
                                            value={copyright}
                                            onChange={handleContentChoiceChange}
                                        >
                                            <option value="book-own">© Kitabın içeriği tamamen bana aittir. Hiçbir dış kaynaktan alıntı yapılmamıştır.</option>
                                            <option value="book-own-quotes">Kitap içeriği bana aittir, ancak bazı bölümler başka bir kaynaktan alıntı yapılmıştır. Alıntı yapılan kaynaklara gerekli atıflar yapılmıştır.</option>
                                            <option value="book-copied-permission">Kitap içeriği başkalarından kopyalanmıştır, ancak kopyalanan içerikler için gerekli izinler alınmıştır.</option>
                                            <option value="book-public-source">Kitap içeriği tamamen bana aittir, ancak bazı kısımlar kamuya açık kaynaklardan alınmış ve kaynakları belirtilmiştir.</option>
                                            <option value="book-others-wrote">Kitap içeriği başka bir yazar tarafından yazılmıştır, ancak kullanmak için gerekli izinler alınmıştır.</option>
                                        </select>
                                    </div>
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
                                    <button className='add-section-btn mb-3' type='submit'>Kaydet</button>
                                </form>
                            </div>
                        )}
                        {activeTab === 'sections' && (
                            <div id="sections" className={`tab-pane ${activeTab === 'sections' ? 'active' : ''}`}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6>{sections.length} adet bölüm</h6>
                                    <button className='add-new-section-btn'>Yeni Bölüm Ekle</button>
                                </div>
                                {sections.map(section => (
                                    <div className="section-row d-flex justify-content-between align-items-center" key={section.id}>
                                        <span>{section.sectionName}</span>
                                        <div className="istatistic d-flex me-3">
                                            <p><i className="bi bi-eye-fill me-1"></i>{section.readCount}</p>
                                            <p><i className="bi bi-balloon-heart-fill ms-4 me-1"></i>{section.likeCount}</p>
                                            <p><i className="bi bi-chat-heart-fill ms-4 me-1"></i>{section.commentCount}</p>
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
                                                    {section.onPublished ? (
                                                        <button
                                                            className="dropdown-item dropdown-item-section"
                                                            onClick={() => handleAction('unpublish', section.id)}
                                                        >
                                                            Yayından Kaldır
                                                        </button>
                                                        ) : (
                                                        <button
                                                            className="dropdown-item dropdown-item-section"
                                                            onClick={() => handleAction('publish', section.id)}
                                                        >
                                                            Yayınla
                                                        </button>
                                                    )}
                                                    <button 
                                                        className="dropdown-item dropdown-item-section" 
                                                        onClick={() => handleAction('delete', section.id)}
                                                        data-bs-toggle="modal" 
                                                        data-bs-target="#exampleModal"
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
        {tagError && (
            <div className="error-message-cover error-message-bottom-left">
                {tagError}
            </div>
        )}
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