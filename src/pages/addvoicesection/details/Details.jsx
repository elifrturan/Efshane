import React, { useState } from 'react'
import './Details.css'

function Details() {
    const [activeTab, setActiveTab] = useState('details');
    const [tags, setTags] = useState(["Roman", "Dram", "Gençlik"]);
    const [currentTag, setCurrentTag] = useState("");
    const [tagError, setTagError] = useState("");
    const [showCopyrightAlert, setShowCopyrightAlert] = useState(false);

    const [bookTitle, setBookTitle] = useState("Oyun Bitti");
    const [bookSummary, setBookSummary] = useState(
        `Bu kitap, hayallerini gerçekleştirmeye çalışan bir genç kızın hikayesini anlatır.`
    );
    const [selectedCategory, setSelectedCategory] = useState("Dram");
    const [selectedAgeRange, setSelectedAgeRange] = useState("13-17");
    const [copyright, setCopyright] = useState("book-own");  

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
  return (
    <>
        {activeTab === 'details' && (
            <div id="details" className={`voice-tab-pane ${activeTab === 'details' ? 'active' : ''}`}>
                <form className='m-0'>
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
                    <div className="mb-5 mt-4 d-flex justify-content-center">
                        <button className='add-voice-section-btn' type='submit'>Kaydet</button>
                    </div>
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