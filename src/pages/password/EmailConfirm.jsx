import React from 'react'
import './EmailConfirm.css'
import { Link } from 'react-router-dom'

function EmailConfirm() {
  return (
    <div className="email-container">
      <div className="row mt-0  mb-3 arrowLeft">
        <Link to='/signin'><i class="bi bi-arrow-left-circle-fill"></i></Link>
      </div>
      <h2 className='text-center text-white'>Şifrenizi Yenileyin</h2>
      <p className='text-white text-center opacity-50'>E-posta adresinizi girerek şifre yenileme talebinde bulunun. 
        Size gönderilecek doğrulama koduyla şifrenizi kolayca sıfırlayabilirsiniz.
      </p>
      <form>
        <input type="email" name='email' id='email' className='form-control bg-transparent text-white mb-3' placeholder='Email'/>
        <Link className='btn btn-confirm fw-bold' to='/emailconfirm/codeverification'>Şifre Sıfırlama E-Postası Gönder</Link>
      </form>
    </div>
  )
}

export default EmailConfirm