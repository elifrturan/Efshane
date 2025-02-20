import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './SingIn.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { Form, InputGroup, Modal, Button } from 'react-bootstrap';

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

    const savedPassword = localStorage.getItem(`passwordFor_${enteredEmail}`);
    if (savedPassword) {
      setPassword(savedPassword);
      setRememberMe(true);
    } else {
      setPassword(""); 
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
      navigate('/home');
    } catch (error) {
      console.error('Giriş başarısız:', error.response?.data || error.message);
      setError('Giriş başarısız, lütfen tekrar deneyin.');
      setShowModal(true);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h1 className="text-start">Giriş Yap</h1>
        <div className='d-flex justify-content-start align-items-center mb-3 have-account'>
          <span>Henüz bir hesabın yok mu?</span>
          <Link className='subtitle text-decoration-none ms-1' style={{fontWeight: '600'}} to='/signup'>
            Kayıt Ol
          </Link>
        </div>
        
        {/* form */}
        <Form onSubmit={handleSubmit}> 
          <Form.Control
            type="email"
            name="email"
            id="email"
            className='mb-3'
            placeholder='Email'
            value={email}
            onChange={handleEmailChange} 
          />
          <InputGroup className="mb-3">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name='password'
              id='password'
              placeholder='Şifre'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </InputGroup>

          {/* remember me and forget password*/}
          <Form.Group className="mb-3 d-flex justify-content-between">
            <div>
              <Form.Check 
                type="checkbox" 
                label="Beni Hatırla" 
                id='checkbox' 
                checked={rememberMe} 
                onChange={() => setRememberMe(!rememberMe)}
              />
            </div>
            <div>
              <Link className='text-decoration-none forgot-password' to='/emailconfirm'>Şifremi Unuttum?</Link>
            </div>
          </Form.Group>

          {/* button */}
          <button className='btn btn-login mb-2'>Giriş Yap</button>
        </Form>

        {/* Modal Popup */}
        <Modal show={showModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Giriş Hatası</Modal.Title> 
            </Modal.Header>
            <Modal.Body>
              <span>{error}</span>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShowModal(false)}>Tamam</Button>
            </Modal.Footer>
          </Modal>
      </div>
    </div>
  )
}

export default SignIn;
