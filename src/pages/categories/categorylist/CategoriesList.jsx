import React, { useEffect, useState } from 'react'
import './CategoriesList.css'
import Navbar from "../../../layouts/navbar/Navbar"
import Footer from "../../../layouts/footer/Footer"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function CategoriesList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesSuggestion = async () => {
        try {
            const token = localStorage.getItem('token');  
            if (!token) {
                console.error("Token bulunamadı!");
                return;
            }
            const response = await axios.get(`http://localhost:3000/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
            setCategories(response.data); 
        } catch (error) {
            console.error("Kategoriler alınırken hata oluştu:", error.response?.data || error.message);
        }
    };
    fetchCategoriesSuggestion();
}, []);


const handleCategoryClick = (categoryName) => {
  navigate(`/categories/categoryDetails/${categoryName}`); 
}

  return (
    <div className="categories-page">
        <Navbar/>
        <div className="container">
          <h2 className='text-center mt-5 mb-5 category-title'>Kategoriler</h2>
          <div className="categories-list">
            <div className="row">
              {categories && categories.map((category) => (
                <div className="category-card col-lg-3 col-md-4 col-sm-6 col-xs-12" key={category.id} onClick={() => handleCategoryClick(category.name)}>
                    <div className="d-flex flex-column align-items-center mb-5">
                      <img src={category.imageUrl} alt="category-image" width="200px" height="281px"/>
                      <p className='mt-1 fs-5'>{category.name}</p>
                    </div>
              </div>
              ))}
            </div>
        </div>
        </div>
        <Footer/>
    </div>
  )
}

export default CategoriesList