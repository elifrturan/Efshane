import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import './CategoryDetails.css';
import Navbar from "../../../layouts/navbar/Navbar";
import Footer from "../../../layouts/footer/Footer";
import axios from 'axios';

function CategoryDetails() {
    const { categoryName } = useParams(); 
    const [categoryDetails, setCategoryDetails] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const token = localStorage.getItem('token');  
                if (!token) {
                    console.error("Token bulunamadı!");
                    return;
                }

                const response = await axios.get(`http://localhost:3000/categories/getBookByCategory/${categoryName}`, { 
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });

                console.log("API'den gelen veri:", response.data);
                setCategoryDetails(response.data);
            } catch (error) {
                console.error("Kategoriler alınırken hata oluştu:", error.response?.data || error.message);
            }
        }; 
        fetchCategoryDetails();
    }, [categoryName]);

    return (
        <div className='category-details-page'>
            <Navbar />
            <div className="container">
                <h2 className='mt-5 mb-5 text-center'>{categoryName}</h2>
                <div className="details-book-list">
                    <div className="row">
                    {categoryDetails && categoryDetails.map((book) => (
                        <div className="details-book-card col-lg-3 col-md-4 col-sm-6 col-xs-12 d-flex flex-column align-items-center mb-5" key={book.id}>
                            <img src={book.bookCover} alt="" width="180px" height="281px" />
                            <div className="details-book-content d-flex flex-column align-items-center">
                                <p className='mt-1'>{book.title}</p>
                                <div className="details-book-writer d-flex">
                                    <img src={book.profile_image} alt="" className='rounded-circle' width="24px" height="24px" />
                                    <p className='ms-2'>{book.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CategoryDetails;
