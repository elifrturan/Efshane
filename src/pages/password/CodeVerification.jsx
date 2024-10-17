import React from 'react'
import './CodeVerification.css'
import { Link } from 'react-router-dom'

function CodeVerification() {
  return (
    <div className="code-container">
      <h2 className='text-center text-white'>Doğrulama Kodu Girin</h2>
      <p className='text-center text-white opacity-50'>
        E-posta adresinize gönderilen doğrulama kodunu aşağıya girin. 
        Bu adımı tamamladıktan sonra şifrenizi sıfırlayabileceksiniz.
      </p>
      <div className='d-flex justify-content-center align-items-center mb-3'>
        <div className="d-flex gap-2 box">
          <input type="text" maxLength="1" className='form-control text-center bg-transparent text-white me-2'/>
          <input type="text" maxLength="1" className='form-control text-center bg-transparent text-white me-2'/>
          <input type="text" maxLength="1" className='form-control text-center bg-transparent text-white me-2'/>
          <input type="text" maxLength="1" className='form-control text-center bg-transparent text-white me-2'/>
          <input type="text" maxLength="1" className='form-control text-center bg-transparent text-white'/>
        </div>
      </div>
      <Link className='btn btn-verify text-center' to="/emailconfirm/codeverification/passwordrenewal">E-Posta Doğrula</Link>
    </div>
  )
}

export default CodeVerification