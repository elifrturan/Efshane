import React, { useState } from 'react'
import './AddPost.css'
import { Button } from 'react-bootstrap';

function AddPost() {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if(file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    }

    const handleImageClick = () => {
        document.getElementById('image-upload-input').click();
    }

    const removeImage = () => {
        setImage(null);
    }

  return (
    <div className="add-post">
        <div className="add-post-left">
            <img src="/images/pp.jpg" alt="" width="40" height="40" className='rounded-circle object-fit-cover'/>
        </div>
        <div className="add-post-right">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Bir şeyler yaz..."
            >
                {content}
            </textarea><hr />
            {image && (
                <div className="upload-image-div position-relative">
                    <img src={image} className='upload-image rounded'/>
                    <button
                        className='remove-image-button'
                        onClick={removeImage}
                    >
                        x
                    </button>
                </div>
            )}
            <div className="down">
                <p onClick={handleImageClick}><i className="bi bi-images"></i> <span className='ms-2'>Görsel Ekle</span></p>
                <input
                    type='file'
                    id='image-upload-input'
                    accept='images/*'
                    onChange={handleImageUpload}
                />
                <Button>Gönder</Button>
            </div>
        </div>
    </div>
  )
}

export default AddPost