import React, { useState } from 'react'
import './AddVoice.css'
import AddCover from './addcover/AddCover';
import Details from './details/Details';
import Sections from './sections/Sections';

function AddVoice() {
    const [activeTab, setActiveTab] = useState('details');
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

    //düzenle kısmı için ama pop-up
    const handleAction = (action, sectionId) => {
        if (action === "delete") {
            setSectionToDelete(sectionId);
            setShowModal(true);
        } else if (action === "edit") {
            const section = sections.find((sec) => sec.id === sectionId);
            console.log("edit yapıcaz.");
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

    return (
        <div className="add-voice-section-page">
            <div className="container">
                <h2 className='text-center mt-5 mb-5'>Sesli Kitap Detay Sayfasına Hoş Geldiniz</h2>
                <div className="add-voice-section-main">
                    <div className="add-voice-section-left">
                        {/* Upload Cover */}
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
                        <button onClick={() => document.getElementById('image-upload').click()}>Görsel Yükle <i className="bi bi-cloud-arrow-up-fill ms-1"></i></button>
                        {error && <p className='error-message-cover'>{error}</p>}
                        <i className='left-description'>Kitabınız kapağını değiştirmek istiyorsanız
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
                            {activeTab === 'details' && <Details/>}
                            { /* Sections */ }
                            {activeTab === 'sections' && <Sections/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddVoice