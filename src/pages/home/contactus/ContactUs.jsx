import React from 'react'
import './ContactUs.css'
import { Link } from 'react-router-dom'

function ContactUs() {
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
                    <form>
                        <div className="mb-3">
                            <label className='form-label'>Email</label>
                            <input type="email" className='form-control bg-transparent'/>
                        </div>
                        <div className="mb-3">
                            <label className='form-label'>Başlık</label>
                            <input type="text" className='form-control bg-transparent'/>
                        </div>
                        <div className="mb-3">
                            <label className='form-label'>Açıklama</label>
                            <textarea className='form-control bg-transparent' rows="3"></textarea>
                        </div>
                        <div className="mb-3">
                            <Link className='btn btn-contact-us mb-3'>Gönder</Link>
                        </div>
                    </form>
                </div>
            </div>
            <div className="contact-us-image col-lg-5 col-md-6 col-sm-6 col-xs-6 ms-5 mt-3 d-flex justify-content-center align-items-center">
                <img src="/images/contact-us.png" alt="" className='ms-5 contact-image' width="340px" height="280px"/>
            </div>
            </div>
        </div>
    </div>
  )
}

export default ContactUs