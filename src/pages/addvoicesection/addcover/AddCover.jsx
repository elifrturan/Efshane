import React, { useState } from 'react'
import './AddCover.css'

function AddCover() {
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
    <>
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
    </>
)
}

export default AddCover