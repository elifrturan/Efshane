import React from 'react'
import './AboutUs.css'
import Navbar from "../../layouts/navbar/Navbar"
import Footer from "../../layouts/footer/Footer"
import Slider from 'react-slick'

function AboutUs() {
  const features = [
    {
      id: 1,
      title: "Yapay Zeka Destekli Kontrol Sistemi",
      description:
        "Yapay zeka destekli kontrol sistemimiz sayesinde argo, küfür ve rahatsız edici içerikler kolayca tespit edilip engellenir.",
      image: "/images/ai.jpg",
    },
    {
      id: 2,
      title: "Yapay Zeka ile Seslendirme",
      description:
        "Sesli kitap oluştururken kendi sesinizi kullanmak istemezseniz yapay zeka desteğiyle metinlerinizi profesyonelce seslendirebilirsiniz.",
      image: "/images/voice-ai.jpg",
    },
    {
      id: 3,
      title: "Yapay Zeka Aracımız Efso ile Yaratıcılığı Destekleyen Öneriler",
      description:
        "Hikayeleriniz için ilham eksikliği yaşadığınızda yapay zeka aracımız size bölümünüzü yazarken eksik kaldığınız noktalarda önerilerde bulunur ve yaratıcılığınızı destekler.",
      image: "/images/advice-system.png",
    },
    {
      id: 4,
      title: "Kitap Okuma/Oluşturma",
      description:
        "Dilediğiniz türde kitaplar oluşturabilir bu kitapları düzenleyebilir veya zevkinize uygun şekilde kolayca okuyabilirsiniz.",
      image: "/images/read-book.jpg",
    },
    {
      id: 5,
      title: "Sesli Kitap Dinleme",
      description:
        "Sesli kitapları dinleyerek hem farklı bir okuma deneyimi yaşayabilir hem de hikayelerin keyfini çıkarabilirsiniz.",
      image: "/images/listen-book.jpg",
    },
    {
      id: 6,
      title: "Kitap Listesi Oluşturma",
      description:
        "Kendinize özel ve sınırsız kişisel kitap listeleri oluşturup favori eserlerinizi düzenli bir şekilde saklayabilirsiniz.",
      image: "/images/book-list.jpg",
    },
    {
      id: 7,
      title: "Takip Etme",
      description:
        "Beğendiğiniz yazarları veya diğer okuyucuları takip ederek ilham alabilir ve yeni içeriklere hızlıca ulaşabilirsiniz.",
      image: "/images/add-friend.jpg",
    },
    {
      id: 8,
      title: "Akış",
      description:
        "Akışta dilediğiniz kitaplardan alıntılar paylaşabilir, takip ettiğiniz kişilerin paylaşımlarına akış üzerinden kolayca erişebilirsiniz.",
      image: "/images/feed.jpg",
    },
    {
      id: 9,
      title: "Mesajlaşma",
      description:
        "Diğer okuyucularla anlık mesajlaşarak etkili ve eğlenceli bir iletişim kurabilir, kitaplar hakkında sohbet edebilirsiniz.",
      image: "/images/chat.jpg",
    },
    {
      id: 10,
      title: "Bütün Cihazlardan Kolaylıkla Erişim",
      description:
        "Tüm cihazlardan kolayca erişilebilir olan kullanıcı dostu arayüzümüz, güvenli ve konforlu bir deneyim sunar.",
      image: "/images/efshane-device.png",
    }
  ]

  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "0",
    pauseOnHover: true,
    arrows: false,
    dots: true
  };

  return (
    <div className='about-us-page'>
      <section className="about-header text-center my-5">
          <h2>Hakkımızda</h2>
          <p className="lead about-us-content mt-3">
            Kitapları daha erişilebilir hale getirmek için geliştirdiğimiz bu uygulama, 
            kitap severlere kolayca kitap bulma ve keşfetme imkanı sunuyor.
          </p>
      </section>
      <section className="about-story py-5 mb-5">
        <div className="container">
            <div className="row mx-5">
                <div className="col-md-6 about-story-text">
                    <h4 className='mb-3 fw-bold'>Biz Kimiz?</h4>
                    <p className="lead">
                      Biz, iki bilgisayar mühendisliği 4. sınıf öğrencisi olarak teknoloji ve 
                      kitaplara duyduğumuz büyük tutkuyu bir araya getirerek, kitap okuma deneyimini 
                      dijital dünyada daha erişilebilir ve keyifli hale getirmek istedik. Kitap okumak, 
                      hayatımızın her anında bizlere ilham vermiş ve ufkumuzu genişletmiştir. Ancak günümüzde 
                      kitapların yüksek fiyatları ve bulundukları yerlerin sınırlı olması, birçok okurun bu 
                      zengin dünyaya erişimini zorlaştırmaktadır. İşte tam da bu noktada, teknolojiyle iç içe 
                      bir yaşam sürerken, dijital ortamda bir kitap uygulamasının ne kadar faydalı olabileceğini
                      düşündük. 
                      <br /><br />
                      Amacımız, kitaplara ve içeriklere kolayca ulaşabilmenizi sağlamak, sevdiğiniz
                      yazarları takip edebilmenize ve farklı türlerdeki kitapları zahmetsizce keşfetmenize olanak 
                      tanımaktır. Uygulamamız sayesinde, kitapları dijital ortamda daha erişilebilir hale getirerek, 
                      okuma alışkanlıklarınızı desteklemeyi hedefliyoruz. Kitapların pahalı olmasının, okuma 
                      deneyiminizin önünde bir engel olmaması gerektiğini düşünüyoruz ve bu yüzden sınırsız içerik 
                      ile kaliteli bir okuma deneyimi sunmayı amaçlıyoruz. 
                      <br /><br />
                      Bizim için teknoloji ve kitaplar sadece 
                      birer araç değil, birer yaşam biçimidir. İşte bu düşünceyle, okuma sevgisini her yaştan insanla 
                      paylaşmak ve onlara kolaylıkla erişebilecekleri bir kitap dünyası sunmak için bu projeyi geliştirdik.
                    </p>
                </div>
                <div className="col-md-6">
                  <img src="/images/aboutus.jpg" className="img-fluid" alt="Developers" width="510"/>
                </div>
            </div>
        </div>
      </section>
      <section className="about-features bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">Öne Çıkan Özelliklerimiz</h2>
          <Slider {...settings}>
            {features.map((feature) => (
              <div key={feature.id} className="text-center">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="img-fluid mb-4 feature-img"
                />
                <h5>{feature.title}</h5>
                <p>{feature.description}</p>
              </div>
            ))}
          </Slider>
        </div>
      </section>
      <section className="about-team py-5 mt-5">
        <div className="container">
            <h2 className="text-center mb-4 fw-">Ekibimiz</h2>
            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-12">
                    <div className="team-member text-center d-flex flex-column justify-content-center align-items-center">
                      <h4 className="mt-4 mb-3">Elif Rümeysa TURAN</h4>
                      <p className='opacity-50 member-degree'>Ön Yüz Geliştirici ve UI/UX Tasarımcısı</p>
                      <p className='line-wrapper'>
                        Bu projede, uygulamanın her bir detayını titizlikle tasarladım ve kullanıcı dostu 
                        bir deneyim oluşturmak için özen gösterdim. React.js ve Bootstrap gibi modern teknolojileri 
                        kullanarak, hem fonksiyonel hem de estetik açıdan güçlü bir uygulama geliştirdim. Tasarım 
                        sürecinde, kullanıcıların kolayca gezinebileceği, işlevsel ve erişilebilir bir arayüz sunmayı 
                        hedefledim. Her aşamada kullanıcı geri bildirimlerini dikkate alarak, uygulamanın performansını 
                        ve kullanıcı deneyimini en üst düzeye çıkarmaya odaklandım.
                      </p>
                    </div>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-12">
                <div className="team-member text-center d-flex flex-column justify-content-center align-items-center">
                  <h4 className="mt-4 mb-3">Fatmanur ÖZÇETİN</h4>
                  <p className='opacity-50 member-degree'>Arka Plan Geliştiricisi ve Veri Bilimci</p>
                  <p className='line-wrapper'>
                    Bu projede, güçlü ve verimli arka plan altyapıları kurarak API geliştirme, veritabanı yönetimi 
                    ve güvenlik sağlama alanlarında önemli katkılarda bulundum. Node.js ve Nest.js gibi modern 
                    teknolojilerle güvenli ve hızlı API'ler oluşturdum, veritabanı yönetimini etkin şekilde gerçekleştirdim.
                    Aynı zamanda uygulamanın güvenliğini sağlamak için gerekli önlemleri alarak, veri güvenliğini 
                    ön planda tuttum. Yapay zeka kısımlarını geliştirerek, uygulamanın daha akıllı ve etkileşimli 
                    hale gelmesini sağladım.
                  </p>
                </div>
              </div>
            </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}

export default AboutUs