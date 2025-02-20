import React, { useState, useEffect } from 'react'
import './Settings.css'
import Footer from '../../layouts/footer/Footer'
import { Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

function Settings() {
    const [theme, setTheme] = useState("light");
    const [notification, setNotification] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [user, setUser] = useState("");

    const navigate = useNavigate(); 
    const [editMode, setEditMode] = useState({
        username: false,
        birthdate: false,
        email: false,
    })

    const handleClosePasswordModal = () => setShowPasswordModal(false);
    const handleShowPasswordModal = () => setShowPasswordModal(true);

    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleShowDeleteModal = () => setShowDeleteModal(true);

    const handleThemeChange = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    }

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Token bulunamadı');
                return;
            }
    
            try {
                const response = await axios.get('http://localhost:3000/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(prevUser => ({
                    ...prevUser,
                    ...response.data
                }));                
                console.log("User data fetched:", response.data);
            } catch (error) {
                console.error("User data fetch failed:", error);
            }
        };
    
        fetchUser();
    }, []);

    const navigateBizeUlasin = () => {
        navigate('/contact-us'); 
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('tr-TR', options);
    }

    const handleEditToggle = (field) => {
        setEditMode((prevState) => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    }

    const handleSaveChanges = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Oturum süresi dolmuş, lütfen tekrar giriş yapın!");
            return;
        }
    
        try {
            const response = await axios.put(
                "http://localhost:3000/users/profile/changes",
                {
                    username: user.username || undefined,
                    email: user.email || undefined,
                    birthdate: user.birthdate || undefined
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
    
            alert("Bilgiler başarıyla güncellendi!");
            setEditMode({ username: false, birthdate: false, email: false });
    
        } catch (error) {
            console.error("Bilgiler güncellenirken hata oluştu:", error);
            alert("Bilgiler güncelleme başarısız! Lütfen tekrar deneyin.");
        }
    };

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Oturum süresi dolmuş, lütfen tekrar giriş yapın!");
            return;
        }
    
        try {
            const response = await axios.delete(
                "http://localhost:3000/users/delete",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
    
            alert("Hesap silindi!");
            localStorage.removeItem("token");   
            handleClose();
            navigate('/signin');          
        } catch (error) {
            console.error("Hesap silinirken hata oluştu:", error);
            alert("Hesap silme başarısız! Lütfen tekrar deneyin.");
        }
    };

    const handleSavePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("Şifreler uyuşmuyor!");
            return;
        }
        
        if (newPassword.length < 6) {
            alert("Şifre en az 6 karakter olmalıdır!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Oturum süresi dolmuş, lütfen tekrar giriş yapın!");
            return;
        }

        try {
            const response = await axios.put(
                "http://localhost:3000/users",
                {
                    email: user.email,
                    pass: newPassword
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert(response.data.message);
            setShow(false);
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error("Şifre güncellenirken hata oluştu:", error);
            alert("Şifre güncelleme başarısız! Lütfen tekrar deneyin.");
        }
    };


    return (
        <>
            <div className="settings-page">
                <h2 className="text-center mb-5 mt-5">Ayarlar</h2>
                <div className="card p-4 personal-info">
                    <h4 className='mb-4'>Kişisel Bilgiler</h4>
                    <Form>
                    <Form.Group className="mb-4">
                        <Form.Label>Kullanıcı Adı</Form.Label>
                        <div className="d-flex justify-content-between align-items-center gap-2">
                            {editMode.username ? (
                                <Form.Control
                                type="text"
                                name="username"
                                value={user.username}
                                onChange={handleInputChange}
                                style={{ color: "black" }}
                            />
                            ) : (
                                <Form.Control value={`@${user.username}`} readOnly></Form.Control>
                            )}
                            <span
                                className="edit-btn"
                                onClick={() => handleEditToggle('username')}
                            >
                                <i className={editMode.username ? 'bi bi-check-circle-fill' : 'bi bi-pen-fill'}></i>
                            </span>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Doğum Tarihi</Form.Label>
                        <div className="d-flex justify-content-between align-items-center gap-2">
                            {editMode.birthdate ? (
                                <Form.Control
                                    type="date"
                                    name="birthdate"
                                    value={user.birthdate}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <Form.Control value={formatDate(user.birthdate)} readOnly></Form.Control>
                            )}
                            <span
                                className="edit-btn"
                                onClick={() => handleEditToggle('birthdate')}
                            >
                                <i className={editMode.birthdate ? 'bi bi-check-circle-fill' : 'bi bi-pen-fill'}></i>
                            </span>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>E-Posta</Form.Label>
                        <div className="d-flex justify-content-between align-items-center gap-2">
                            {editMode.email ? (
                            <Form.Control
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                            />
                            ) : (
                                <Form.Control value={user.email} readOnly></Form.Control>
                            )}
                            <span
                                className="edit-btn"
                                onClick={() => handleEditToggle('email')}
                            >
                                <i className={editMode.email ? 'bi bi-check-circle-fill' : 'bi bi-pen-fill'}></i>
                            </span>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <div className="password-label d-flex justify-content-between">
                            <Form.Label>Şifre</Form.Label>
                            <span style={{cursor: 'pointer', fontSize: '0.8rem'}} onClick={handleShowPasswordModal}>Değiştir</span>
                        </div>
                        <Form.Control 
                            type="password"
                            value={user.password}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <button type="submit" className="btn btn-primary" 
                    onClick={handleSaveChanges}>Kaydet</button>
                    </Form>
                </div>

                <div className="card p-4 mt-5 mb-5">
                    <h4>Bildirim Ayarları</h4>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="notificationSwitch"
                            onChange={() => setNotification(!notification)}
                            checked={notification}
                        />
                        <label className="form-check-label" htmlFor="notificationSwitch">
                            Bildirimleri {notification ? "Kapat" : "Aç"}
                        </label>
                    </div>
                </div>

                <div className="card p-4 mb-5 account-settings">
                    <h4>Hesap İşlemleri</h4>
                    <div className="d-flex gap-3 buttons">
                        <Button onClick={handleShowDeleteModal} >Hesabı Sil</Button>
                    </div>
                </div>

                <div className="card p-4 mb-5 help-settings">
                    <h4>Yardım ve Geri Bildirim</h4>
                    <div className="d-flex gap-3 buttons">
                        <Button onClick={navigateBizeUlasin}>Hata Bildir</Button>
                        <Button onClick={navigateBizeUlasin}>Bize Ulaşın</Button>
                    </div>
                </div>
            </div>

            { /* Şifre Değiştirme Modalı */ }
            <Modal show={showPasswordModal} onHide={handleClosePasswordModal} centered className='settings-modal'>
                <Modal.Header closeButton>Şifreni Değiştir</Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3'>
                            <Form.Label>Yeni Şifre</Form.Label>
                            <Form.Control size="sm" type="password" placeholder="Yeni Şifre" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Yeni Şifre Tekrar</Form.Label>
                            <Form.Control size="sm" type="password" placeholder="Yeni Şifre" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSavePassword}>Şifreyi Güncelle</Button>
                </Modal.Footer>
            </Modal>

            { /* Hesap Silme Modalı */ }
            <div className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Bölüm Sil</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                aria-label="Close" 
                                onClick={handleCloseDeleteModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>Bu hesabı silmek istediğinize emin misiniz?</p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-danger" 
                                onClick={handleDeleteAccount} 
                            >
                                Sil
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={handleCloseDeleteModal}
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Settings