import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './SingIn.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

function SignIn() {
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  
  const handleEmailChange = (e) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);

    // Eğer bu e-posta için kayıtlı bir şifre varsa, şifreyi otomatik doldur
    const savedPassword = localStorage.getItem(`passwordFor_${enteredEmail}`);
    if (savedPassword) {
      setPassword(savedPassword);
      setRememberMe(true); // Eğer şifre kayıtlıysa, "Beni Hatırla" kutusu işaretli hale gelsin
    } else {
      setPassword(""); // Şifre yoksa, şifre alanını boşalt
      setRememberMe(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const token = response.data.accessToken;
      localStorage.setItem('token', typeof token === "object" ? JSON.stringify(token) : token);

      if (rememberMe) {
        localStorage.setItem(`passwordFor_${email}`, password);
      } else {
        localStorage.removeItem(`passwordFor_${email}`);
      }

      navigate(`/home`);
    } catch (error) {
      console.error('Giriş başarısız:', error.response?.data || error.message);
      setError('Giriş başarısız, lütfen tekrar deneyin.');
      setShowModal(true);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h1 className="text-start text-white">Giriş Yap</h1>
        <p className='text-start text-white'>Henüz bir hesabın yok mu? <Link className='subtitle text-decoration-none' to='/signup'>Kayıt Ol</Link></p>
        
        {/* form */}
        <form onSubmit={handleSubmit}> 
          <div className="mb-3">
            <input
              type="email"
              name="email"
              id="email"
              className='form-control text-white bg-transparent'
              placeholder='Email'
              value={email}
              onChange={handleEmailChange} 
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

          {/* remember me and forget password*/}
          <div className="mb-3 rememberforget d-flex justify-content-between">
            <div className="rememberMe">
              <div className="form-check d-flex flex-row align-items-center">
                <input type="checkbox" className='form-check-input bg-transparent me-2' id='checkbox' checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}/>
                <label className='form-check-label text-white'>Beni Hatırla</label>
              </div>
            </div>
            <div className="forgetpassword col-lg-6 col-md-6 col-xs-6 text-end">
              <Link className='text-decoration-none text-white' to='/emailconfirm'>Şifremi Unuttum?</Link>
            </div>
          </div>

          {/* button */}
          <button type="submit" className='btn btn-login mb-2'>Giriş Yap</button>

          {error && <p className="text-danger">{error}</p>}
        </form>

        {/* Modal Popup */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <FontAwesomeIcon icon={faTimesCircle} className="modal-icon" />
              <h2>Giriş Hatası</h2>
              <p>{error}</p>
              <button className="modal-button" onClick={() => setShowModal(false)}>Tamam</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignIn;
