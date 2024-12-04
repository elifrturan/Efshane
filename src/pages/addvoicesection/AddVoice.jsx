import React, { useState } from 'react'
import './AddVoice.css'
import AddCover from './addcover/AddCover';
import Details from './details/Details';
import Sections from './sections/Sections';

function AddVoice() {
    const [activeTab, setActiveTab] = useState('details');
    
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

  return (
    <div className="add-voice-section-page">
        <div className="container">
            <h2 className='text-center mt-5 mb-5'>Sesli Kitap Detay Sayfasına Hoş Geldiniz</h2>
            <div className="add-voice-section-main">
                <div className="add-voice-section-left">
                    {/* Upload Cover */}
                    <AddCover/>
                </div>
                <div className="add-voice-section-right">
                    {/* Tabs */}
                    <div className="voice-tabs">
                        <button
                            className={`voice-tab-button ${activeTab === 'details' ? 'active' : ''}`}
                            onClick={() => handleTabClick('details')}
                        >
                        Detay
                        </button>
                        <button
                            className={`voice-tab-button ${activeTab === 'sections' ? 'active' : ''}`}
                            onClick={() => handleTabClick('sections')}
                        >
                            Bölümler
                        </button>
                    </div>
                    {/* Content */}
                    <div className="voice-tab-content">
                        {/* Details */}
                        {activeTab === 'details' && <Details/>}
                        { /* Sections */ }
                        {activeTab === 'sections' && <Sections/>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddVoice