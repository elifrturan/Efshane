import React, { useState } from 'react';
import './ContactUs.css';
import axios from 'axios';

function ContactUs() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem('token'); // Token'ı localStorage'dan al
            const response = await axios.post('http://localhost:3000/mail/contactUs', {
                email,
                title,
                description
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Token'ı gönder
                }
            });
    
            console.log('Mail gönderme işlemi başarılı:', response.data);
            alert("Mail başarıyla gönderildi!");
            setEmail('');
            setTitle('');
            setDescription('');
            setError(null); 
        } catch (error) {
            console.error('Mail gönderme işlemi başarısız:', error.response?.data || error.message);
            setError('Mail gönderme işlemi başarısız, lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="contact-us mt-3">
            <div className="container">
                <div className="row">
                    <div className="contact-us-div col-lg-6 col-md-5 col-sm-5 col-xs-6">
                        <div className="contact-us-title mb-3">
                            <h3 className='mb-3'>Bize Ulaşın</h3>
                            <p>
                                <b>Sorularınız mı var? Bize ulaşın! </b>
                                Herhangi bir soru, öneri ya da geri bildiriminiz varsa, 
                                lütfen aşağıdaki formu doldurarak bize iletin. Size en kısa sürede geri dönüş yapacağız.
                            </p>
                        </div>
                        <div className="contact-us-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className='form-label'>Email</label>
                                    <input type="email" className='form-control bg-transparent' name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className='form-label'>Başlık</label>
                                    <input type="text" className='form-control bg-transparent' name="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                                </div>
                                <div className="mb-3">
                                    <label className='form-label'>Açıklama</label>
                                    <textarea name="description" className='form-control bg-transparent' rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>
                                <div className="mb-3">
                                    <button type="submit" className='btn btn-contact-us mb-3'>Gönder</button>
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                            </form>
                        </div>
                    </div>
                    <div className="contact-us-image col-lg-5 col-md-6 col-sm-6 col-xs-6 ms-5 mt-3 d-flex justify-content-center align-items-center">
                        <img src="/images/contact-us.png" alt="" className='ms-5 contact-image' width="340px" height="280px"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
