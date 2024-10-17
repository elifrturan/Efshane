import React, { useState } from 'react'
import './PasswordRenewal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function PasswordRenewal() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className="password-container">
      <h2 className='text-center text-white'>Şifrenizi Yenileyin</h2>
      <p className='text-center text-white opacity-50'>
        Güvenli bir şifre belirleyin ve şifrenizi doğrulamak için aynı şifreyi iki kez girin. 
        Şifreniz en az 8 karakter, büyük ve küçük harf, sayı içermelidir.
      </p>
      <form>
      <div className="mb-3 input-group">
        <input
          type={showPassword ? "text" : "password"}
          name='password'
          id='password'
          className='form-control text-white bg-transparent'
          placeholder='Şifre'
        />
        <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
      </div>
      <div className="mb-3 input-group">
        <input
          type={showPassword ? "text" : "password"}
          name='password'
          id='password'
          className='form-control text-white bg-transparent'
          placeholder='Şifre Tekrar'
        />
        <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
      </div>
      </form>
      <Link className='btn btn-register' to="/signin">Şifreyi Yenile</Link>
    </div>
  )
}

export default PasswordRenewal