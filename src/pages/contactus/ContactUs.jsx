import React, { useState } from 'react'
import './ContactUs.css'
import Navbar from "../../layouts/navbar/Navbar"
import Footer from "../../layouts/footer/Footer"
import { Button, Form } from 'react-bootstrap';

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
        <>
            <Navbar/>
            <main>
                <div className="contact-us mt-5">
                    <div className="container">
                        <h1 className='mb-4 text-center'>Bize Ulaşın</h1>
                        <div className="contact-us-main mx-5">
                            <div className="contact-us-left">
                                <div className="contact-us-div me-5 mt-5">
                                    <div className="contact-us-title mb-3">
                                        <p>
                                            <b>Sorularınız mı var? Bize ulaşın! </b>
                                            Herhangi bir soru, öneri ya da geri bildiriminiz varsa, 
                                            lütfen aşağıdaki formu doldurarak bize iletin. Size en kısa sürede geri dönüş yapacağız.
                                        </p>
                                    </div>
                                    <div className="contact-us-body">
                                        <Form onSubmit={handleSubmit} className='text-body-secondary'>
                                            <Form.Group className="mb-3">
                                                <Form.Label>E-posta Adresi</Form.Label>
                                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Başlık</Form.Label>
                                                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Açıklama</Form.Label>
                                                <Form.Control as="textarea" rows={4} value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                                            </Form.Group>
                                            <div className="mb-4 mt-4 btn-contact-us">
                                                <Button type="submit">Gönder</Button>
                                            </div>
                                            {error && <div className="alert alert-danger">{error}</div>}
                                        </Form>
                                    </div>
                                </div>
                            </div>
                            <div className="contact-us-right mt-5">
                                    <div className="contact-us-frame-title mb-4">
                                        <h5>İletişim Bilgileri</h5>
                                        <span>
                                            Sizden haber almaktan mutluluk duyarız. 
                                            Dost canlısı ekibimiz her zaman sohbet etmek için burada.
                                        </span>
                                    </div>
                                    <div className="contact-us-frame-body">
                                        <div className="contact-us-frame-row mb-4">
                                            <i class="bi bi-envelope-fill me-3"></i>
                                            <span>efshaneapp@gmail.com</span>
                                        </div>
                                        <div className="contact-us-frame-row mb-4">
                                            <i class="bi bi-telephone-fill me-3"></i>
                                            <span>0555 555 5555</span>
                                        </div>
                                        <div className="contact-us-frame-row mb-3 d-flex">
                                            <i class="bi bi-geo-alt-fill me-3"></i>
                                            <iframe 
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3118.9025843494437!2d26.96120287573313!3d38.58209107179305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbce0d70291201%3A0xc309f7e92ee72bd9!2zxLB6bWlyIEJha8SxcsOnYXkgw5xuaXZlcnNpdGVzaQ!5e0!3m2!1str!2str!4v1732973810418!5m2!1str!2str" 
                                                width="400" 
                                                height="250"  
                                                allowfullscreen="" 
                                                loading="lazy" 
                                                style={{ border: 0 }}
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
}

export default ContactUs