import React, { useState } from 'react'
import axios from'axios' 
import './PasswordRenewal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, InputGroup, Alert } from 'react-bootstrap';

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
  const [error, setError] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }
    
    try {
      const response = await axios.put('http://localhost:3000/users', {
        email,
        pass: password
      });
      navigate(`/emailconfirm/codeverification/passwordrenewal?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setError('Şifre güncelleme işlemi başarısız, lütfen tekrar deneyin.');
    }
  }

  return (
    <div className="password-page">
      <div className="password-container">
        <h2 className='text-center'>Şifrenizi Yenileyin</h2>
        <p className='text-center opacity-50'>
          Güvenli bir şifre belirleyin ve şifrenizi doğrulamak için aynı şifreyi iki kez girin. 
          Şifreniz en az 8 karakter, büyük ve küçük harf, sayı içermelidir.
        </p>

        {/* Hata Mesajı */}
        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <i className="bi bi-info-circle-fill me-2"></i> {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}> {}
          <InputGroup className="mb-3">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name='password'
              id='password'
              placeholder='Yeni şifrenizi giriniz'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name='confirmPassword' 
              id='confirmPassword'
              placeholder='Şifre Tekrar'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </InputGroup>
        </Form>
        <Link className='btn btn-register' to='/signin' onClick={handleSubmit} >Şifreyi Yenile</Link>
      </div>
    </div>
  )
}
export default PasswordRenewal