import React, { useState } from 'react'
import './Settings.css'
import Footer from '../../layouts/footer/Footer'
import { Button, Form, Modal } from 'react-bootstrap';

function Settings() {
    const [theme, setTheme] = useState("light");
    const [notification, setNotification] = useState(true);
    const [show, setShow] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [editMode, setEditMode] = useState({
        username: false,
        birthdate: false,
        email: false,
    })

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleThemeChange = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    }

    const [user, setUser] = useState({
            id: 1,
            username: "elifturan",
            birthdate: "2002-07-15",
            email: "elifturan@mail.com",
            password: "12345elif."
    })

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

    const handleSavePassword = () => {
        if (newPassword === confirmPassword && newPassword.length >= 6) {
            alert("Şifre başarıyla değiştirildi!");
            setShowModal(false);
            setNewPassword("");
            setConfirmPassword("");
        } else {
            alert("Şifreler uyuşmuyor veya şifre çok kısa!");
        }
    }

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
                        <span style={{cursor: 'pointer', fontSize: '0.8rem'}} onClick={handleShow}>Değiştir</span>
                    </div>
                    <Form.Control 
                        type="password"
                        value={user.password}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <button type="submit" className="btn btn-primary">Kaydet</button>
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
                    <Button>Hesabı Dondur</Button>
                    <Button>Hesabı Sil</Button>
                </div>
            </div>

            <div className="card p-4 mb-5 help-settings">
                <h4>Yardım ve Geri Bildirim</h4>
                <div className="d-flex gap-3 buttons">
                    <Button>Hata Bildir</Button>
                    <Button>Bize Ulaşın</Button>
                </div>
            </div>
        </div>

        <Modal show={show} onHide={handleClose} centered className='settings-modal'>
            <Modal.Header closeButton>Şifreni Değiştir</Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Yeni Şifre</Form.Label>
                        <Form.Control size="sm" type="password" placeholder="Yeni Şifre" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Yeni Şifre Tekrar</Form.Label>
                        <Form.Control size="sm" type="password" placeholder="Yeni Şifre" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSavePassword}>Kaydet</Button>
            </Modal.Footer>
        </Modal>
        <Footer/>
    </>
  )
}

export default Settings