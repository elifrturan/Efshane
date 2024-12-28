import React, { useState, useEffect } from 'react'
import './AddPost.css'
import { Button } from 'react-bootstrap';
import axios from 'axios';

function AddPost({ onNewPost }) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null); 

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3000/feed/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUserProfile(response.data); 
            } catch (err) {
                console.error('Profil bilgisi alınamadı:', err);
            }
        };
        fetchUserProfile();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setImageFile(file); 
        }
    };

    const handleImageClick = () => {
        document.getElementById('image-upload-input').click();
    }

    const removeImage = () => {
        setImage(null);
        setImageFile(null);
    }

    const handleSubmit = async () => {
        if (!content.trim() && !imageFile) {
            alert('Lütfen bir içerik veya görsel ekleyin.');
            return;
        }
    
        setLoading(true);
    
        const formData = new FormData();
        formData.append('content', content);
        if (imageFile) {
            formData.append('image', imageFile);
        }
    
        try {
            const response = await axios.post('http://localhost:3000/feed/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, 
                },
            });
    
            if (response.status === 201) {
                const newPost = response.data;
                onNewPost(newPost);
                setContent('');
                setImage(null);
                setImageFile(null);
            }
        } catch (error) {
            console.error('Gönderi oluşturulurken bir hata oluştu:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };    

return (
    <div className="add-post">
        <div className="add-post-left">
            <img src={userProfile?.profile_image} alt="" width="40" height="40" className='rounded-circle object-fit-cover'/>
        </div>
        <div className="add-post-right">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Bir şeyler yaz..."
                disabled={loading}
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
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Gönderiliyor...' : 'Gönder'}
                </Button>
            </div>
        </div>
    </div>
)
}

export default AddPost