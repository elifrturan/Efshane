import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SingIn.css'
import { Link } from 'react-router-dom';
import axios from 'axios'; 

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      });

      console.log('Giriş başarılı:', response.data);
      alert('Giriş başarılı!');
    } catch (error) {
      console.error('Giriş başarısız:', error);
      alert('Giriş başarısız, lütfen tekrar deneyin.');
    }
  }

  return (
    <div className="signin-container">
      <h1 className="text-start text-white">Giriş Yap</h1>
      <p className='text-start text-white'>Henüz bir hesabın yok mu? <Link className='subtitle text-decoration-none' to='/signup'>Kayıt Ol</Link></p>
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
        <div className="mb-3">
          <button className='btn-register fw-bold' type="submit">Giriş Yap</button>
        </div>
      </form>
    </div>
  )
}

export default SignIn;
