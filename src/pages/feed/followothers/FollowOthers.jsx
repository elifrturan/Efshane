import React, { useState, useEffect } from 'react'
import './FollowOthers.css'
import { Button } from 'react-bootstrap'
import axios from 'axios'

function FollowOthers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRandomUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/feed/random-users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsers(response.data); 
            } catch (error) {
                console.error('Kullanıcılar alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRandomUsers();
    }, []);

    const handleFollow = async (followedUserId) => {
        try {
            await axios.post(
                'http://localhost:3000/feed/follow',
                { followedUserId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setUsers(users.filter((user) => user.id !== followedUserId)); 
        } catch (error) {
            console.error('Takip işlemi başarısız:', error);
            alert('Bir hata oluştu.');
        }
    };

    if (loading) return <p>Yükleniyor...</p>;
return (
    <>
        <div className="follow-others">
            <h5>Diğerlerini takip edin</h5>
            {users.map((user) => (
                <div className="user" key={user.id}>
                    <div className="user-left d-flex gap-2">
                        <img src={user.profile_image} alt="" width="40" height="40" className='rounded-circle object-fit-cover'/>
                        <div className="user-info d-flex flex-column">
                            <span className='fw-bold'>{user.username}</span>
                            <span>@{user.username}</span>
                        </div>
                    </div>
                    <Button onClick={() => handleFollow(user.id)} >Takip et</Button>
                </div>
            ))} 
        </div>
    </>
)
}

export default FollowOthers