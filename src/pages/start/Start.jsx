import React from 'react'
import './Start.css'
import { Link } from 'react-router-dom'

function Start() {
  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="background-image ">
        <h1 className="display-5 text-white text-center">Okuma, yazma ve daha fazlasının</h1> 
        <h1 className='display-4 text-center efshane fw-medium'> EFSHANE </h1>
        <h1 className='display-5 text-white text-center'>dünyasına hoş geldiniz</h1>
        <p className="text-white text-center fw-lighter">
        Favori kitaplarını keşfet, kendi hikayeni yaz, yazarları ve okuyucuları takip et, sesli kitaplarla dinleyerek keyif al...
        </p>
        <div className="mt-4 container d-flex">
          <Link className="start-login me-2" to="/signin">Giriş Yap</Link>
          <Link className="start-register" to="/signup">Kayıt Ol</Link>
        </div>
      </div>
    </div>
  )
}

export default Start