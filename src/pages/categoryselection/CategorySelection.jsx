import React, { useState, useEffect } from 'react'
import './CategorySelection.css'
import axios from 'axios';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

function CategorySelection() {
    const [selectedCard, setSelectedCard] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/categories'); 
                setCategories(response.data); 
            } catch (error) {
                console.error('Kategoriler alınamadı:', error);
            }
        };
        fetchCategories();
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (selectedCard.length < 3) {
            setShowModal(true);
            return;
        }
    
        const selectedCategories = selectedCard.map(index => categories[index].id);
    
        try {
            const response = await axios.post('http://localhost:3000/categories/user', {
                email,
                categoryIds: selectedCategories  
            });
    
            navigate(`/home`);
        } catch (error) {
            console.error('Kategori seçme işlemi başarısız:', error);
            alert('Kategori seçme işlemi başarısız, lütfen tekrar deneyin.');
        }
    };

    const handleCardClick = (index) => {
        if (selectedCard.includes(index)) {
            setSelectedCard(selectedCard.filter((i) => i !== index));
        } else {
            setSelectedCard([...selectedCard, index]);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="selection-page">
            <div className="container">
                <div className="selection-navbar">
                    <div className="d-flex align-items-center justify-content-start">
                        <img src="/logo/efshane_logo.svg" alt="Logo" className="logo"/>
                    </div>
                </div>

                <div className="mt-3 title">
                    <h1 className='text-center'>
                        <span className='ef'>EF</span>shane’nin Sonsuz Kitap Dünyasına Hoş Geldin
                    </h1>
                    <p className='text-center m-2 opacity-75'>
                        İlgi alanlarını daha yakından tanıyabilmemiz için en az 3 kitap kategorisi seçmeni rica ediyoruz. 
                        Seçtiğin kategorilerden sana özel kitap önerileri sunarak, kitaplığına dilediğin kitapları 
                        ekleyebilmeni sağlayacağız. Böylece okuma deneyimini tam anlamıyla kişiselleştirebiliriz.
                    </p>
                </div>
                
                <div className="category-list">
                    {categories.map((category, index) => (
                        <div className="mt-4 mb-3 cards" key={category.id}>
                            <div 
                                className={`card category ${selectedCard.includes(index) ? 'border-red shadow' : ''}`}
                                onClick={() => handleCardClick(index)}
                            >
                                <img src={category.imageUrl} alt={category.name} className='card-img' />    
                                <div className="card-body">
                                    <h5 className="text-center">{category.name}</h5>
                                </div>
                            </div>
                            
                        </div>
                    ))}             
                </div>
                <div className="d-flex justify-content-center">
                    <Button className='btn btn-category-register text-white mt-4 mb-4' onClick={handleSubmit} >Devam Et</Button>
                </div>

                {/* Modal */ }
                <Modal show={showModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Uyarı!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Lütfen en az 3 adet kategori seçiniz.</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleCloseModal}>Anladım</Button>
                    </Modal.Footer>
                </Modal> 
            </div>
        </div>
    )
}

export default CategorySelection