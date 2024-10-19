import React, { useState } from 'react'
import axios from'axios' 
import './PasswordRenewal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function PasswordRenewal() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  if(!email) {
    alert("e posta yok");
    return;
  }
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (password !== confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      return;
    }
    
    console.log(email);
    try {
      const response = await axios.put('http://localhost:3000/users', {
        email,
        pass: password
      });
      console.log('Şifre güncelleme işlemi başarılı:', response.data);
      alert('Şifre güncelleme işlemi başarılı!');
      navigate(`/emailconfirm/codeverification/passwordrenewal?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.log('Şifre güncelleme işlemi başarısız:', error);
      alert('Şifre güncelleme işlemi başarısız, lütfen tekrar deneyin.');
    }
  }

  return (
    <div className="password-container">
      <h2 className='text-center text-white'>Şifrenizi Yenileyin</h2>
      <p className='text-center text-white opacity-50'>
        Güvenli bir şifre belirleyin ve şifrenizi doğrulamak için aynı şifreyi iki kez girin. 
        Şifreniz en az 8 karakter, büyük ve küçük harf, sayı içermelidir.
      </p>
      <form onSubmit={handleSubmit}> {}
      <div className="mb-3 input-group">
        <input
          type={showPassword ? "text" : "password"}
          name='password'
          id='password'
          className='form-control text-white bg-transparent'
          placeholder='Şifre'
          value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
      </div>
      <div className="mb-3 input-group">
      <input
        type={showPassword ? "text" : "password"}
        name='confirmPassword' 
        id='confirmPassword'
        className='form-control text-white bg-transparent'
        placeholder='Şifre Tekrar'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
        <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
      </div>
      </form>
      <Link className='btn btn-register' to='/signin' onClick={handleSubmit} >Şifreyi Yenile</Link>
    </div>
  )
}
export default PasswordRenewal