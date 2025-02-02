import React, { useState, useEffect } from 'react'
import './CategorySelection.css'
import axios from 'axios';
import { Link, useNavigate, useLocation} from 'react-router-dom';

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
    
            console.log('İşlem başarılı', response.data);
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
                                <img src={category.imageUrl} alt={category.name} className='card-img-top' />    
                                <div className="card-body">
                                    <h5 className="text-center">{category.name}</h5>
                                </div>
                            </div>
                            
                        </div>
                    ))}             
                </div>
                <div className="d-flex justify-content-center">
                    <Link className='btn btn-category-register text-white mt-2 mb-4' onClick={handleSubmit} >Devam Et</Link>
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