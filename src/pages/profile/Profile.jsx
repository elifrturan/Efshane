import React, { useRef, useState, useEffect } from 'react'
import Footer from '../../layouts/footer/Footer'
import './Profile.css'
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import { useUser } from '../../User.Context';
import axios from 'axios';

function Profile() {
    const [showModal, setShowModal] = useState(false);
    const [currentImage, setCurrentImage] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const storyScrollRef = useRef(null);
    const readListScrollRef = useRef(null);
    const [content, setContent] = useState("");
    const [notifyFollowers, setNotifyFollowers] = useState(false); 
    const [isAnnouncementVisible, setAnnouncementVisible] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const navigate = useNavigate();
    const [tempProfile , setTempProfile] = useState([]);
    const [stories , setStories] = useState([]);
    const [books, setBooks] = useState([]);
    const [anons, setAnons] = useState([]);
    const [showListModal, setShowListModal] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newListName, setNewListName] = useState("");

    const handleClose = () => setShowEdit(false);

    const handleShow = () => {
        setTempProfile({
            name: user.name,
            profile_image: user.profile_image,
            image_background: user.image_background,
            about: user.about,
        });
        setShowEdit(true);
    };

    const { user, setUser } = useUser();

    useEffect(() => {
        const fetchMyBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/book/allBooks`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setStories(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }; 

        fetchMyBooks();
    }, []);

    useEffect(() => {
        const fetchReadingList = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/reading-list`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(response.data);
                setBooks(response.data || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }; 

        fetchReadingList();
    }, []);

    useEffect(() => {
        const fetchAnons = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/anons/allAnons`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setAnons(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }; 

        fetchAnons();
    }, []);

    const openModal = (image) => {
        setCurrentImage(image);
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setCurrentImage("");
    }

    const handlePhotoChange = (event, photoType) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTempProfile((prevState) => ({
                ...prevState,
                [photoType]: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    }

    async function handleSave() {
        try {
            const { name, profile_image, image_background, about } = tempProfile;
            const response = await axios.put(
                'http://localhost:3000/users/updateUser',
                {
                    name,
                    profile_image,
                    image_background,
                    about,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            console.log("Güncellenen kullanıcı:", response.data);
    
            setUser((prevUser) => ({
                ...prevUser,
                name: response.data.name,
                about: response.data.about,
                profile_image: response.data.profile_image,
                image_background: response.data.image_background,
            }));
    
            handleClose();
        } catch (error) {
            console.error("Güncelleme hatası:", error);
        }
    }
    
    const scrollLeft = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({ left: -150, behavior: 'smooth' });
        }
    };

    const scrollRight = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({ left: 150, behavior: 'smooth' });
        }
    };

    const storiesClick = () => {
        navigate('/my-stories');
    }

    const readingLists = [
        {
            id: 1,
            name: "Favorilerim",
            books: [
                {id: 101, storyName: "Aşk ve Gurur", image: "/images/ask-ve-gurur.jpg"},
                {id: 102, storyName: "Şeker Portakalı", image: "/images/seker-portakali.jpg"},
                {id: 103, storyName: "Simyacı", image: "/images/simyaci.jpg"},
            ],
        },
        {
            id: 2,
            name: "Bilim Kurgu",
            books: [
                {id: 201, storyName: "Şeker Portakalı", image: "/images/seker-portakali.jpg"},
                {id: 202, storyName: "Simyacı", image: "/images/simyaci.jpg"},
            ],
        }
    ].map(list => ({
        ...list,
        cover: list.books.length > 0 ? list.books[0].image : "/images/default-cover.jpg",
    }));

    const handleListModalClose = () => setShowListModal(false)

    const handleListModalOpen = (story) => {
        setSelectedStory(story);
        setShowListModal(true);
    }

    const handleEditClick = () => {
        setEditMode(true);
        setNewListName(selectedStory.name);
    }
    
    const handleSaveClick = () => {
        setEditMode(false);
        setSelectedStory({ ...selectedStory, name: newListName });
        const updatedReadingLists = readingLists.map((list) =>
            list.id === selectedStory.id ? { ...list, name: newListName } : list
        );
    }

    const handleListNameChange = (e) => {
        setNewListName(e.target.value);
    }

    const handleAddAnnouncement = async () => {
        if (!content.trim()) {
            alert("Duyuru içeriği boş olamaz!");
            return;
        }
    
        try {
            const response = await axios.post(
                "http://localhost:3000/anons/create",
                {
                    content,
                    notifyFollowers,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
    
            if (response.status === 201) {
                setAnons((prevAnons) => [
                    ...prevAnons,
                    { ...response.data, id: response.data.id },
                ]);
                setContent("");
                setNotifyFollowers(false);
                setCharCount(0);
                setAnnouncementVisible(false);
            }
        } catch (error) {
            console.error("Duyuru yayınlanırken bir hata oluştu:", error);
            alert("Duyuru yayınlanamadı, lütfen tekrar deneyin.");
        }
    };

    const handleTextareaFocus = () => {
        setAnnouncementVisible(true); 
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        const charCount = newContent.length;
        
        if (charCount <= 200) {
            setContent(newContent);
            setCharCount(charCount);
        }
    };

    const getTimeDifference = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;

        const diffSeconds = Math.floor(diffMs / (1000) % 60);
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
        const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));

        if (diffYears > 0) {
            return past.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
        }

        if (diffMonths > 0) {
            return past.toLocaleDateString("tr-TR", { day: "2-digit", month: "long" });
        }

        if(diffWeeks > 0) return `${diffWeeks}h`;
        if(diffDays > 0) return `${diffDays}g`;
        if(diffHours > 0) return `${diffHours}s`;
        if(diffMinutes > 0) return `${diffMinutes}d`;
        if(diffSeconds > 0) return `${diffSeconds}sn`;
    };

    const handleDeleteClick = async (anonsId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/anons/${anonsId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            if (response.status === 200) {
                setAnons((prevAnons) => prevAnons.filter((anons) => anons.id !== anonsId));
            }
        } catch (error) {
            console.error("Duyuru silinirken bir hata oluştu:", error);
            alert("Duyuru silinemedi, lütfen tekrar deneyin.");
        }
    };    
    
    function formatDate(dateString) {
        const date = new Date(dateString);
            return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    function formatNumber(num) {
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
        }
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1_000) {
            return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    }

    function formatBookNameForURL(bookName) {
        return bookName
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    }
    
    const handleBookClick = (bookName) => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/book-details/${formattedBookName}`)
    }  

    return (
        <>
            <div className="profile-page">
                <div className="profile-page-up">
                    <img
                        src={user.image_background}
                        alt="Background"
                        onClick={() => openModal(user.image_background)}
                        className="clickable-photo"
                    />
                    <div className="profile-details">
                        <div className="profile-photo">
                            <img src={user.profile_image} alt="" onClick={() => openModal(user.profile_image)} className='clickable-photo'/>
                        </div>
                        <Button className='edit-profile-btn' onClick={handleShow}>Profili düzenle</Button>
                    </div>
                    
                    {showModal && (
                        <div className="user-profile-model">
                            <div className="modal-overlay" onClick={closeModal}>
                                <div className="modal-content">
                                    <img src={currentImage} alt="Büyütülmüş Görsel" />
                                    <button className="close-modal" onClick={closeModal}>
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="profile-user-details">
                        <div className="username-name">
                            <p>{user.name}</p>
                            <span>@{user.username}</span>
                        </div>

                        <div className="about-section">
                            <span>{user.about}</span>
                        </div>
                                
                        <div className="attend-date">
                            <p><span><i className="bi bi-calendar-week me-2"></i></span>{formatDate(user.date)} tarihinde katıldı</p>
                        </div>
                                
                        <div className="follower-statistics">
                            <p><b>{user.followingCount}</b> <span>Takip Edilen</span></p>
                            <p><b>{user.followersCount}</b> <span>Takipçi</span></p>
                        </div>
                    </div>

                    {/* Edit Modal */}
                    <Modal show={showEdit} onHide={handleClose} className='profile-edit-modal' centered>
                        <Modal.Header>
                            <div className="close">
                                <p className='p-0 m-0 me-2 fs-3' onClick={handleClose}><i className="bi bi-x"></i></p>
                                <Modal.Title>Profili Düzenle</Modal.Title>
                            </div>
                            <Button onClick={handleSave}>Kaydet</Button>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="cover-photo">
                                <label htmlFor="coverPhotoInput" className="w-100">
                                    <img src={tempProfile.image_background} alt="" />
                                </label>
                                <input
                                    id="coverPhotoInput"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handlePhotoChange(e, "image_background")}
                                />
                            </div>

                            <div className="profile-details">
                                <div className="profile-photo">
                                    <label htmlFor="profilePhotoInput" className="clickable-photo w-100">
                                        <img src={tempProfile.profile_image} alt="" />
                                    </label>
                                    <input
                                        id="profilePhotoInput"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handlePhotoChange(e, "profile_image")}
                                    />
                                </div>
                            </div>

                            <Form>
                                <Form.Group className='mb-3'>
                                    <Form.Label>İsim</Form.Label>
                                    <Form.Control 
                                        type='text' 
                                        value={tempProfile.name}
                                        onChange={(e) => 
                                            setTempProfile((prevState) => ({
                                                ...prevState,
                                                name: e.target.value,
                                            }))
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Hakkında</Form.Label>
                                    <Form.Control 
                                        as='textarea' 
                                        rows={3} 
                                        value={tempProfile.about}
                                        onChange={(e) => 
                                            setTempProfile((prevState) => ({
                                                ...prevState,
                                                about: e.target.value,
                                            }))
                                        }
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
                <hr />
                <div className="profile-page-down">
                    <div className="left mb-5">
                    <div className="stories">
                        <div className="stories-title d-flex align-items-center justify-content-start">
                            <p className="text-start m-0 p-0 fw-bold" onClick={storiesClick} style={{cursor: 'pointer'}}>Hikayelerim</p>
                            <div className="story-controls">
                                <button onClick={() => scrollLeft(storyScrollRef)} className="scroll-btn">
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <button onClick={() => scrollRight(storyScrollRef)} className="scroll-btn">
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        <div className="story-list" ref={storyScrollRef}>
                            {stories.map((story) => (
                                <div className="story mt-1" key={story.id}>
                                    <img src={story.bookCover} alt="" width="100px" height="140px" className='object-fit-cover' onClick={() => handleBookClick(story.title)}/>
                                    <span className='mt-1'>{story.title}</span>
                                    <div className="statistics d-flex justify-content-between mt-1">
                                        <p className='d-flex'><i className="bi bi-eye me-1"></i>{formatNumber(story.analysis?.[0]?.read_count ?? 0)}</p>
                                        <p className='d-flex'><i className="bi bi-heart me-1"></i>{formatNumber(story.analysis?.[0]?.like_count ?? 0)}</p>
                                        <p className='d-flex'><i className="bi bi-chat me-1"></i>{formatNumber(story.analysis?.[0]?.comment_count ?? 0)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                    </div>
                    <div className="my-read-list mt-4">
                        <div className="read-list-title d-flex align-items-center justify-content-start">
                            <p className="text-start fw-bold m-0 p-0">Okuma Listelerim</p>
                            <div className="read-list-controls">
                                <button onClick={() => scrollLeft(readListScrollRef)} className="scroll-btn">
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <button onClick={() => scrollRight(readListScrollRef)} className="scroll-btn">
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        <div className="read-story-list" ref={readListScrollRef}>
                            {readingLists.map((story) => (
                                <div className="story mt-1" key={story.id}>
                                    <img src={story.cover} alt="" width="100px" height="140px" className='object-fit-cover' onClick={() => handleListModalOpen(story)}/>
                                    <span className='mt-1'>{story.name}</span>
                                </div>
                            ))}
                        </div>

                        <Modal show={showListModal} onHide={handleListModalClose} centered className='read-list-modal'>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {editMode ? (
                                        <div className="d-flex align-items-center gap-2">
                                            <input
                                                type="text"
                                                value={newListName}
                                                onChange={handleListNameChange}
                                                className="form-control"
                                            />
                                            <i
                                                className="bi bi-check-lg text-success"
                                                onClick={handleSaveClick}
                                                style={{ cursor: 'pointer' }}
                                            ></i>
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-center gap-3">
                                            {selectedStory ? selectedStory.name : 'Kitap Listesi'}
                                            <i
                                                className="bi bi-pencil"
                                                onClick={handleEditClick}
                                                style={{ cursor: 'pointer', fontSize: '1rem' }}
                                            ></i>
                                        </div>
                                    )}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="book-list">
                                    {selectedStory?.books?.length > 0 ? (
                                        <div className="d-flex flex-wrap justify-content-around">
                                            {selectedStory.books.map((book) => (
                                                <div className="book-item m-3 text-center d-flex flex-column gap-2" key={book.id} onClick={handleBookClick}>
                                                    <img src={book.image} alt={book.storyName} width="100px" height="150px" className="object-fit-cover" />
                                                    <span className="mt-1">{book.storyName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Bu listede kitap bulunmamaktadır.</p>
                                    )}
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                    </div>
                    <div className="right">
                        <div className="right-main">
                            <p className='text-center fw-bold'>Duyurular</p>
                            <div className="add-announcement">
                                <div className="add-announcement-left">
                                    <img
                                        src={user.profile_image}
                                        alt=""
                                        width="40"
                                        height="40"
                                        className="rounded-circle object-fit-cover"
                                    />
                                </div>
                                <div className="add-announcement-right d-flex flex-column">
                                    <div className="d-flex">
                                        <textarea
                                            className="form-control"
                                            placeholder="Bir şeyler yazmak için tıklayın..."
                                            value={content}
                                            onChange={handleContentChange}
                                            onFocus={handleTextareaFocus} 
                                        ></textarea>
                                    </div> 
                                    {isAnnouncementVisible && (
                                        <>
                                            <div className={`char-count ${charCount >= 195 ? 'text-danger' : ''}`}>
                                                {charCount}/200
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-2 announcement-buttons">
                                                <div className="form-check d-flex gap-2 align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="notifyFollowers"
                                                        checked={notifyFollowers}
                                                        onChange={(e) => setNotifyFollowers(e.target.checked)}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                    >
                                                        Bunu takipçilerine duyur
                                                    </label>
                                                </div>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={handleAddAnnouncement}
                                                    disabled={charCount > 200}
                                                >
                                                    Yayınla
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>   
                            </div>
                            {anons.map((announcement) => (
                                    <div className="profile-announcement" key={announcement.id}>
                                        <div className="profile-announcement-left">
                                            <img 
                                                src={user.profile_image}
                                                alt="" 
                                                width="40" 
                                                height="40" 
                                                className='rounded-circle object-fit-cover'/>
                                        </div>
                                        <div className="profile-announcement-right">
                                            <div className="user-info d-flex justify-content-between">
                                                <p>
                                                    {user.name} 
                                                    <br />
                                                    <span>{user.username}
                                                        <i className="bi bi-dot ms-2"></i> {getTimeDifference(announcement.date)}
                                                    </span>
                                                </p>
                                                <Dropdown>
                                                    <Dropdown.Toggle className='no-toggle'>
                                                        <i className="bi bi-three-dots"></i>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item className='icon-link icon-link-hover' onClick={() => handleDeleteClick(announcement.id)}><i className="bi bi-trash me-1"></i>Sil</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            <div className="content mt-3">
                                                {announcement.content}
                                            </div>
                                            <div className="interaction mt-3">
                                                <div className="left">
                                                </div>
                                                <i className="bi bi-share"></i>
                                            </div>
                                        </div>
                                    </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Profile