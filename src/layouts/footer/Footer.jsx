import React, { useContext, useState } from 'react';
import './Footer.css';
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ThemeContext } from '../../contexts/ThemeContext';

function Footer() {
  const [show, setShow] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    return (
        <span style={{paddingRight: '5%', paddingLeft: '5%'}}>
            <footer className="py-3 my-5">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                    <li className="nav-item"><a href="/home" className="nav-link px-2">Ana Sayfa</a></li>
                    <li className="nav-item"><a href="/about-us" className="nav-link px-2">Hakkımızda</a></li>
                    <li className="nav-item"><a href="/contact-us" className="nav-link px-2">İletişim</a></li>
                    <li className="nav-item"><a href="#" className="nav-link px-2" onClick={handleShow}>Şartlar & Koşullar</a></li>
                </ul>

                <div className="d-flex flex-wrap justify-content-between align-items-center down">
                  <div className="col-md-4 d-flex align-items center">
                    <a href="/home" className="mb-3 me-2 mb-md-0 text-decoration-none lh-1">
                      <img
                        src={theme === 'dark' ? '/logo/efshane_logo_dark.svg' : '/logo/efshane_logo.svg'}
                        alt="Logo"
                        className="object-fit-cover"
                        style={{ width: '30px', height: '20px' }}
                      />
                    </a>
                    <span className='d-flex justify-content-center align-items-center' style={{fontSize: '0.7rem', opacity: '0.8'}}>&copy; 2024 EFshane, Tüm Hakları Saklıdır</span>
                  </div>

                  <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                        <li className="ms-3"><a className="" href="https://www.youtube.com/@efshaneapp"><FaYoutube size={24} /></a></li>
                        <li className="ms-3"><a className="" href="https://www.instagram.com/efshaneapp/"><FaInstagram size={24} /></a></li>
                        <li className="ms-3"><a className="" href="#"><FaLinkedin size={24} /></a></li>
                    </ul>
                </div>                
            </footer>
            <Modal show={show} onHide={handleClose} animation={false} className='terms-modal'>
              <Modal.Header closeButton>
                <Modal.Title>Şartlar & Koşullar</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h6>VERİ TEMİN ETME VE VERİ SAKLAMA POLİTİKA PROTOKOLÜMÜZ</h6>
                <h5>1.	Amaç ve Kapsam</h5>
                <p>
                  Bu protokol, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Genel Veri Koruma Regülasyonu (GDPR) kapsamında, 
                  EFshane platformunda kişisel verilerin toplanması, saklanması, işlenmesi ve imha edilmesine yönelik esasları belirler. 
                  Protokol, site admini, site yöneticileri ve sitede paylaşım yapacak kullanıcılar arasındaki veri işleme süreçlerini düzenler.
                </p>
                <h5>2.	Veri Sorumlusu ve Veri İşleyen</h5>
                <p>
                  Veri Sorumlusu / Veri İşleyen: EFshane <br />
                  E-posta: efshaneapp@gmail.com
                </p>
                <h5>3.	Tanımlamalar</h5>
                <p>
                  <ul>
                    <li>
                      <b>Site Adı / Veri alanı:</b> https://efshaneapp.com/ <br />
                      (yapay zeka destekli kitap okuma, yazma ve dinleme platformu)
                    </li>
                    <li>
                      <b>Admin: </b> Sitenin veri yönetiminden, güvenliğinden ve içerik denetiminden sorumlu olan kullanıcıların 
                      paylaşımlarını gözden geçiren veya gerektiğinde kaldıran sistemin amaca uygun olarak çalışması ve geliştirilmesi için gereken teknik düzenlemeleri yapan kişidir.
                    </li>
                    <li>
                      <b>Kullanıcı:</b> Siteye giriş yaparak kitap yazabilen, okuyabilen, seslendirebilen, içerikleri görüntüleyebilen, paylaşım yapabilen,
                      yorum ekleyebilen, diğer kullanıcılarla etkileşimde bulunmakla birlikte şahsi hesapları üzerine içerik ekleyebilen, mevcuttaki içeriklere 
                      katkıda bulunabilen, platformun diğer özelliklerinden yararlanabilen, topluluk kurallarına uymakla yükümlü olan ve bunlara aksi davranışları 
                      olursa site yaptırımlarının uygulandığı kişiyi ifade eder.
                    </li>
                  </ul>
                </p>
                <h5>4.	Veri Elde Etme Yöntemlerinimiz</h5>
                <p>
                  <ul>
                    <li><b>	Anket Çalışmaları:</b><br />
                      Kullanıcı deneyimini analiz etmek için geniş katılımlı bir anket düzenlenmiştir. Bu ankette, kullanıcıların kitap okuma, 
                      yazma ve dinleme alışkanlıkları, dijital platformlara bakış açıları ve tercih ettikleri özellikler hakkında veriler toplanmıştır. 
                      Anket, farklı yaş grupları ve eğitim seviyelerinden katılımcılarla gerçekleştirilmiş olup, kullanıcıların dijital okuma alışkanlıkları, 
                      sesli kitap kullanım oranları ve platformdan beklentileri değerlendirilmiştir.
                    </li>
                    <li><b>Kullanıcı Davranış Analizleri:</b><br />
                      Kullanıcıların yazdığı veya seslendirdiği kitaplar, hangi özellikleri daha fazla kullandığı, hangi içerik 
                      türlerinin daha çok ilgi gördüğü ve platformda geçirilen ortalama süre gibi veriler toplanır.
                    </li>
                    <li><b>Yapay Zeka Destekli Veri Analizi:</b><br />
                      Platformda toplanan veriler, yapay zeka destekli analiz yöntemleri ile işlenmiştir. Kullanıcıların okuma ve dinleme alışkanlıklarını 
                      daha iyi anlamak için öneri sistemleri oluşturulmuş ve bu sistemler aracılığıyla kişiselleştirilmiş içerik önerileri geliştirilmiştir. 
                      Ayrıca kullanıcıların oluşturdukları veriler çeşitli yapay zeka modellerinden geçerek kötü içerik oranı tespit edilir. Bu orana göre kullanıcının o 
                      veriyi yayınlayıp yayınlamamasına karar verilir. Kullanıcıların geri bildirimleri dikkate alınarak platformun özellikleri optimize edilmiştir.
                    </li>
                  </ul>
                  Bu yöntemler sayesinde, EFshane platformunun kullanıcı dostu bir deneyim sunması ve kitap okuma alışkanlıklarını dijital dünyada daha erişilebilir hale getirmesi hedeflenmiştir.
                </p>
                <h5>5.	Veri Saklama Yöntemlerimiz/Politikamız:</h5>
                <p>
                  EFshane platformu, kullanıcı verilerinin güvenliğini korumak, verileri gizlilik ilkelerine uygun şekilde işlemek ve uzun vadeli erişilebilirliği sağlamak amacıyla aşağıdaki yöntemleri benimsemektedir:
                  <ul>
                    <li>
                      <b>Veritabanı Yapısı ve Saklama Yöntemleri: </b>
                      <ul>
                        <li>Kullanıcı bilgileri, içerik verileri ve etkileşim kayıtları PostgreSQL tabanlı bir veritabanında saklanmaktadır.</li>
                        <li>Prisma ORM kullanılarak veritabanı yönetimi sağlanmakta ve verilerin düzenli ve optimize edilmiş bir şekilde saklanması hedeflenmektedir.</li>
                        <li>Docker ile konteyner tabanlı bir sistem oluşturularak, verilerin ölçeklenebilir bir yapıda tutulması sağlanmıştır.</li>
                        <li>pgAdmin kullanılarak veritabanının yönetimi ve izlenmesi kolaylaştırılmıştır.</li>
                      </ul>
                    </li>
                    <li>
                      <b>Veri Şifreleme ve Güvenlik Politikaları:</b><br />
                      Kullanıcıya ait veriler, KVKK ve GDPR standartlarına uygun şekilde korunmaktadır:
                      <ul>
                        <li><b>Şifrelenmiş Veri Saklama: </b>Kullanıcı şifreleri bcrypt algoritması kullanılarak, kullanıcılar arasındaki mesajlarsa AES-256-CBC algoritmasıyla hashlenmiş ve güvenli bir sekilde saklanmaktadır.</li>
                        <li><b>SSL/TLS Şifreleme: </b>Kullanıcı ile platform arasındaki veri transferleri SSL/TLS protokolleri il şifrelenerek üçüncü taraf erişimlerine karşı korunmaktadır.</li>
                        <li><b>Yetkilendirme ve Kimlik Doğrulama:</b>Kullanıcı girişleri için JWT(JSON Web Token) tabanlı kimlik doğrulama mekanizmaları kullanılarak yetkisiz erişimlerin önüne geçilmektedir.</li>
                      </ul>
                    </li>
                    <li>
                      <b>Veri Yedekleme Politikası:</b>
                      Veri kaybını önlemek ve sistemin sürekliliğini sağlamak için düzenli yedekleme politikaları uygulanmaktadır:
                      <ul>
                        <li>
                          <b>Günlük Veritabanı Yedeklemeleri: </b>
                          PostgreSQL veritabanı, otomatik yedekleme sistemleri ile günlük olarak yedeklenmektedir.
                        </li>
                        <li>
                          <b>Felaket Kurtarma Planı: </b>
                          Veri kaybı veya sistem çökmesi durumunda, önceden belirlenen felaket kurtarma prosedürleri ile sistemin en kısa sürede tekrar çalışır hale getirilmesi sağlanmaktadır.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <b>Kullanıcı Verilerinin Saklanma Süresi, Silinmesi ve İmha Politikası:</b><br />
                      Kullanıcı verileri platformda yalnızca gerekli olduğu süre boyunca saklanır ve belirli durumlarda silme politikaları uygulanır:
                      <ul>
                        <li>
                          Kullanıcılara ait özel veriler, hesapları aktif olduğu sürece saklanır.
                        </li>
                        <li>
                          <b>İnaktif hesaplar:</b> 2 yıl süreyle saklanır. Bu sürenin sonunda tamamen silinerek kaldırılır.
                        </li>
                        <li>
                          <b>Hesap Silme Talepleri:</b> Kullanıcı hesabını sildiğinde, kişisel verileri 30 gün içinde sistemden kaldırılır ve bu süreçte hesap selinene kadar veriler korunmaya devam etmektedir.
                        </li>
                        <li>
                          <b>Log ve Analitik Verileri:</b> Platformun performansını artırmak ve kullanıcı deneyimini geliştirmek amacıyla anonimleştirilmiş kullanıcı verileri analiz edilerek saklanabilir.
                        </li>
                        <li>
                          <b>Sesli Kitap ve İçerik Verileri:</b>
                          <ul>
                            <li>Kullanıcının oluşturduğu sesli kitaplar, kullanıcı tarafından silinene kadar platformda kalır.</li>
                            <li>Kullanıcı hesabını sildiğinde, oluşturduğu sesli kitaplar da sistemden kaldırılır veya kullanıcıya içeriği anonim hale getirme seçeneği sunulur.</li>
                            <li>Eğer kullanıcı içeriği anonimleştirmeyi seçerse, telif hakkı korunarak anonim bir şekilde platformda saklanabilir.</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <b>Yapay Zeka Destekli İçerik Analizi ve Veri İşleme</b> <br />
                      <ul>
                        <li>
                          <b>Kötü İçerik Analizi:</b> Platformda paylaşılan içeriklerin etik ve topluluk kurallarına uygun olup olmadığını belirlemek için doğal dil işleme (NLP) algoritmaları kullanılmaktadır.
                        </li>
                        <li>
                          <b>Anonimleştirme ve Güvenli İşleme:</b> Kullanıcıların kişisel verileri anonim hale getirilerek analiz edilmekte ve sadece platform içi iyileştirmeler için kullanılmaktadır.
                        </li>
                      </ul>
                    </li>
                  </ul>     
                </p>
                <h5>6.	Kullanıcı Hakları ve Veri Koruma Politikaları</h5>
                <p>   
                  EFshane, kullanıcılarına KVKK ve GDPR kapsamında aşağıdaki hakları tanımaktadır:
                  <ul>
                    <li><b>Bilgilendirilme Hakkı:</b> Kişisel verilerin nasıl işlendiği hakkında bilgi alma.</li>
                    <li><b>Erişim Hakkı:</b> Kullanıcıların kendi kişisel verilerine erişme hakkı.</li>
                    <li><b>Düzeltme Hakkı:</b> Yanlış veya eksik kişisel verilerin düzeltilmesini talep etme.</li>
                    <li><b>Silme Hakkı (Unutulma Hakkı):</b> Kullanıcı, kişisel verilerinin tamamen silinmesini talep edebilir.</li>
                    <li><b>İtiraz Hakkı:</b> Verilerin işlenmesine itiraz etme ve işlenmesini durdurma hakkı.</li>
                  </ul>
                  Tüm talepler için efshaneapp@gmail.com adresinden iletişime geçilebilir.
                </p>
                <h5>7.	Sonuç ve Yasal Uyum</h5>
                <p>
                  EFshane platformu, kullanıcı verilerini en yüksek güvenlik standartlarına göre işlemekte ve saklamaktadır. KVKK ve GDPR uyumluluğu çerçevesinde, 
                  kullanıcıların veri haklarına saygı gösterilmekte ve verilerin korunması için gerekli tüm teknik ve idari tedbirler alınmaktadır.
                </p>            
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Kapat
                </Button>
              </Modal.Footer>
            </Modal>
        </span>  

    );
}

export default Footer;
