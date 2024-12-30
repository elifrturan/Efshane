import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import './CategoryDetails.css';
import Navbar from "../../../layouts/navbar/Navbar";
import Footer from "../../../layouts/footer/Footer";
import axios from 'axios';

function CategoryDetails() {
    const { categoryName } = useParams(); 
    const navigate = useNavigate();
    const username = "prensesingunlugu";
    const bookName = "Aşk ve Gurur";
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

    const handleProfileClick = () => {
        navigate(`/${username}`);
    }

    function formatBookNameForURL(bookName) {
        return bookName
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    }

    const handleBookClick = () => {
        const formattedBookName = formatBookNameForURL(bookName);
        navigate(`/book-details/${formattedBookName}`)
    }

    return (
        <div className='category-details-page'>
            <div className="container">
                <h2 className='mt-5 mb-5 text-center'>{categoryName}</h2>
                <div className="details-book-list">
                    {categoryDetails && categoryDetails.map((book) => (
                        <div className="details-book-card d-flex flex-column align-items-center mb-5" key={book.id}>
                            <img src={book.bookCover} alt="" className='book-cover' width="150px" onClick={handleBookClick}/>
                            <div className="details-book-content d-flex flex-column align-items-center">
                                <p className='mt-1'>{book.title}</p>
                                <div className="details-book-writer d-flex" onClick={handleProfileClick}>
                                    <img src={book.profile_image} alt="" className='rounded-circle object-fit-cover' width="24px" height="24px" />
                                    <p>{book.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CategoryDetails;
