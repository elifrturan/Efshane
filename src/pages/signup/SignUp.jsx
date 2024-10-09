import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SignUp.css'
import { Link } from 'react-router-dom';

function SignUp() {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className="signup-container">
      <h1 className="text-start text-white">Kayıt Ol</h1>
      <p className='text-start text-white'>Zaten bir hesabın var mı? <Link className='subtitle text-decoration-none' to='/signin'>Giriş Yap</Link></p>
      <form>
        <div className="mb-3">
          <input type="email" name="email" id="email" className='form-control text-white bg-transparent' placeholder='Email'/>
        </div>
        <div className="mb-3">
          <input type="text" name='username' id='username' className='form-control text-white bg-transparent' placeholder='Kullanıcı Adı' />
        </div>
        <div className="mb-3">
          <input type="text" name="birthdate" id="birthdate" className='form-control text-white bg-transparent' placeholder='Doğum Tarihi'/>
        </div>
        <div className="mb-3 input-group">
          <input 
              type={showPassword ? "text" : "password"} 
              name='password' 
              id='password' 
              className='form-control text-white bg-transparent' 
              placeholder='Şifre' />
            <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
        </div>
        <div className="mb-3 input-group">
          <input 
            type={showPassword ? "text" : "password"}
            name='passwordagain'
            id='passwordagain'
            className='form-control text-white bg-transparent'
            placeholder='Şifre tekrar' />
            <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
        </div>
        <div className="mb-3 form-check d-flex align-items-center">
          <input type="checkbox" name="checkbox" id="checkbox" className='form-check-input bg-transparent me-2'/>
          <label className='text-white'><Link className='label-link'>Şartlar & Koşullar ‘ı</Link> kabul ediyorum</label>
        </div>
        <div className="mb-3">
          <button className='btn-register fw-bold'>Kayıt Ol</button>
        </div>
      </form>
      <div className="mt-2 row">
        <div className="google d-flex justify-content-center align-items-center col me-2">
          <span className='text-white'><i class="bi bi-google me-1"></i>Google</span>
        </div>
        <div className="apple d-flex justify-content-center align-items center col ms-2">
          <span className="text-white"><i class="bi bi-apple me-1"></i>Apple</span>
        </div>
      </div>
    </div>
  )
}

export default SignUp