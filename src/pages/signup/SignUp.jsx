import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SignUp.css'
import { Link } from 'react-router-dom';
import axios from 'axios'; 

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showModal, setShowModal] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (password !== passwordAgain) {
      alert('Şifreler eşleşmiyor!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        email,
        username,
        birthdate,
        password
      });

      console.log('Kayıt başarılı:', response.data);
      alert('Kayıt başarılı! E-postanızı kontrol edin.');
    } catch (error) {
      alert('Kayıt başarısız, lütfen tekrar deneyin.');
    }
  }

  const termsConditions = () => {
    setShowModal(true);
  }

  return (
    <div className="signup-container">
      <h1 className="text-start text-white">Kayıt Ol</h1>
      <p className='text-start text-white'>Zaten bir hesabın var mı? <Link className='subtitle text-decoration-none' to='/signin'>Giriş Yap</Link></p>
      
      {/* form */}
      <form onSubmit={handleSubmit}> {}
        <div className="mb-3">
          <input
            type="email"
            name="email"
            id="email"
            className='form-control text-white bg-transparent'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name='username'
            id='username'
            className='form-control text-white bg-transparent'
            placeholder='Kullanıcı Adı'
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="mb-3 date-picker">
          <input
            type="date" 
            name="birthdate"
            id="birthdate"
            className='form-control text-white bg-transparent'
            placeholder='Doğum Tarihi'
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)} 
          />
        </div>
        <div className="mb-3 input-group">
          <input
            type={showPassword ? "text" : "password"}
            name='password'
            id='password'
            className='form-control text-white bg-transparent'
            placeholder='Şifre'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
        <div className="mb-3 input-group">
          <input
            type={showPassword ? "text" : "password"}
            name='passwordagain'
            id='passwordagain'
            className='form-control text-white bg-transparent'
            placeholder='Şifre tekrar'
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)} 
          />
          <span className='input-group-text bg-transparent text-white' onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>

        {/* terms & conditions */}
        <div className="mb-3 form-check d-flex flex-row align-items-center">
          <input type="checkbox" name="checkbox" id="checkbox" className='form-check-input bg-transparent me-2'/>
          <label className='text-white'><span className='label-link' onClick={termsConditions}>Şartlar & Koşullar ‘ı</span> kabul ediyorum</label>
        </div>

        {/* register button */}
        <div className="mb-3">
          <button className='btn-register fw-bold' type="submit">Kayıt Ol</button>
        </div>
      </form>

      {/* terms&conditions modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }} tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">Şartlar & Koşullar</h1>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
              <h5>Giriş</h5>
                <p>Bu "Şartlar ve Koşullar", EFSHANE tarafından sunulan hizmetlerin kullanımını düzenler. 
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
               </div> 
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* registration options */}
      <div className="mt-2 d-flex justify-content-between options">
        <div className="google d-flex justify-content-center align-items-center">
          <span className='text-white'><i class="bi bi-google me-1"></i>Google</span>
        </div>
        <div className="apple d-flex justify-content-center align-items center">
          <span className="text-white"><i class="bi bi-apple me-1"></i>Apple</span>
        </div>
      </div>
    </div>
  )
}

export default SignUp;
