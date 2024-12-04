import React, { useState } from 'react'
import './AddCover.css'

function AddCover() {
    const [image, setImage] = useState('/images/book2.jpeg');
    const [error, setError] = useState("");

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
  return (
    <>
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
        <i className='voice-left-description'>
            Kitabınız kapağını değiştirmek istiyorsanız
            görsel yükle butonuna tıklamanız yeterli olacaktır.
        </i>
    </>
  )
}

export default AddCover