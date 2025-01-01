import React, { useEffect, useState } from 'react'
import './ReadBook.css'
import Navbar from '../../layouts/navbar/Navbar'
import Footer from '../../layouts/footer/Footer'
import { Button, Dropdown } from 'react-bootstrap'

function ReadBook() {
    const [liked, setLiked] = useState(false);
    const [addedToLibrary, setAddedToLibrary] = useState(false);
    const [selectedSection, setSelectedSection] = useState(1);
    const [newComment, setNewComment] = useState('');

    const handleLike = () => {
        setLiked(!liked);
        setSections(prevSections => 
            prevSections.map(section => 
                section.id === selectedSection 
                    ? { 
                        ...section, 
                        likeCount: liked ? section.likeCount - 1 : section.likeCount + 1 
                    } 
                    : section
            )
        );
    }

    const handleAddToLibrary = () => {
        setAddedToLibrary(!addedToLibrary);
    }

    const [section, setSections] = useState([
        {
            id: 1,
            image: "/images/bg.jpg",
            title: "1. Bölüm",
            readCount: 869,
            likeCount: 320,
            commentCount: 3,
            content: "icerik"
        },
        {
            id: 2,
            image: "",
            title: "2. Bölüm",
            readCount: 800,
            likeCount: 309,
            commentCount: 1,
            content: "bölüm içeriği"
        },
        {
            id: 3,
            image: "/images/bg4.jpg",
            title: "3. Bölüm",
            readCount: 579,
            likeCount: 200,
            commentCount: 0,
            content: "bölüm içeriği"
        }
    ])

    const [comments, setComments] = useState([
        {
            sectionId: 1,
            userProfile: "/images/profile.jpg",
            userName: "elifturan",
            content: "Harika bir bölüm, çok beğendim!"
        },
        {
            sectionId: 1,
            userProfile: "/images/profile2.jpg",
            userName: "fatmanurozcetin",
            content: "Konu oldukça ilginç, devamını sabırsızlıkla bekliyorum."
        },
        {
            sectionId: 2,
            userProfile: "/images/woman-pp.jpg",
            userName: "senasener",
            content: "Bölüm gerçekten sürükleyiciydi, çok keyif aldım."
        }
    ])

    const goToNextSection = () => {
        if (selectedSection < section.length) {
            setSelectedSection(selectedSection + 1);
            window.scrollTo(0,0);
        }
    }

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    }

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            const newCommentObj = {
                sectionId: selectedSection,
                userProfile: "/images/profile.jpg",
                userName: "elifturan",
                content: newComment
            };
            setComments([newCommentObj, ...comments]);
            setNewComment('');
        }
    }

    const handleCommentScroll = () => {
        const commentSection = document.querySelector('.comments-section');
        commentSection.scrollIntoView({ behavior: 'smooth' });
    }

  return (
    <>
        <div className="read-book-page">
            <div className="read-book-nav">
                <div className="sections-dropdown">
                    <Dropdown>
                        <Dropdown.Toggle>
                            Bölümler
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {section.map(section => (
                                <Dropdown.Item key={section.id} onClick={() => setSelectedSection(section.id)}>
                                    {section.title}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="book-title">
                    <span className='text-center ms-5'>Aşk ve Gurur</span>
                </div>
                <div className="actions">
                    <span onClick={handleLike} className={liked ? 'liked' : ''}>
                        <i className={`bi me-2 ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                        {liked ? 'Beğenildi' : 'Beğen'}
                    </span>
                    <span onClick={handleAddToLibrary} className={addedToLibrary ? 'added' : ''}>
                        <i className={`bi me-2 ${addedToLibrary ? 'bi-book-fill' : 'bi-book'}`}></i> 
                        {addedToLibrary ? 'Kitaplıktan Kaldır' : 'Kitaplığa Ekle'}
                    </span>
                </div>
            </div>
            <div className="read-book-content">
                {section.map((section) => {
                    if(section.id === selectedSection) {
                        return (
                            <div className="section-details" key={section.id}>
                                {section.image && (
                                    <img 
                                        src={section.image} 
                                        alt={section.title}
                                        className='section-image'
                                    />
                                )}
                                <h3>{section.title}</h3>
                                <div className="statistics d-flex gap-3">
                                    <p className='d-flex'><i className="bi bi-eye me-2"></i>{section.readCount}</p>
                                    <p className='d-flex'><i className="bi bi-heart me-2"></i>{section.likeCount}</p>
                                    <p className='d-flex' onClick={handleCommentScroll} style={{cursor: 'pointer'}}><i className="bi bi-chat me-2"></i>{section.commentCount}</p>
                                </div>
                                <div className="content">
                                    “Bir adamın servet sahibi olduğu bilinir bilinmez, kendisine bir eşin eksik 
                                    olduğu kabul edilir.” Bu, Meryton civarında tartışmasız bir gerçekti ve bu gerçek,
                                    Bay Bennet'in ailesinde de sıkça dile getirilirdi. Longbourn’daki Bennet ailesi, 
                                    bu tür haberlerin hızla yayıldığı bir çevrede yaşamaktaydı. Komşuluk, sosyal 
                                    beklentiler ve dedikodu, bu topluluğun vazgeçilmez unsurlarındandı. Bay 
                                    Bingley’nin Netherfield Park’ı kiraladığı haberi, Longbourn’a ulaşır ulaşmaz 
                                    Bennet ailesinde büyük bir heyecan uyandırmıştı. Bayan Bennet, yeni gelen bu 
                                    genç ve varlıklı beyin, kızlarından biriyle evlenebileceğini umarak durumu kendi 
                                    çıkarına çevirmeyi bir görev bilmişti. Beş kız çocuğuna sahip bir anne olarak, 
                                    gelecekte kızlarının güvence altında olması onun için her şeyden önemliydi. 
                                    Ancak kocası Bay Bennet, bu konuda oldukça alaycı bir tavır sergiliyordu. 
                                    “Sevgilim,” dedi Bayan Bennet, akşam yemeği sırasında, haberin etkisini henüz 
                                    atlatamamış bir sesle, “Netherfield sonunda kiralandı. Zengin bir genç adam oraya 
                                    yerleşiyor. Onunla hemen tanışmalısınız!” Bay Bennet, gözlerini kitabından 
                                    kaldırmadan cevap verdi: “Bu haberi duyduğuma sevindim. Ancak neden onunla 
                                    tanışmam gerektiğini anlamış değilim.” Bayan Bennet, bu tür cevaplarla sık sık 
                                    karşılaştığından, sabırsızlıkla ekledi: “Ama Bay Bennet, bunu nasıl anlamazsınız? 
                                    Kızlarımızdan biri onunla evlenebilir! Bu bizim için harika bir fırsat.” “Peki ya 
                                    genç adamın bu konuda bir tercihi yoksa? Belki de kendisi bir eş istemiyordur,” 
                                    dedi Bay Bennet, eşinin endişelerine alaycı bir ifadeyle karşılık vererek. Bayan 
                                    Bennet bu tür yorumları umursamayarak planlarını sürdürüyordu. Gerçekten de, Bay 
                                    Bingley’nin bir balo düzenlemeyi düşündüğü haberi yayılmıştı ve bu haber, 
                                    özellikle Bennet kızları arasında heyecan uyandırmıştı. Jane, ailenin en büyük 
                                    kızı ve zarif bir mizaca sahip olanı, Bay Bingley’le tanışma ihtimali konusunda 
                                    sessiz bir mutluluk duyarken; Elizabeth, ailenin ikinci kızı, olan biteni 
                                    eleştirel bir merakla izliyordu. Elizabeth Bennet, zekâsı ve keskin gözlemleriyle 
                                    tanınırdı. Onun için, bu tür sosyal etkinlikler yalnızca bir eğlence fırsatı 
                                    değil, aynı zamanda insan doğasının incelenebileceği bir sahneydi. Ablası Jane'in
                                    masum ve iyimser tavırlarıyla tezat oluşturan Elizabeth, çevresindeki olayları 
                                    sorgulayan bir karakterdi. “Jane,” dedi Elizabeth, o akşam kız kardeşiyle baş 
                                    başa kaldığında, “bu yeni beyefendinin nasıl biri olduğunu merak ediyorum. Eğer 
                                    annemin söyledikleri doğruysa, tüm çevremiz onun etrafında pervane olacak gibi 
                                    görünüyor.” <br /><br />Jane, tebessüm ederek yanıtladı: “Eğer annemin planları gerçekleşirse,
                                    belki de onunla dans edecek kadar şanslı oluruz. Kim bilir, belki oldukça nazik 
                                    biridir.” Elizabeth güldü. “Umarım öyledir. Fakat zengin bir adamın nezaketle 
                                    birleştiği ender görülür. Genellikle servet, insanları kibirli yapar.” Bu konuşma 
                                    sürerken, ailenin diğer üyeleri de kendi heyecanlarıyla meşguldü. Lydia ve Kitty, 
                                    Bay Bingley hakkında daha fazla bilgi edinebilmek için sürekli olarak annelerine 
                                    sorular soruyor; Mary ise herkesin heyecanına rağmen, kendi kitaplarına dalmış bir
                                    haldeydi. <br /><br />Bennet ailesinin her bir üyesi, yeni gelen bu beyefendinin hayatlarına 
                                    nasıl bir etki yapacağını kendi bakış açılarıyla değerlendiriyordu. Netherfield 
                                    Park’ın yeni sahibi Bay Bingley hakkında söylentiler, yalnızca Bennet ailesiyle 
                                    sınırlı kalmamıştı. Tüm kasaba, onun gelirini, yakışıklılığını ve bekar oluşunu 
                                    konuşuyordu. Bingley, birkaç gün içinde çevredeki aileleri ziyaret etmeye başlamış
                                    ve kısa sürede herkesin ilgisini kazanmıştı. Güler yüzlü ve sıcak kanlı tavırları,
                                    onu diğer zengin beyefendilerden ayırıyordu. Ancak herkesin merak ettiği bir 
                                    diğer konu, onun arkadaşları ve özellikle Bay Darcy hakkında çıkan söylentilerdi.
                                    Bay Darcy, Bay Bingley’nin yakın arkadaşı olarak tanıtılmış ve onunla birlikte 
                                    Netherfield’daki bir etkinliğe katılmıştı. <br /><br />Ancak Darcy’nin soğuk ve mesafeli 
                                    tavırları, kasabadaki insanların üzerinde olumsuz bir izlenim bırakmıştı. Darcy, 
                                    Londra’dan gelmiş, zengin ve oldukça gururlu bir adam olarak tanınıyordu. Bu 
                                    nitelikler, onun sosyal ortamlarda fazla sevilmemesine yol açmıştı. Özellikle 
                                    ilk baloda Elizabeth ile olan kısa ve gergin konuşması, iki karakter arasındaki 
                                    zıtlığın ilk işareti olmuştu. Elizabeth, Bay Darcy’nin kibirli tavırlarına 
                                    rağmen, onun karakterine dair daha fazla şey öğrenmek istiyordu. İnsanların 
                                    yüzeyde gördüklerinden daha fazlasının olduğunu hissetmişti. Ancak Darcy’nin, 
                                    Elizabeth’i “ordinary” olarak nitelendirmesi, genç kadının gururunu zedelemişti. 
                                    Bu olay, Elizabeth ve Darcy arasındaki ilk çatışmayı doğurmuştu. Elizabeth, 
                                    Darcy’nin bu yorumuna alaycı bir şekilde karşılık vermemiş olsa da, içten içe 
                                    onu küçümsemişti. Darcy ise kendi gururu nedeniyle, Elizabeth’in zekâsını ve 
                                    keskin mizah anlayışını fark etmekte gecikmişti. Netherfield balosu, yalnızca 
                                    Bennet ailesi için değil, tüm kasaba halkı için unutulmaz bir etkinlik olmuştu. 
                                    Bay Bingley’nin Jane ile olan nazik ve sıcak sohbetleri, iki aile arasında olası 
                                    bir evlilik ihtimalinin ilk sinyallerini vermişti. Elizabeth ise bu sırada, Bay
                                    Darcy’nin mesafeli duruşunu ve çevresindekilere olan soğuk yaklaşımını izliyordu. 
                                    Bu, onun Darcy hakkındaki düşüncelerini daha da sertleştirmişti. Ancak Elizabeth, 
                                    Darcy’nin zengin ve kibirli bir adam olmasının ötesinde bir şeyler sakladığını 
                                    hissediyordu. Bu his, onu, Darcy’yi daha fazla anlamaya ve onun zırhını çözmeye 
                                    teşvik edecekti. Fakat ilk etapta, bu ikisi arasındaki ilişki yalnızca karşılıklı 
                                    yanlış anlamalar ve önyargılar üzerine inşa edilmişti. Bennet ailesinin günlük 
                                    hayatı, balo sonrası yeniden rutinine dönmüştü. Ancak Bayan Bennet, Bay 
                                    Bingley’nin Jane ile olan samimi ilişkisini güçlendirmek için her fırsatı 
                                    değerlendirme çabasındaydı. Longbourn, dedikodular, umutlar ve hayal 
                                    kırıklıklarıyla dolu bir yer olmaya devam etti.
                                </div>
                            </div>
                        )
                    }
                    return null;
                })}

                {selectedSection < section.length && (
                    <Button className='next-section-btn' onClick={goToNextSection}>
                        Sonraki Bölüme Geç <i className="bi bi-chevron-right ms-2"></i>
                    </Button>
                )}
                {selectedSection == section.length && (
                    <div class="alert alert-success mt-3" role="alert">
                        Hikayenin sonuna geldiniz. 
                        <br />
                        Başka bir hikayede tekrar buluşmak dileğiyle...
                    </div>
                )}

               
                <div className="comments-section mt-4">
                    <h4 className='mb-2'>Yorumlar</h4>
                    {comments.filter(comment => comment.sectionId === selectedSection).length === 0 ? (
                        <p style={{fontSize: '0.9rem', opacity: "0.8"}}>Henüz yorum yapılmadı.</p>
                    ): (
                        comments.filter(comment => comment.sectionId === selectedSection).map((comment,index) => (
                            <div className="comment d-flex" key={index}>
                                <img src={comment.userProfile} alt={comment.userName} className="user-profile-img" />
                                <div className="comment-details ms-3">
                                    <p className="user-name mb-1"><strong>{comment.userName}</strong></p>
                                    <p className="comment-content mb-0">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                    
                </div>

                <div className="comment-input mt-3">
                    <textarea
                        className="form-control"
                        value={newComment}
                        onChange={handleCommentChange}
                        rows="3"
                        placeholder="Siz de bir yorum ekleyin..."
                    />
                    <Button
                        className="mt-2"
                        onClick={handleCommentSubmit}
                    >
                        Yorum Yap
                    </Button>
                </div>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default ReadBook