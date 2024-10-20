import React, { useState } from 'react';
import axios from 'axios'; 
import './EmailConfirm.css';
import { useNavigate, Link } from 'react-router-dom'; 

function EmailConfirm() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {
            const response = await axios.post('http://localhost:3000/mail/sendCode', {
                email
            });
            console.log('E-posta gönderme işlemi başarılı:', response.data);
            alert('E-posta gönderme işlemi başarılı!');
            navigate(`/emailconfirm/codeverification?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.log('E-posta gönderme işlemi başarısız:', error);
            alert('E-posta gönderme işlemi başarısız, lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="confirm-page">
            <div className="email-container">
                <h2 className='text-center text-white'>Şifrenizi Yenileyin</h2>
                <p className='text-white text-center opacity-50'>E-posta adresinizi girerek şifre yenileme talebinde bulunun. 
                    Size gönderilecek doğrulama koduyla şifrenizi kolayca sıfırlayabilirsiniz.
                </p>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        name='email' 
                        id='email' 
                        className='form-control bg-transparent text-white mb-3' 
                        placeholder='Email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <Link className='btn btn-confirm' onClick={handleSubmit}>Şifre Sıfırlama E-Postası Gönder</Link>
                </form>
            </div>
        </div>
    );
}

export default EmailConfirm;
