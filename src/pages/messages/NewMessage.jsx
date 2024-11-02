import React from 'react'
import './NewMessage.css'
import Navbar from "../../layouts/navbar/Navbar"
import { Link } from 'react-router-dom'

function NewMessage() {
  return (
    <div className='new-message-page'>
        <Navbar/>
        <div className="container">
            <div className="new-message-container mt-5 mb-5">
                <h2 className='text-center mt-3 mb-2'>Yeni Mesaj Oluştur</h2>
                <p className='text-center opacity-50 new-message-description'><i>Kullanıcı adını girerek, istediğiniz mesajı dilediğiniz kişiye kolayca gönderebilirsiniz.</i></p>
                <form>
                    <div className="input-group mb-3">
                        <span className='input-group-text'>@</span>
                        <input type="text" className='form-control' placeholder='Kullanıcı Adı'/>
                    </div>
                    <div className="input-group mb-3 d-flex flex-column">
                        <label className='form-label'>Mesajınız</label>
                        <textarea className='form-control w-100' rows="6" placeholder='Lütfen mesaj içeriğinizi giriniz...'></textarea>
                    </div>
                    <div className="mb-3 d-flex justify-content-center">
                        <Link className="btn-new-message-send" to="/messages">Gönder</Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default NewMessage