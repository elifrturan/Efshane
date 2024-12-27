import React from 'react'
import './FollowOthers.css'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

function FollowOthers() {
    const navigate = useNavigate();
    const username = "prensesingunlugu";

    const handleProfileClick = () => {
        navigate(`/user/${username}`);
    }
    const users = [
        {
            id: 1,
            image: "/images/profile.jpg",
            name: "Elif",
            username: "elifturan"
        },
        {
            id: 2,
            image: "/images/profile2.jpg",
            name: "Fatmanur",
            username: "fatmanurozcetin"
        },
        {
            id: 3,
            image: "/images/profile.jpg",
            name: "Beyza",
            username: "beyzacinar"
        },
        {
            id: 4,
            image: "/images/woman-pp.jpg",
            name: "Kevser",
            username: "kevsercakir"
        },

    ]
  return (
    <>
        <div className="follow-others">
            <h5>Diğerlerini takip edin</h5>
            {users.map((user) => (
                <div className="user" key={user.id}>
                    <div className="user-left d-flex gap-2">
                        <img src={user.image} alt="" width="40" height="40" className='rounded-circle object-fit-cover' onClick={handleProfileClick}/>
                        <div className="user-info d-flex flex-column">
                            <span className='fw-bold'>{user.name}</span>
                            <span>@{user.username}</span>
                        </div>
                    </div>
                <Button>Takip et</Button>
             </div>
            ))} 
        </div>
    </>
  )
}

export default FollowOthers