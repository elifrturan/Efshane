import React, { useEffect, useRef, useState } from 'react'
import './ListenAudioBook.css'
import Footer from '../../layouts/footer/Footer'
import { Button, Dropdown } from 'react-bootstrap'
import WaveSurfer from 'wavesurfer.js'

function ListenAudioBook() {
    const [liked, setLiked] = useState(false);
    const [addedToLibrary, setAddedToLibrary] = useState(false);
    const [selectedSection, setSelectedSection] = useState(1);
    const waveformRef = useRef(null);
    const waveSurferRef = useRef(null);
    const timerRef = useRef(null);
    const [newComment, setNewComment] = useState('');
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const handleLike = () => {
        setLiked(!liked);
        setSections(prevSections => 
            prevSections.map(section => 
                section.id === selectedSection 
                    ? { 
                        ...section, 
                        likeCount: liked ? section.likeCount - 1 : section.likeCount + 1 
                    } 
                    : section
            )
        );
    }

    const handleAddToLibrary = () => {
        setAddedToLibrary(!addedToLibrary);
    }

    const [section, setSections] = useState([
        {
            id: 1,
            image: "/images/bg.jpg",
            title: "1. Bölüm",
            readCount: 869,
            likeCount: 320,
            commentCount: 3,
            audioFile: "/voice/deneme-masal.m4a"
        },
        {
            id: 2,
            image: "",
            title: "2. Bölüm",
            readCount: 800,
            likeCount: 309,
            commentCount: 1,
            audioFile: "/voice/deneme-masal.m4a"
        },
        {
            id: 3,
            image: "/images/bg4.jpg",
            title: "3. Bölüm",
            readCount: 579,
            likeCount: 200,
            commentCount: 0,
            audioFile: "/voice/deneme-masal.m4a"
        }
    ])

    const [comments, setComments] = useState([
        {
            sectionId: 1,
            userProfile: "/images/profile.jpg",
            userName: "elifturan",
            content: "Harika bir bölüm, çok beğendim!"
        },
        {
            sectionId: 1,
            userProfile: "/images/profile2.jpg",
            userName: "fatmanurozcetin",
            content: "Konu oldukça ilginç, devamını sabırsızlıkla bekliyorum."
        },
        {
            sectionId: 2,
            userProfile: "/images/woman-pp.jpg",
            userName: "senasener",
            content: "Bölüm gerçekten sürükleyiciydi, çok keyif aldım."
        }
    ])

    useEffect(() => {
        if (waveSurferRef.current) {
            waveSurferRef.current.destroy();
        }

        waveSurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#ddd',
            progressColor: '#d46f37',
            barWidth: 3,
            cursorWidth: 2,
            cursorColor: '#333',
            responsive: true
        });

        waveSurferRef.current.load(section[selectedSection - 1].audioFile);

        waveSurferRef.current.on('ready', () => {
            setAudioDuration(waveSurferRef.current.getDuration());
        });

        waveSurferRef.current.on('audioprocess', () => {
            setCurrentTime(waveSurferRef.current.getCurrentTime());
        });

        return () => {
            waveSurferRef.current.destroy();
            clearInterval(timerRef.current);
        };
    }, [selectedSection]);

    const togglePlayPause = () => {
        waveSurferRef.current.playPause();
    };

    const goToNextSection = () => {
        if (selectedSection < section.length) {
            setSelectedSection(selectedSection + 1);
            window.scrollTo(0,0);
        }
    }

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    }

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            const newCommentObj = {
                sectionId: selectedSection,
                userProfile: "/images/profile.jpg",
                userName: "elifturan",
                content: newComment
            };
            setComments([newCommentObj, ...comments]);
            setNewComment('');
        }
    }

    const handleCommentScroll = () => {
        const commentSection = document.querySelector('.comments-section');
        commentSection.scrollIntoView({ behavior: 'smooth' });
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

  return (
    <>
        <div className="listen-book-page">
            <div className="listen-book-nav">
                <div className="sections-dropdown">
                    <Dropdown>
                        <Dropdown.Toggle>
                            Bölümler
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {section.map(section => (
                                <Dropdown.Item key={section.id} onClick={() => setSelectedSection(section.id)}>
                                    {section.title}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="book-title">
                    <span className='text-center ms-5'>Aşk ve Gurur</span>
                </div>
                <div className="actions">
                    <span onClick={handleLike} className={liked ? 'liked' : ''}>
                        <i className={`bi me-2 ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                        {liked ? 'Beğenildi' : 'Beğen'}
                    </span>
                    <span onClick={handleAddToLibrary} className={addedToLibrary ? 'added' : ''}>
                        <i className={`bi me-2 ${addedToLibrary ? 'bi-book-fill' : 'bi-book'}`}></i> 
                        {addedToLibrary ? 'Kitaplıktan Kaldır' : 'Kitaplığa Ekle'}
                    </span>
                </div>
            </div>
            <div className="listen-book-content">
                <div className="section-header">
                    {section[selectedSection - 1].image ? (
                        <img 
                            src={section[selectedSection - 1].image} 
                            alt={section[selectedSection - 1].title} 
                            className="section-image"
                        />
                    ) : null}
                    <h2>{section[selectedSection - 1].title}</h2>
                    <div className="statistics d-flex gap-3">
                        <span>
                            <i className="bi bi-eye"></i> {section[selectedSection - 1].readCount}
                        </span>
                        <span>
                            <i className="bi bi-heart"></i> {section[selectedSection - 1].likeCount}
                        </span>
                        <span>
                            <i className="bi bi-chat" onClick={handleCommentScroll} style={{cursor: 'pointer'}}></i> {section[selectedSection - 1].commentCount}
                        </span>
                    </div>
                </div>

                <div className="audio-player">
                    <div id="waveform" ref={waveformRef}></div>
                        <div className="time-display">
                            <span>
                                {audioDuration > 0
                                    ? `${formatTime(currentTime)} / ${formatTime(audioDuration)}`
                                    : '0:00 / 0:00'}
                            </span>
                        </div>
                        <button
                            className="play-button"
                            onClick={togglePlayPause}
                        >
                            Oynat/Duraklat
                        </button>
                </div>

                {selectedSection == section.length && (
                    <div class="alert alert-success mt-3" role="alert">
                        Hikayenin sonuna geldiniz. 
                        <br />
                        Başka bir hikayede tekrar buluşmak dileğiyle...
                    </div>
                )}

                <Button className='next-section-btn' onClick={goToNextSection}>
                    Sonraki Bölüme Geç <i className="bi bi-chevron-right ms-2"></i>
                </Button>

                <div className="comments-section mt-4">
                    <h4 className='mb-2'>Yorumlar</h4>
                    {comments.filter(comment => comment.sectionId === selectedSection).length === 0 ? (
                        <p style={{fontSize: '0.9rem', opacity: "0.8"}}>Henüz yorum yapılmadı.</p>
                    ): (
                        comments.filter(comment => comment.sectionId === selectedSection).map((comment,index) => (
                            <div className="comment d-flex" key={index}>
                                <img src={comment.userProfile} alt={comment.userName} className="user-profile-img" />
                                <div className="comment-details ms-3">
                                    <p className="user-name mb-1"><strong>{comment.userName}</strong></p>
                                    <p className="comment-content mb-0">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                    
                </div>

                <div className="comment-input mt-3">
                    <textarea
                        className="form-control"
                        value={newComment}
                        onChange={handleCommentChange}
                        rows="3"
                        placeholder="Siz de bir yorum ekleyin..."
                    />
                    <Button
                        className="mt-2"
                        onClick={handleCommentSubmit}
                    >
                        Yorum Yap
                    </Button>
                </div>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default ListenAudioBook