import React, { useState } from 'react'
import './MyStories.css'
import Navbar from '../../layouts/navbar/Navbar'
import Footer from '../../layouts/footer/Footer';
import { Button } from 'react-bootstrap';
import Books from './books/Books';
import AudioBooks from './audiobooks/AudioBooks';

function MyStories() {
    const [activeTab, setActiveTab] = useState('books');

    const handleStoriesTabClick = (tab) => {
        setActiveTab(tab);
    }

return (
    <div className="my-stories-page">
        <Navbar/>
        <div className="container">
            <h2 className='text-center mt-5 mb-5'>Hikayelerim</h2>
            {/* Tabs */}
            <div className="my-stories-tabs">
                <Button
                    className={`stories-tab-button ${activeTab === 'books' ? 'active' : ''}`}
                    onClick={() => handleStoriesTabClick('books')}
                >
                    Hikayeler
                </Button>
                <Button
                    className={`stories-tab-button ${activeTab === 'audiobooks' ? 'active' : ''}`}
                    onClick={() => handleStoriesTabClick('audiobooks')}
                >
                    Sesli Hikayeler
                </Button>
            </div>
            {/* Content */} 
            <div className="my-stories-tabs-content">
                {/* books */}
                {activeTab === 'books' && <Books/>}
                {/* audiobooks */}
                {activeTab === 'audiobooks' && <AudioBooks/>}
            </div>
        </div>
        <Footer/>
    </div>
)
}

export default MyStories