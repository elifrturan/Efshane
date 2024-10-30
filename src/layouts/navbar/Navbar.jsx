import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MainLayouts() {
  const [isStoryDropdownOpen, setStoryDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdonwOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Profil bilgisi alınırken hata oluştu:", error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  const toggleStoryDropdown = () => {
    setStoryDropdownOpen(!isStoryDropdownOpen);
    setProfileDropdonwOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdonwOpen(!isProfileDropdownOpen);
    setStoryDropdownOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  
  const handleLogoClick = () => {
    navigate("/home");
  }

  return (
      <div className="nav-row">
        <div className="container">
          <div className="main-nav nav">
          <div className="left">
            <div className="logo p-0 m-0">
              <img src="/logo/logo.svg" alt="logo" width="55px" height="55px" onClick={handleLogoClick}/>
            </div>
            <div className="categories-stream ms-5">
              <NavLink className="categories-stream-nav" to="/categories">Kategoriler</NavLink>
              <NavLink className="categories-stream-nav">Akış</NavLink>
            </div>
          </div>
          <div className="center">
            <input type="search" className='form-control bg-transparent search' placeholder='Ara...'/>
          </div>
          <div className="right">
              <div className="menu-icon">
                <i className="bi bi-list" onClick={toggleMenu}></i>
              </div>

              {isMenuOpen && (
                <div className="dropdown-menu-custom">
                  <ul>
                    <li>
                      <NavLink to="/categories">Kategoriler</NavLink>
                    </li>
                    <li>
                      <NavLink to="/stream">Akış</NavLink>
                    </li>
                    <li>
                      <Link onClick={toggleStoryDropdown}>Hikaye Yaz</Link>
                      {isStoryDropdownOpen && (
                        <ul>
                          <li><a href="#">Hikaye Oluştur</a></li>
                          <li className='myStories'><a href="#">Hikayelerim</a></li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <a href="">Bildirimler</a>
                    </li>
                    <li>
                      <Link onClick={toggleProfileDropdown}>
                        <img
                          src={profile?.profile_image}
                          alt="Profile"
                          width="40px"
                          height="40px"
                          className="img-fuild rounded-circle"
                        />
                      </Link>
                      {isProfileDropdownOpen && (
                        <ul>
                          <li><a href="#">Profilim</a></li>
                          <li><a href="#">Mesajlar</a></li>
                          <li><a href="#">Kitaplık</a></li>
                          <li><a href="#">Ayarlar</a></li>
                          <li><a href="#">Çıkış Yap</a></li>
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
              )}
              <div className="write-story">
                <div className="dropdown-center">
                  <Link 
                  className="write-dropdown-toggle "
                  onClick={toggleStoryDropdown}
                  aria-expanded={isStoryDropdownOpen}>
                    Hikaye Yaz
                  </Link>
                  <ul className={`write-story dropdown-menu ${isStoryDropdownOpen ? 'show' : ''}`} aria-labelledby="storyDropdown">
                    <div className="story-dropdown-arrow"></div>
                    <li><a className="dropdown-item" href="#">Hikaye Oluştur</a></li>
                    <li className='myStories'><a className="dropdown-item" href="#">Hikayelerim</a></li>
                  </ul>
                </div>
              </div>
              <div className="notification">
                <i className="bi bi-bell-fill"></i>
              </div>
              <div className="profile-dropdown">
                <div className="dropdown-center">
                    <Link 
                    className="profile-dropdown-toggle"
                    onClick={toggleProfileDropdown}
                    aria-expanded={isProfileDropdownOpen}>
                      <img src="/images/pp.jpg" alt="40x40" width="40px" height="40px" className='profile-image img-fuild rounded-circle'/>
                    </Link>
                    <ul className={`profile-dropdown dropdown-menu ${isProfileDropdownOpen ? 'show' : ''}`} aria-labelledby="profileDropdown">
                      <div className="profile-dropdown-arrow"></div>
                      <li><a className="dropdown-item" href="#">Profilim</a></li>
                      <li><a className="dropdown-item" href="#">Mesajlar</a></li>
                      <li><a className="dropdown-item" href="#">Kitaplık</a></li>
                      <li><a className="dropdown-item" href="#">Ayarlar</a></li>
                      <li><a className="dropdown-item" href="#">Çıkış Yap</a></li>
                    </ul>
                </div>
              </div>
          </div>
          </div>
        </div>
      </div>
  );
}

export default MainLayouts;
