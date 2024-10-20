import React, { useState } from 'react'
import './CategorySelection.css'
import { Link } from 'react-router-dom';

function CategorySelection() {
    const [selectedCard, setSelectedCard] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const categories = [
        { id: 1, name: 'Roman', image: '/images/category1.jpg' },
        { id: 2, name: 'Bilim Kurgu', image: '/images/category1.jpg' },
        { id: 3, name: 'Klasikler', image: '/images/category1.jpg' },
        { id: 4, name: 'Biyografi', image: '/images/category1.jpg' },
        { id: 5, name: 'Fantastik', image: '/images/category1.jpg' },
        { id: 6, name: 'Fantastik', image: '/images/category1.jpg' },
        { id: 7, name: 'Fantastik', image: '/images/category1.jpg' },
        { id: 8, name: 'Fantastik', image: '/images/category1.jpg' },
      ];

    const handleCardClick = (index) => {
        if (selectedCard.includes(index)) {
            setSelectedCard(selectedCard.filter((i) => i !== index));
        } else {
            setSelectedCard([...selectedCard, index]);
        }
    };

    const handleContinueClick = () => {
        if (selectedCard.length < 3) {
            setShowModal(true);
        } else {
            console.log("Continue");
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="selection-page">
            <div className="container">
                <div className="left">
                    <div className="d-flex align-items-center justify-content-start">
                        <img src="/logo/logo.svg" alt="Logo" className="img-fluid logo" />
                        <h5 className="ms-3 mb-0 logo-text"><span className='ef'>EF</span>shane</h5>
                    </div>
                </div>
               
                <div className="container-fluid mt-3">
                    <h1 className='text-center title'>
                        <span className='ef'>EF</span>shane’nin Sonsuz Kitap Dünyasına Hoş Geldin
                    </h1>
                    <p className='text-center mt-2 me-2 ms-2 opacity-75'>
                        İlgi alanlarını daha yakından tanıyabilmemiz için en az 3 kitap kategorisi seçmeni rica ediyoruz. 
                        Seçtiğin kategorilerden sana özel kitap önerileri sunarak, kitaplığına dilediğin kitapları 
                        ekleyebilmeni sağlayacağız. Böylece okuma deneyimini tam anlamıyla kişiselleştirebiliriz.
                    </p>
                </div>
                <div className="row">
                    {categories.map((category, index) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mt-4 mb-3 cards" key={category.id}>
                            <div 
                                className={`card category ${selectedCard.includes(index) ? 'border-red shadow' : ''}`}
                                onClick={() => handleCardClick(index)}
                            >
                                <img src={category.image} alt={category.name} className='card-img-top' />    
                                <div className="card-body">
                                    <h5 className="text-center">{category.name}</h5>
                                </div>
                            </div>
                            
                        </div>
                    ))}             
                </div>
                <div className="d-flex justify-content-center">
                    <Link className='btn btn-category-register text-white mt-2 mb-4' onClick={handleContinueClick}>Devam Et</Link>
                </div>

                {/* Modal */ }
                {showModal && (
                    <div className="modal fade show" style={{ display: 'block' }} id='warningModal' tabIndex="-1" aria-labelledby="warningModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id='warningModalLabel'>Uyarı!</h5>
                                <button type='button' className='btn-close' data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Lütfen en az 3 kategori seçimi yapınız.</p>
                            </div>
                            <div className="modal-footer">
                                <button type='button' className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                )}   
            </div>
        </div>
    )
}

export default CategorySelection