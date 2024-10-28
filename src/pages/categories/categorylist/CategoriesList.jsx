import React from 'react'
import './CategoriesList.css'
import Navbar from "../../../layouts/navbar/Navbar"
import Footer from "../../../layouts/footer/Footer"
import { useNavigate } from 'react-router-dom'

function CategoriesList() {
  const navigate = useNavigate();

  const categories = [
    { image: "/images/category1.jpg", categoryName: "Romantik"},
    { image: "/images/category1.jpg", categoryName: "Komedi"},
    { image: "/images/category1.jpg", categoryName: "Polisiye"},
    { image: "/images/category1.jpg", categoryName: "Dram"},
    { image: "/images/category1.jpg", categoryName: "Romantik Komedi"},
    { image: "/images/category1.jpg", categoryName: "Genç Kurgu"},
    { image: "/images/category1.jpg", categoryName: "Genç Kız Edebiyatı"},
    { image: "/images/category1.jpg", categoryName: "Bilim Kurgu"},
    { image: "/images/category1.jpg", categoryName: "Fantastik"},
    { image: "/images/category1.jpg", categoryName: "Romantik"},
    { image: "/images/category1.jpg", categoryName: "Komedi"},
    { image: "/images/category1.jpg", categoryName: "Polisiye"},
    { image: "/images/category1.jpg", categoryName: "Dram"},
    { image: "/images/category1.jpg", categoryName: "Romantik Komedi"},
    { image: "/images/category1.jpg", categoryName: "Genç Kurgu"},
    { image: "/images/category1.jpg", categoryName: "Genç Kız Edebiyatı"},
    { image: "/images/category1.jpg", categoryName: "Bilim Kurgu"},
    { image: "/images/category1.jpg", categoryName: "Fantastik"}
  ]

  const handleCategoryClick = (categoryName) => {
    navigate(`/categories/categoryDetails/${categoryName}`)
  }

  return (
    <div className="categories-page">
        <Navbar/>
        <div className="container">
          <h2 className='text-center mt-5 mb-5 category-title'>Kategoriler</h2>
          <div className="categories-list">
            <div className="row">
              {categories.map((category, index) => (
                <div className="category-card col-lg-3 col-md-4 col-sm-6 col-xs-12" key={index} onClick={() => handleCategoryClick(category.categoryName)}>
                    <div className="d-flex flex-column align-items-center mb-5">
                      <img src={category.image} alt="category-image" width="200px" height="281px"/>
                      <p className='mt-1 fs-5'>{category.categoryName}</p>
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