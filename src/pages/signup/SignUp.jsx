import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SignUp.css'
import { Link } from 'react-router-dom';
import axios from 'axios'; 

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (password !== passwordAgain) {
      alert('Şifreler eşleşmiyor!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        email,
        username,
        birthdate,
        password
      });

      console.log('Kayıt başarılı:', response.data);
      alert('Kayıt başarılı!');
    } catch (error) {
      console.error('Kayıt başarısız:', error);
      alert('Kayıt başarısız, lütfen tekrar deneyin.');
    }
  }

  return (
    <div className="signup-container">
      <h1 className="text-start text-white">Kayıt Ol</h1>
      <p className='text-start text-white'>Zaten bir hesabın var mı? <Link className='subtitle text-decoration-none' to='/signin'>Giriş Yap</Link></p>
      <form onSubmit={handleSubmit}> {}
        <div className="mb-3">
          <input
            type="email"
            name="email"
            id="email"
            className='form-control text-white bg-transparent'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name='username'
            id='username'
            className='form-control text-white bg-transparent'
            placeholder='Kullanıcı Adı'
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="mb-3 date-picker">
          <input
            type="date" 
            name="birthdate"
            id="birthdate"
            className='form-control text-white bg-transparent'
            placeholder='Doğum Tarihi'
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)} 
          />
        </div>
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
            name='passwordagain'
            id='passwordagain'
            className='form-control text-white bg-transparent'
            placeholder='Şifre tekrar'
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)} 
          />
          <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
        <div className="mb-3">
          <button className='btn-register fw-bold' type="submit">Kayıt Ol</button>
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

export default SignUp;
