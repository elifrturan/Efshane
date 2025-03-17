import React, { useState } from 'react'
import './SignUp.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [show, setShow] = useState(false);
  const [kvkkShow, setKvkkShow] = useState(false);
  
  const handleTermsClose = () => setShow(false);
  const handleTermsShow = () => setShow(true);
  
  const handleKvkkClose = () => setKvkkShow(false);
  const handleKvkkShow = () => setKvkkShow(true);

  const handleClose = () => setShowModal(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setUsernameError(''); 

    if (password !== passwordAgain) {
      alert('Şifreler eşleşmiyor!');
      return;
    }

    if(!termsAccepted){
      setTermsError("Şartlar ve Koşulları kabul etmelisiniz!");
      return;
    }
    else{
      setTermsError('');
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        email,
        username,
        birthdate,
        password
      });

      alert('Kayıt başarılı! E-postanızı kontrol edin.');
      navigate(`/categoryselection?email=${encodeURIComponent(email)}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message === 'Bu kullanıcı adına ait bir hesap mevcut') {
        setUsernameError('Bu kullanıcı adına ait bir hesap mevcut');
      } else {
        alert('Kayıt başarısız, lütfen tekrar deneyin.');
      }
    }
  }

  const termsConditions = () => {
    setShowModal(true);
  }

  return (
    <div className='signup-page'>
      <div className="signup-container">
        <h1 className="text-start">Kayıt Ol</h1>
        <div className='d-flex justify-content-start align-items-center mb-3 have-account'>
          <span>Zaten bir hesabın var mı?</span>
          <Link className='subtitle text-decoration-none ms-1' style={{fontWeight: '600'}} to='/signin'>Giriş Yap</Link>
        </div>
        
        {/* form */}
        <Form onSubmit={handleSubmit}> {}
          <Form.Control
            type="email"
            name="email"
            id="email"
            className='mb-3'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Form.Control
            type="text"
            name='username'
            id='username'
            className='mb-3'
            placeholder='Kullanıcı Adı'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError(''); 
            }}
            isInvalid={!!usernameError}
          />
          <Form.Control
            type="date" 
            name="birthdate"
            id="birthdate"
            className='date-picker mb-3'
            placeholder='Doğum Tarihi'
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)} 
          />
          {usernameError && (
            <Form.Control.Feedback type="invalid">
                {usernameError}
            </Form.Control.Feedback>
          )}
          <InputGroup className="mb-3">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name='password'
              id='password'
              placeholder='Şifre'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <InputGroup.Text className='bg-transparent text-white' onClick={togglePasswordVisibility}>
                <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} style={{fontSize: '0.9rem'}}/>
              </InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name='passwordagain'
              id='passwordagain'
              placeholder='Şifre tekrar'
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)} 
            />
             <InputGroup.Text className='bg-transparent text-white' onClick={togglePasswordVisibility}>
                <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} style={{fontSize: '0.9rem'}}/>
              </InputGroup.Text>
          </InputGroup>

          {/* terms & conditions */}
          <Form.Check 
            type="checkbox" 
            name="checkbox" 
            id="checkbox" 
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
            label={<span><span className="custom-checkbox-label fw-bold me-1" onClick={termsConditions}>Şartlar & Koşullar’ı</span>kabul ediyorum</span>}
          />
          {termsError && <div className="text-danger error-message">{termsError}</div>}

          {/* register button */}
          <Link className='mt-3 btn btn-register' onClick={handleSubmit} >Kayıt Ol</Link>
        </Form>

        {/* terms&conditions modal */}
        <Modal show={showModal} className='terms-modal'>
          <Modal.Header closeButton>
            <Modal.Title>Şartlar & Koşullar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Giriş</h5>
            <p>
              Bu "Şartlar ve Koşullar", EFSHANE tarafından sunulan hizmetlerin kullanımını düzenler. 
              Uygulamanın kullanılması, bu şartların tamamının kabul edildiği anlamına gelir. 
              Şartlar, kullanıcıların haklarını, sorumluluklarını ve uygulamayla ilgili kuralları içerir.
            </p>
            <h5>Kullanıcı Kayıt ve Hesap Bilgileri</h5>
            <p>
              Uygulamayı kullanmak için geçerli bir e-posta adresi, kullanıcı adı, doğum tarihi ve şifre 
              ile hesap oluşturmanız gerekmektedir. Kullanıcı, verdiği tüm bilgilerin doğru ve güncel olduğunu
              taahhüt eder. Yanlış bilgi verilmesi durumunda, uygulama yönetimi hesabınızı askıya alma veya 
              silme hakkını saklı tutar.
            </p>
            <h5>Hizmetler</h5>
            <p>
              Uygulama, kullanıcılara çevrimiçi kitap okuma, yazarlarla etkileşim kurma, 
              hikaye yazma, sesli kitap dinleme gibi çeşitli hizmetler sunar. Uygulamanın sunduğu 
              tüm hizmetler, bu şartlar çerçevesinde kullanılmalıdır.
            </p>
            <h5>İçerik Kullanımı</h5>
            <p>
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
            <h5>Kullanıcı Davranış Kuralları</h5>
            <p>
              Kullanıcılar, uygulama içinde diğer kullanıcılara karşı saygılı ve nazik davranmalıdır. Her türlü taciz, nefret söylemi, tehdit veya kötüye kullanım yasaktır. Bu tür davranışlarda bulunan kullanıcılar aşağıdaki yaptırımlarla karşılaşabilir:
              <ul>
                <li><b>Uyarı:</b> İlk kural ihlalinde kullanıcı uyarılacaktır.</li>
                <li><b>Askıya Alma: </b>İkinci ihlalde kullanıcı geçici olarak askıya alınabilir.</li>
                <li><b>Kapatma:</b> Üçüncü ihlalde kullanıcı hesabı kapatılacaktır.</li>
              </ul>
            </p>
            <h5>Gizlilik</h5>
            <p>
              Kişisel bilgilerinizin korunmasına önem veriyoruz. Verdiğiniz kişisel bilgiler, 
              yalnızca uygulamanın hizmetlerini sunmak amacıyla kullanılacak ve Gizlilik 
              Politikamızda belirtilen şartlara uygun olarak saklanacaktır.
            </p>
            <h5>Sorumluluğun Sınırlandırılması</h5>
            <p>
              Uygulama, kullanıcıların içeriklerden doğabilecek herhangi bir maddi veya manevi zarardan sorumlu tutulamaz.
              Kullanıcılar, uygulamayı ve içeriklerini kendi sorumlulukları altında kullanırlar. 
              Uygulama, teknik sorunlar veya hatalar nedeniyle yaşanabilecek kesintiler için sorumlu tutulamaz.
            </p>
            <h5>Fikri Mülkiyet</h5>
            <p>
              Uygulamada yer alan tüm içerik, grafikler, logolar, simgeler ve yazılımlar, ilgili hak sahiplerinin 
              fikri mülkiyetindedir. Bu materyallerin herhangi bir şekilde çoğaltılması, kopyalanması veya dağıtılması yasaktır.
            </p>
            <h5>Kullanıcı Hesabının Askıya Alınması veya Kapatılması</h5>
            <p>
              Bu Şartlar ve Koşullara uymayan kullanıcıların hesapları geçici olarak askıya alınabilir veya kalıcı olarak silinebilir. Özellikle aşağıdaki durumlarda hesap askıya alınabilir veya kapatılabilir:
              <ul>
                <li>Uygunsuz içerik paylaşımı (küfür, hakaret, nefret söylemi vb.)</li>
                <li>Diğer kullanıcılara karşı saygısız davranış</li>
                <li>Yasalara aykırı eylemler</li>
              </ul>             
            </p>
            <h5>Değişiklikler</h5>
            <p>
              Uygulama, bu Şartlar ve Koşulları herhangi bir zamanda güncelleme hakkına sahiptir. 
              Değişiklikler yapıldığında, kullanıcılar güncellenmiş şartlar hakkında bilgilendirilecektir ve 
              uygulamanın kullanılmaya devam edilmesi, yeni şartların kabul edildiği anlamına gelir.
            </p>
            <h5>Yasal Yükümlülükler ve İhtilaflar</h5>
            <p>
              Bu Şartlar ve Koşullar, Türkiye yasalarına tabidir. 
            </p>
            <h5>İletişim Bilgileri</h5>
            <p>
              efshaneapp@gmail.com
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Anladım
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="footer-links">
        <a onClick={handleKvkkShow}>KVKK</a>
        <a onClick={handleTermsShow}>Şartlar ve Koşullar</a>
      </div>

      <Modal show={show} onHide={handleTermsClose} animation={false} className='terms-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Şartlar & Koşullar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Giriş</h5>
          <p>
            Bu "Şartlar ve Koşullar", EFSHANE tarafından sunulan hizmetlerin kullanımını düzenler. 
            Uygulamanın kullanılması, bu şartların tamamının kabul edildiği anlamına gelir. 
            Şartlar, kullanıcıların haklarını, sorumluluklarını ve uygulamayla ilgili kuralları içerir.
          </p>
          <h5>Kullanıcı Kayıt ve Hesap Bilgileri</h5>
            <p>
              Uygulamayı kullanmak için geçerli bir e-posta adresi, kullanıcı adı, doğum tarihi ve şifre 
              ile hesap oluşturmanız gerekmektedir. Kullanıcı, verdiği tüm bilgilerin doğru ve güncel olduğunu
              taahhüt eder. Yanlış bilgi verilmesi durumunda, uygulama yönetimi hesabınızı askıya alma veya 
              silme hakkını saklı tutar.
            </p>
            <h5>Hizmetler</h5>
              <p>
                Uygulama, kullanıcılara çevrimiçi kitap okuma, yazarlarla etkileşim kurma, 
                hikaye yazma, sesli kitap dinleme gibi çeşitli hizmetler sunar. Uygulamanın sunduğu 
                tüm hizmetler, bu şartlar çerçevesinde kullanılmalıdır.
              </p>
            <h5>İçerik Kullanımı</h5>
            <p>
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
            <h5>Kullanıcı Davranış Kuralları</h5>
              <p>
                Kullanıcılar, uygulama içinde diğer kullanıcılara karşı saygılı ve nazik davranmalıdır. Her türlü taciz, nefret söylemi, tehdit veya kötüye kullanım yasaktır. Bu tür davranışlarda bulunan kullanıcılar aşağıdaki yaptırımlarla karşılaşabilir:
                <ul>
                  <li><b>Uyarı:</b> İlk kural ihlalinde kullanıcı uyarılacaktır.</li>
                  <li><b>Askıya Alma: </b>İkinci ihlalde kullanıcı geçici olarak askıya alınabilir.</li>
                  <li><b>Kapatma:</b> Üçüncü ihlalde kullanıcı hesabı kapatılacaktır.</li>
                </ul>
              </p>
              <h5>Gizlilik</h5>
              <p>
                Kişisel bilgilerinizin korunmasına önem veriyoruz. Verdiğiniz kişisel bilgiler, 
                yalnızca uygulamanın hizmetlerini sunmak amacıyla kullanılacak ve Gizlilik 
                Politikamızda belirtilen şartlara uygun olarak saklanacaktır.
              </p>
              <h5>Sorumluluğun Sınırlandırılması</h5>
              <p>
                Uygulama, kullanıcıların içeriklerden doğabilecek herhangi bir maddi veya manevi zarardan sorumlu tutulamaz.
                Kullanıcılar, uygulamayı ve içeriklerini kendi sorumlulukları altında kullanırlar. 
                Uygulama, teknik sorunlar veya hatalar nedeniyle yaşanabilecek kesintiler için sorumlu tutulamaz.
              </p>
              <h5>Fikri Mülkiyet</h5>
              <p>
                Uygulamada yer alan tüm içerik, grafikler, logolar, simgeler ve yazılımlar, ilgili hak sahiplerinin 
                fikri mülkiyetindedir. Bu materyallerin herhangi bir şekilde çoğaltılması, kopyalanması veya dağıtılması yasaktır.
              </p>
              <h5>Kullanıcı Hesabının Askıya Alınması veya Kapatılması</h5>
              <p>
                Bu Şartlar ve Koşullara uymayan kullanıcıların hesapları geçici olarak askıya alınabilir veya kalıcı olarak silinebilir. Özellikle aşağıdaki durumlarda hesap askıya alınabilir veya kapatılabilir:
                <ul>
                  <li>Uygunsuz içerik paylaşımı (küfür, hakaret, nefret söylemi vb.)</li>
                  <li>Diğer kullanıcılara karşı saygısız davranış</li>
                  <li>Yasalara aykırı eylemler</li>
                </ul>             
              </p>
              <h5>Değişiklikler</h5>
              <p>
                Uygulama, bu Şartlar ve Koşulları herhangi bir zamanda güncelleme hakkına sahiptir. 
                Değişiklikler yapıldığında, kullanıcılar güncellenmiş şartlar hakkında bilgilendirilecektir ve 
                uygulamanın kullanılmaya devam edilmesi, yeni şartların kabul edildiği anlamına gelir.
              </p>
              <h5>Yasal Yükümlülükler ve İhtilaflar</h5>
              <p>
                Bu Şartlar ve Koşullar, Türkiye yasalarına tabidir. 
              </p>
              <h5>İletişim Bilgileri</h5>
              <p>
                efshaneapp@gmail.com
              </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Kapat
                </Button>
              </Modal.Footer>
      </Modal>

      <Modal show={kvkkShow} onHide={handleKvkkClose} animation={false} className='terms-modal'>
        <Modal.Header closeButton>
          <Modal.Title>KVKK</Modal.Title>
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
          <Button variant="secondary" onClick={handleKvkkClose}>
            Kapat
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default SignUp;
