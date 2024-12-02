import React, { useState } from 'react';
import './Footer.css';
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Footer() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    return (
        <div className="container">
            <footer className="py-3 my-5">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item"><a href="/home" className="nav-link px-2 text-body-secondary">Ana Sayfa</a></li>
                    <li className="nav-item"><a href="/about-us" className="nav-link px-2 text-body-secondary">Hakkımızda</a></li>
                    <li className="nav-item"><a href="/contact-us" className="nav-link px-2 text-body-secondary">İletişim</a></li>
                    <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary" onClick={handleShow}>Şartlar & Koşullar</a></li>
                </ul>

                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="col-md-4 d-flex align-items center">
                    <a href="/" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
                      <img src="/logo/logo.svg" alt="" width="30px" height="24px"/>
                    </a>
                    <span className='mb-3 mb-md-0 text-body-secondary'>&copy; 2024 EFshane, Tüm Hakları Saklıdır</span>
                  </div>

                  <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                        <li className="ms-3"><a className="text-body-secondary" href="#"><FaTwitter size={24} /></a></li>
                        <li className="ms-3"><a className="text-body-secondary" href="#"><FaInstagram size={24} /></a></li>
                        <li className="ms-3"><a className="text-body-secondary" href="#"><FaLinkedin size={24} /></a></li>
                    </ul>
                </div>                
            </footer>
            <Modal show={show} onHide={handleClose} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title>Şartlar & Koşullar</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <h6>Giriş</h6>
                  <p style={{fontSize: "0.8rem"}}>Bu "Şartlar ve Koşullar", EFSHANE tarafından sunulan hizmetlerin kullanımını düzenler. 
                    Uygulamanın kullanılması, bu şartların tamamının kabul edildiği anlamına gelir. 
                    Şartlar, kullanıcıların haklarını, sorumluluklarını ve uygulamayla ilgili kuralları içerir.
                  </p>
                  <h6>Kullanıcı Kayıt ve Hesap Bilgileri</h6>
                  <p style={{fontSize: "0.8rem"}}>
                  Uygulamayı kullanmak için geçerli bir e-posta adresi, kullanıcı adı, doğum tarihi ve şifre 
                  ile hesap oluşturmanız gerekmektedir. Kullanıcı, verdiği tüm bilgilerin doğru ve güncel olduğunu
                  taahhüt eder. Yanlış bilgi verilmesi durumunda, uygulama yönetimi hesabınızı askıya alma veya 
                  silme hakkını saklı tutar.
                  </p>
                  <h6>Hizmetler</h6>
                  <p style={{fontSize: "0.8rem"}}>
                  Uygulama, kullanıcılara çevrimiçi kitap okuma, yazarlarla etkileşim kurma, 
                  hikaye yazma, sesli kitap dinleme gibi çeşitli hizmetler sunar. Uygulamanın sunduğu 
                  tüm hizmetler, bu şartlar çerçevesinde kullanılmalıdır.
                  </p>
                  <h6>İçerik Kullanımı</h6>
                  <p style={{fontSize: "0.8rem"}}>
                  Uygulamada kullanıcılar tarafından oluşturulan hikayeler, yorumlar ve diğer içerikler aşağıdaki kurallara tabidir:
                    <ul>
                      <li>
                      <b>Uygun İçerik:</b> Kullanıcılar, içerik oluştururken yasalarla uyumlu, saygılı ve topluluk kurallarına uygun içerikler üretmek zorundadır. İçeriklerde küfür, hakaret, müstehcenlik, nefret söylemi veya şiddet içeren dil kullanılmamalıdır.
                      </li>
                      <li>
                        <b>İçerik Denetimi:</b> Uygulama yönetimi, kullanıcılar tarafından oluşturulan içerikleri düzenli olarak denetleme hakkını saklı tutar. Kurallara aykırı içerikler fark edildiğinde, kullanıcı önce uyarılacak, uyarıya rağmen kural ihlali devam ederse hesabı kalıcı olarak silinecektir.
                      </li>
                      <li>
                        <b>İçerik Sorumluluğu:</b> Kullanıcılar tarafından oluşturulan içerikler tamamen kullanıcıların sorumluluğundadır. Uygulama, kullanıcıların oluşturduğu içeriklerden doğabilecek herhangi bir yasal sorumluluk kabul etmez.
                      </li>
                    </ul>
                  </p>
                  <h6>Kullanıcı Davranış Kuralları</h6>
                  <p style={{fontSize: "0.8rem"}}>
                  Kullanıcılar, uygulama içinde diğer kullanıcılara karşı saygılı ve nazik davranmalıdır. Her türlü taciz, nefret söylemi, tehdit veya kötüye kullanım yasaktır. Bu tür davranışlarda bulunan kullanıcılar aşağıdaki yaptırımlarla karşılaşabilir:
                  <ul>
                    <li><b>Uyarı:</b> İlk kural ihlalinde kullanıcı uyarılacaktır.</li>
                    <li><b>Askıya Alma: </b>İkinci ihlalde kullanıcı geçici olarak askıya alınabilir.</li>
                    <li><b>Kapatma:</b> Üçüncü ihlalde kullanıcı hesabı kapatılacaktır.</li>
                  </ul>
                  </p>
                  <h6>Gizlilik</h6>
                  <p style={{fontSize: "0.8rem"}}>
                  Kişisel bilgilerinizin korunmasına önem veriyoruz. Verdiğiniz kişisel bilgiler, 
                  yalnızca uygulamanın hizmetlerini sunmak amacıyla kullanılacak ve Gizlilik 
                  Politikamızda belirtilen şartlara uygun olarak saklanacaktır.
                  </p>
                  <h6>Sorumluluğun Sınırlandırılması</h6>
                  <p style={{fontSize: "0.8rem"}}>
                  Uygulama, kullanıcıların içeriklerden doğabilecek herhangi bir maddi veya manevi zarardan sorumlu tutulamaz.
                  Kullanıcılar, uygulamayı ve içeriklerini kendi sorumlulukları altında kullanırlar. 
                  Uygulama, teknik sorunlar veya hatalar nedeniyle yaşanabilecek kesintiler için sorumlu tutulamaz.
                  </p>
                  <h6>Fikri Mülkiyet</h6>
                  <p style={{fontSize: "0.8rem"}}>
                  Uygulamada yer alan tüm içerik, grafikler, logolar, simgeler ve yazılımlar, ilgili hak sahiplerinin 
                  fikri mülkiyetindedir. Bu materyallerin herhangi bir şekilde çoğaltılması, kopyalanması veya dağıtılması yasaktır.
                  </p>
                  <h6>Kullanıcı Hesabının Askıya Alınması veya Kapatılması</h6>
                  <p style={{fontSize: "0.8rem"}}>
                  Bu Şartlar ve Koşullara uymayan kullanıcıların hesapları geçici olarak askıya alınabilir veya kalıcı olarak silinebilir. Özellikle aşağıdaki durumlarda hesap askıya alınabilir veya kapatılabilir:
                  <ul>
                    <li>Uygunsuz içerik paylaşımı (küfür, hakaret, nefret söylemi vb.)</li>
                    <li>Diğer kullanıcılara karşı saygısız davranış</li>
                    <li>Yasalara aykırı eylemler</li>
                  </ul>             
                  </p>
                  <h6>Değişiklikler</h6>
                  <p style={{fontSize: "0.8rem"}}>
                  Uygulama, bu Şartlar ve Koşulları herhangi bir zamanda güncelleme hakkına sahiptir. 
                  Değişiklikler yapıldığında, kullanıcılar güncellenmiş şartlar hakkında bilgilendirilecektir ve 
                  uygulamanın kullanılmaya devam edilmesi, yeni şartların kabul edildiği anlamına gelir.
                  </p>
                  <h6>Yasal Yükümlülükler ve İhtilaflar</h6>
                  <p style={{fontSize: "0.8rem"}}>
                  Bu Şartlar ve Koşullar, Türkiye yasalarına tabidir. 
                  </p>
                  <h6>İletişim Bilgileri</h6>
                  <p style={{fontSize: "0.8rem"}}>
                    efshaneapp@gmail.com
                  </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Kapat
                </Button>
              </Modal.Footer>
            </Modal>
            
        </div>
    );
}

export default Footer;
