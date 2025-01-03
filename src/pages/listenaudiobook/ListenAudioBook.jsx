import React, { useEffect, useRef, useState } from 'react'
import './ListenAudioBook.css'
import Footer from '../../layouts/footer/Footer'
import { Button, Dropdown } from 'react-bootstrap'
import WaveSurfer from 'wavesurfer.js'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function ListenAudioBook() {
    const { bookName: formattedBookName } = useParams();
    const [episode, setEpisodes] = useState([]);
    const [liked, setLiked] = useState(formattedBookName.isLiked);
    const [selectedSection, setSelectedSection] = useState(1);
    const waveformRef = useRef(null);
    const waveSurferRef = useRef(null);
    const timerRef = useRef(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isAddedToLibrary, setIsAddedToLibrary] = useState(formattedBookName.isAudioBookCase);

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    useEffect(() => {
        if (episode.length > 0 && !selectedSection) {
            setSelectedSection(episode[0].id); 
        }
    }, [episode, selectedSection]);

    useEffect(() => {
        const fetchEpisodesDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/episode/listen/audioBook/${formattedBookName}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
        
                const { audioBooks, episode } = response.data;                
                setEpisodes(episode); 
                console.log("Episodes:", audioBooks.isLiked);
                setLiked(audioBooks.isLiked); 
            } catch (error) {
                console.error("Error fetching audio book details:", error);
            }
        };        
    
        fetchEpisodesDetails();
    }, [formattedBookName]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    }

    const handleLike = async () => {
        const previousState = liked; 
        setLiked(!previousState); 

        try {
            const response = await axios.post(
                `http://localhost:3000/audio-book/like/${formattedBookName}`, 
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setLiked(response.data.isLiked);
            console.log(response.data.isLiked || true);
        } catch (error) {
            console.error("Beğenme işlemi sırasında hata oluştu:", error);
            alert("Beğenme işlemi sırasında bir hata oluştu.");
        }
    };

    const handleAddToLibrary = async () => {
        const previousState = isAddedToLibrary; 
        setIsAddedToLibrary(!previousState); 
    
        const encodeBookTitle = encodeURIComponent(formattedBookName);
        try {
            const response = await axios.post(
                `http://localhost:3000/book-case/audioBook/${encodeBookTitle}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            if (response.data.message === "Kütüphaneye eklendi.") {
                setIsAddedToLibrary(true);
            } else if (response.data.message === "Kütüphaneden çıkarıldı.") {
                setIsAddedToLibrary(false);
            }
        } catch (error) {
            console.error("Error adding/removing from book case:", error);
            setIsAddedToLibrary(previousState); 
        }
    };

    const goToNextSection = () => {
        if (selectedSection < episode.length) {
            setSelectedSection(selectedSection + 1);
            window.scrollTo(0,0);
        }
    }

    const formatTitleForUrl = (title) => {
        const charMap = {
            'ç': 'c',
            'ğ': 'g',
            'ı': 'i',
            'ö': 'o',
            'ş': 's',
            'ü': 'u',
            'Ç': 'c',
            'Ğ': 'g',
            'İ': 'i',
            'Ö': 'o',
            'Ş': 's',
            'Ü': 'u',
        };
        
        const sanitizedTitle = title
            .split('') 
            .map(char => charMap[char] || char)
            .join('');
        
        return sanitizedTitle
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') 
            .replace(/\s+/g, '-'); 
    };
    
    const handleCommentSubmit = async (bookName, episodeTitle, newCommentContent) => {
        if (newCommentContent.trim() === "") return;
    
        const formattedEpisodeTitle = formatTitleForUrl(episodeTitle);
    
        try {
            const response = await axios.post(
                `http://localhost:3000/comment/audioBook/${bookName}/${formattedEpisodeTitle}`,
                { content: newCommentContent },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
        
            const newComment = response.data.comment;
        
            setComments(prevComments => [newComment, ...prevComments]);

            setEpisodes(prevEpisodes =>
                prevEpisodes.map(episodes =>
                    episodes.id === episode[selectedSection - 1].id
                        ? {
                            ...episodes,
                            comments: [newComment, ...episodes.comments],  
                        }
                        : episodes
                )
            );
            console.log(response.data);
        
            setNewComment(""); 
        } catch (error) {
            console.error("Yorum eklenirken hata oluştu:", error.response?.data || error.message);
            alert("Yorum eklenirken bir hata oluştu.");
        }
    };

    const handleCommentScroll = () => {
        const commentSection = document.querySelector('.comments-chapter');
        commentSection.scrollIntoView({ behavior: 'smooth' });
    }   

    useEffect(() => {
        if (!waveSurferRef.current) {
            waveSurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#ddd',
                progressColor: '#d46f37',
                barWidth: 3,
                cursorWidth: 2,
                cursorColor: '#333',
                responsive: true,
                backend: 'mediaelement',
            });
    
            waveSurferRef.current.on('ready', () => {
                setAudioDuration(waveSurferRef.current.getDuration());
            });
    
            waveSurferRef.current.on('audioprocess', () => {
                setCurrentTime(waveSurferRef.current.getCurrentTime());
            });
        }
    
        if (episode.length > 0 && selectedSection) {
            const currentEpisode = episode[selectedSection - 1];
            const audioFileUrl = currentEpisode?.audioFile;
            console.log("Audio File URL:", audioFileUrl);
    
            if (waveSurferRef.current && audioFileUrl) {
                waveSurferRef.current.load(audioFileUrl);
            }
        }
    
        return () => {
            if (waveSurferRef.current) {
                waveSurferRef.current.destroy(); 
                waveSurferRef.current = null;
            }
            clearInterval(timerRef.current);
        };
    }, [selectedSection, episode]);    
    
    const togglePlayPause = () => {
        waveSurferRef.current.playPause();
    };

    function formatNumber(num) {
        if (num == null || isNaN(num)) {
            return '0'; 
        }
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

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    return (
        <>
            <div className="listen-book-page">
                <div className="listen-book-nav">
                    <div className="episode-dropdown">
                        <Dropdown>
                            <Dropdown.Toggle>
                                Bölümler
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                            {episode && episode.length > 0 ? (
                                episode.map(episodes => (
                                    <Dropdown.Item key={episodes.id} onClick={() => setSelectedSection(episodes.id)}>
                                        {episodes.title}
                                    </Dropdown.Item>
                                ))
                            ) : (
                                <Dropdown.Item disabled>Hiç bölüm bulunamadı</Dropdown.Item>
                            )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="book-title">
                        <span className='text-center ms-5'>{episode.title}</span>
                    </div>
                    <div className="actions">
                        <span onClick={() => handleLike(episode.book?.id)} className={liked ? 'liked' : ''}>
                            <i className={`bi me-2 ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                            {liked ? 'Beğenildi' : 'Beğen'}
                        </span>
                        <span onClick={() => handleAddToLibrary(episode.book?.id)} className={isAddedToLibrary ? 'added' : ''}>
                            <i className={`bi me-2 ${isAddedToLibrary ? 'bi-book-fill' : 'bi-book'}`}></i> 
                            {isAddedToLibrary ? 'Kitaplıktan Kaldır' : 'Kitaplığa Ekle'}
                        </span>
                    </div>
                </div>
                <div className="listen-book-content">
                    <div className="episode-header">
                        {episode[selectedSection - 1]?.image ? (
                            <img 
                                src={episode[selectedSection - 1]?.image} 
                                alt={episode[selectedSection - 1]?.title} 
                                className="episode-image"
                            />
                        ) : null}
                        <h2>{episode[selectedSection - 1]?.title}</h2>
                        <div className="statistics d-flex gap-3">
                            <span>
                                <i className="bi bi-eye"></i> {formatNumber(episode[selectedSection - 1]?.analysis[0]?.read_count)}
                            </span>
                            <span>
                                <i className="bi bi-heart"></i> {formatNumber(episode[selectedSection - 1]?.analysis[0]?.like_count)}
                            </span>
                            <span>
                                <i className="bi bi-chat" onClick={handleCommentScroll} style={{cursor: 'pointer'}}></i> {formatNumber(episode[selectedSection - 1]?.analysis[0]?.comment_count)}
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

                    {selectedSection == episode.length && (
                        <div className="alert alert-success mt-3" role="alert">
                            Hikayenin sonuna geldiniz. 
                            <br />
                            Başka bir hikayede tekrar buluşmak dileğiyle...
                        </div>
                    )}

                    <Button className='next-episode-btn' onClick={goToNextSection}>
                        Sonraki Bölüme Geç <i className="bi bi-chevron-right ms-2"></i>
                    </Button>

                    <div className="comments-chapter mt-4">
                        <h4 className="mb-2">Yorumlar</h4>
                        {episode.length > 0 && episode[selectedSection - 1] ? (
                            episode[selectedSection - 1].comments?.length === 0 ? (
                                <p style={{ fontSize: "0.9rem", opacity: "0.8" }}>Henüz yorum yapılmadı.</p>
                            ) : (
                                episode[selectedSection - 1].comments.map((comment, index) => (
                                    <div className="comment d-flex" key={comment.id}>
                                        <img 
                                            src={comment.user?.profile_image || '/default-profile.png'} 
                                            alt={comment.user?.username || 'Anonim'} 
                                            className="user-profile-img" 
                                        />
                                        <div className="comment-details ms-3">
                                            <p className="user-name mb-1">
                                                <strong>{comment.user?.username || 'Anonim'}</strong>
                                            </p>
                                            <p className="comment-content mb-0">{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            )
                        ) : (
                            <p style={{ fontSize: "0.9rem", opacity: "0.8" }}>Bölüm yükleniyor...</p>
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
                            onClick={() => handleCommentSubmit(formattedBookName, episode[selectedSection - 1].title , newComment)}
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