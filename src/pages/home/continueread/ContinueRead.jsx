import React from 'react'
import { Link } from 'react-router-dom'
import './ContinueRead.css'

function ContinueRead() {
  return (
    <div className="continue-read-row">
        <div className="container mt-5 mb-5">
          <div className="continue-read text-center">
            <div className="row">
              <div className="col-lg-3 book-cover">
              <h3 className='text-start ms-5 mb-3'>Okumaya Devam Et</h3>
                <img src="/images/book.jpg" alt="book cover" width="220px"/>
              </div>
              <div className="col-lg-8">
                <div className="book-content text-start"> 
                  <div className="book-content-up mt-5">
                    <div className="bookName">
                      <h4>Kiraz Mevsimi</h4>
                    </div>
                    <div className="writer-info d-flex flex-row align-items-center">
                      <img src="/images/woman-pp.jpg" alt="30x30" width="30px" height="30px" className='img-fuild rounded-circle'/>
                      <p className='ms-2 d-flex mt-2'>prensesingunlugu</p>
                    </div>
                    <div className="book-info opacity-75 mt-2">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                      Tempora quasi cum numquam omnis molestiae amet assumenda vel aspernatur, 
                      animi deleniti. Voluptates reiciendis nostrum quis quia sequi eius voluptatem 
                      eligendi possimus. Tenetur quas minus eligendi ut fuga quidem dolore corporis error.
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, nisi odit quaerat 
                      soluta aut voluptatem minima ea excepturi? Rem, dicta!
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae eum similique quasi 
                      consectetur corporis cum ut provident ullam ad nesciunt? Tempora in totam, pariatur 
                      similique ullam maiores architecto necessitatibus!
                    </div>
                  </div>
                  <div className="book-content-down">
                    <div className="interaction d-flex">
                      <div className="read-count me-3">
                        <p><i class="bi bi-eye-fill"></i> 1.5M</p>
                      </div>
                      <div className="like-count me-3">
                        <p><i class="bi bi-balloon-heart-fill"></i> 1.2K</p>
                      </div>
                      <div className="comment-count">
                        <p><i class="bi bi-chat-heart-fill"></i> 345</p>
                      </div>
                    </div>
                    <div className="continue-read-button">
                      <Link className='btn btn-read-continue'>Okumaya Devam Et</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ContinueRead