import React from 'react'
import './Footer.css'

function Footer() {
    return (
        <footer className="bg-dark text-light py-4">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h5>Hakkımızda</h5>
                <p className='opacity-75'>
                Merhaba Değerli Kitapsever! <br />
                Biz, iki bilgisayar mühendisi arkadaş olarak teknoloji ve edebiyatın kesiştiği bu büyülü 
                yolculuğa adım attık. Hayalimiz, kitapların büyüleyici dünyasını teknoloji ile birleştirerek,
                okuma deneyiminizi bir adım öteye taşımak.
                </p>
              </div>
    
               {/* Links */} 
              <div className="col-md-2">
                <h5>Hızlı Linkler</h5>
                <ul className="footer-links list-unstyled">
                  <li><a href="/"><i class="bi bi-house-heart-fill"></i> Ana Sayfa</a></li>
                  <li><a href="/about"><i class="bi bi-at"></i> Hakkımızda</a></li>
                  <li><a href="/contact"><i class="bi bi-headset"></i> İletişim</a></li>
                  <li><a href="/terms"><i className='bi bi-info-circle-fill'></i> Kullanım Şartları</a></li>
                </ul>
              </div>
    
              {/* Social Media */}
              <div className="col-md-3">
                <h5>Sosyal Medya</h5>
                <ul className="list-unstyled d-flex">
                  <li><a href="https://facebook.com" className="text-light me-3"><i class="bi bi-facebook"></i></a></li>
                  <li><a href="https://twitter.com" className="text-light me-3"><i class="bi bi-twitter-x"></i></a></li>
                  <li><a href="https://instagram.com" className="text-light me-3"><i class="bi bi-instagram"></i></a></li>
                  <li><a href="https://linkedin.com" className="text-light"><i class="bi bi-linkedin"></i></a></li>
                </ul>
              </div>
    
              {/* Contact */}
              <div className="col-md-3">
                <h5>İletişim</h5>
                <p>Email: efshaneapp@gmail.com</p>
                <p>Telefon: +90 555 555 5555</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <p>&copy; 2024 EFshane Tüm hakları saklıdır.</p>
            </div>
          </div>
        </footer>
      );
}

export default Footer