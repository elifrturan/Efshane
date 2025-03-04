import React, { useContext, useEffect, useState} from 'react';
import './Navbar.css'
import { Navbar, Nav, Dropdown, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../../User.Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../../contexts/ThemeContext';

const backendBaseUrl = 'http://localhost:3000';

function CustomNavbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate(); 
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/users/me/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Kullanıcılar alınamadı:', error);
        setUser(null);
      } finally {
      }
    };

    fetchUser();
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setUser(null); 
    navigate('/signin'); 
  };

  return (
    <>
      <Navbar expand="lg" className="px-4 custom-navbar">
        <Container>
          <Navbar.Brand href="/home" className='my-auto w-25'>
            <img
              src={theme === 'dark' ? '/logo/efshane_logo_dark.svg' : '/logo/efshane_logo.svg'}
              alt="Logo"
              className="object-fit-cover"
              style={{ width: '100px', height: '40px' }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className='mx-auto'>
                <Nav.Link href="/categories" className='mx-2'>Kategoriler</Nav.Link>
                <Nav.Link href="/feed" className='mx-2'>Akış</Nav.Link>
                <Nav.Link href="/createstory" className='mx-2'>Hikaye Oluştur</Nav.Link>
                <Nav.Link href="/my-stories" className='mx-2'>Hikayelerim</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Link href="/notifications" className="mx-2">
                <i className="bi bi-bell fs-5"></i>
              </Nav.Link>
              {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle as="a" className="nav-link p-0 mx-2">
                  <img
                    src={
                      user?.profile_image
                        ? user.profile_image.startsWith('uploads')
                          ? `${backendBaseUrl}/${user.profile_image}`
                          : user.profile_image
                        : '/images/user.jpeg' 
                    }
                    alt="Profil"
                    className="rounded-circle"
                    style={{ height: '40px', width: '40px', objectFit: 'cover' }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu className='navbar-dropdown'>
                  <Dropdown.Item href={`/profile/${user.username}`} className="icon-link icon-link-hover"><i className="bi bi-person me-1"></i>Profilim</Dropdown.Item>
                  <Dropdown.Item href="/messages" className="icon-link icon-link-hover"><i className="bi bi-chat me-1"></i>Mesajlar</Dropdown.Item>
                  <Dropdown.Item href="/book-case" className="icon-link icon-link-hover"><i className="bi bi-book me-1"></i>Kitaplık</Dropdown.Item>
                  <Dropdown.Item href="/settings" className="icon-link icon-link-hover"><i className="bi bi-gear me-1"></i>Ayarlar</Dropdown.Item>
                  <Dropdown.Item href="/contact-us" className="icon-link icon-link-hover"><i className="bi bi-question-circle me-1"></i>Bize Ulaşın</Dropdown.Item>
                  <Dropdown.Item  onClick={handleLogout}
                    className="logout icon-link icon-link-hover"
                  >
                    <i className="bi bi-box-arrow-left me-1"></i>Çıkış Yap
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              ) : ( 
              <Nav.Link href="/signin" className="mx-2">
                
              </Nav.Link>
            )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default CustomNavbar;
