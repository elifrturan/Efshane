import React from 'react';
import './Navbar.css'
import { Navbar, Nav, Dropdown, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function CustomNavbar() {
  const navigate = useNavigate();
  const username = "elifturan";

  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  }

  return (
    <>
      <Navbar expand="lg" className="px-4 custom-navbar">
        <Container>
          <Navbar.Brand href="/home" className='my-auto w-25'>
            <img
              src="/logo/logo.svg"
              alt="Logo"
              className="me-2"
              style={{ height: '40px' }}
            />
            <span className="fw-bold fs-5 ms-2">
              <span className="navbar-ef">EF</span>shane
            </span>
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
              <Dropdown align="end">
                <Dropdown.Toggle as="a" className="nav-link p-0 mx-2">
                  <img
                    src="/images/pp.jpg"
                    alt="Profil"
                    className="rounded-circle"
                    style={{ height: '40px', width: '40px', objectFit: 'cover' }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu className='navbar-dropdown'>
                  <Dropdown.Item href="/profile" className="text-muted" onClick={handleProfileClick}><i className="bi bi-person me-2"></i>Profilim</Dropdown.Item>
                  <Dropdown.Item href="/messages" className="text-muted"><i className="bi bi-chat me-2"></i>Mesajlar</Dropdown.Item>
                  <Dropdown.Item href="/library" className="text-muted"><i className="bi bi-book me-2"></i>Kitaplık</Dropdown.Item>
                  <Dropdown.Item href="/settings" className="text-muted"><i className="bi bi-gear me-2"></i>Ayarlar</Dropdown.Item>
                  <Dropdown.Item href="/contact-us" className="text-muted"><i className="bi bi-question-circle me-2"></i>Bize Ulaşın</Dropdown.Item>
                  <Dropdown.Item href="/logout" className="text-danger logout">
                    <i className="bi bi-box-arrow-left me-2"></i>Çıkış Yap
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default CustomNavbar;
