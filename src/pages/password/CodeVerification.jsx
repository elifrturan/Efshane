import React, { useState, useEffect } from 'react';
import './CodeVerification.css';
import axios from 'axios'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';

function CodeVerification() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const [code, setCode] = useState(['', '', '', '', '']); 
    const navigate = useNavigate(); 
    const [isSending, setIsSending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); 

    const handleChange = (e, index) => {
        const value = e.target.value;
        const newCode = [...code];
        newCode[index] = value;

        setCode(newCode);

        if (value && index < code.length - 1) {
            const nextInput = document.querySelector(`input[name='code-${index + 1}']`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const fullCode = code.join('');
        try {
            const response = await axios.post('http://localhost:3000/mail/verifyCode', {
                email,  
                code: fullCode
            });
            console.log('Kod doğrulama başarılı:', response.data);
            alert('Kod doğrulama başarılı!');
            navigate(`/emailconfirm/codeverification/passwordrenewal?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.log('Kod doğrulama başarısız:', error);
            alert('Kod doğrulama başarısız, lütfen tekrar deneyin.');
        }

    };

    const resendCode = async () => {
        setIsSending(true); 
        try {
            const response = await axios.post('http://localhost:3000/mail/sendCode', {
                email
            });
            console.log('Kod başarıyla tekrar gönderildi:', response.data);
            alert('Doğrulama kodu başarıyla gönderildi.');
            setTimeLeft(120); 
        } catch (error) {
            console.log('Kod gönderme başarısız:', error);
            alert('Kod gönderme başarısız, lütfen tekrar deneyin.');
        } finally {
            setIsSending(false); 
        }
   };

        useEffect(() => {
            if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000); 
        return () => clearTimeout(timer); // Bellek sızıntılarını önlemek için temizleme
        }
    }, [timeLeft]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    return (
        <div className="code-page">
            <div className="code-container">
                <h2 className='text-center text-white'>Doğrulama Kodu Girin</h2>
                <p className='text-center text-white opacity-50'>
                    E-posta adresinize gönderilen doğrulama kodunu aşağıya girin. 
                    Bu adımı tamamladıktan sonra şifrenizi sıfırlayabileceksiniz.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className='d-flex justify-content-center align-items-center mb-3'>
                        <div className="d-flex gap-2 box">
                            {code.map((digit, index) => (
                                <input 
                                    key={index}
                                    type="text" 
                                    maxLength="1" 
                                    className='form-control text-center bg-transparent text-white me-2'
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    name={`code-${index}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <p className='text-start text-white'>
                                <Link className='subtitle text-white' onClick={resendCode} disabled = {isSending}>
                                {isSending ? 'Kod gönderiliyor...' : 'Kodu tekrar gönder'}
                                </Link>
                            </p>
                        </div>
                        <div>
                            <h6 className='text-white'>{formatTime(timeLeft)}</h6>
                        </div>
                    </div>
                    
                    <Link className='btn btn-verify text-center' onClick={handleSubmit} >Kodu Doğrula</Link>
                </form>
            </div>
        </div>
    );
}

export default CodeVerification;
