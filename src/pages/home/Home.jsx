import { React, useState } from 'react'
import './Home.css'
import Navbar from '../../layouts/navbar/Navbar'
import NewRelases from './newrelases/NewRelases';
import Popular from './popular/Popular';
import Suggestion from './suggestion/Suggestion';
import Footer from '../../layouts/footer/Footer';
import ContinueRead from './continueread/ContinueRead';

function Home() {
  const [query, setQuery] = useState("");
  const [books] = useState([
    {
      id: 1,
      title: "Simyacı",
      author: "Paulo Coelho",
      cover: "/images/simyaci.jpg"
    },
    {
      id: 2,
      title: "Hayvan Çiftliği",
      author: "George Orwell",
      cover: "/images/hayvanciftligi.jpg"
    },
    {
      id: 3,
      title: "Savaş ve Barış",
      author: "Lev Tolstoy",
      cover: "/images/savas-baris.jpg"
    },
    {
      id: 4,
      title: "Maya ve Koca Ayı",
      author: "ferhatsekil",
      cover: "/images/savas-baris.jpg"
    },
  ])

  const [authors] = useState([
    { id: 1, name: "Pamukseker", profile: "/images/woman-pp.jpg" },
    { id: 2, name: "Tolstoy", profile: "/images/pp.jpg" },
    { id: 3, name: "Ferhatsekil", profile: "/images/pp.jpg" },
  ]);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="home-page">
      <Navbar/>
      <div className="search-section">
        <div className="search-overlay">
          <div className="container text-start text-white">
            <h1 className="search-title">Kitapların Sonsuz Dünyasını
              <br /> Keşfetmeye Hazır Mısınız?</h1>
            <p className="search-subtitle mb-4">
              Aradığınız kitabı veya yazarı keşfetmek için hemen aşağıya yazın,<br /> 
              hayalinizdeki esere bir adım daha yaklaşın!
            </p>
            <div className="search-bar mt-4 position-relative">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Kitap veya yazar ara..."
                />
                <button className="input-group-text search-icon">
                  <i className="bi bi-search"></i>
                </button>
              </div>
              {/* Search Details */}
              {query && (
                <div className="search-results">
                  {/* Book results */}
                  {filteredBooks.map((book) => (
                    <div className="search-book-item d-flex mb-2" key={book.id}>
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="search-book-cover me-3"
                        style={{ width: "60px", height: "90px" }}
                      />
                      <div className="search-book-info d-flex flex-column align-items-start">
                        <h6 className="search-book-title mb-1 text-muted">{book.title}</h6>
                        <p className="search-book-author text-muted mb-0">{book.author}</p>
                      </div>
                    </div>
                  ))}
                  {/* Author results */}
                  {filteredAuthors.map((author) => (
                    <div className="search-author-item d-flex mb-2" key={author.id}>
                      <img
                        src={author.profile}
                        alt={author.name}
                        className="search-author-profile me-3"
                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                      />
                      <div className="search-author-info">
                        <h6 className="search-author-name mb-0 text-muted d-flex">{author.name}</h6>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ContinueRead/>
      <NewRelases/>
      <Popular/>
      <Suggestion/>
      <Footer/>
    </div>
  )
}

export default Home