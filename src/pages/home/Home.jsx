import { React, useState } from 'react'
import './Home.css'
import Navbar from '../../layouts/navbar/Navbar'
import NewRelases from './newrelases/NewRelases';
import Popular from './popular/Popular';
import Suggestion from './suggestion/Suggestion';
import Footer from '../../layouts/footer/Footer';
import ContinueRead from './continueread/ContinueRead';
import axios from 'axios';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ books: [], users: [] });

  const handleSearch = async() => {
    try {
      const response = await axios.get(`http://localhost:3000/book/search`, {
        params: { query },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  }

  const debouncedSearch = debounce(handleSearch, 500);

  const filteredBooks = results.books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredUsers = results.users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="home-page">
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
                  onChange={(e) => {
                    setQuery(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                  placeholder="Kitap veya yazar ara..."
                />
                <button className="input-group-text search-icon" onClick={handleSearch}>
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
                        src={book.bookCover}
                        alt={book.title}
                        className="search-book-cover me-3"
                        style={{ width: "60px", height: "90px" }}
                      />
                      <div className="search-book-info d-flex flex-column align-items-start">
                        <h6 className="search-book-title mb-1 text-muted">{book.title}</h6>
                        <p className="search-book-author text-muted mb-0">{book.user?.username}</p>
                      </div>
                    </div>
                  ))}
                  {/* Author results */}
                  {filteredUsers.map((user) => (
                    <div className="search-author-item d-flex mb-2" key={user.id}>
                      <img
                        src={user.profile_image}
                        alt={user.username}
                        className="search-author-profile me-3"
                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                      />
                      <div className="search-author-info">
                        <h6 className="search-author-name mb-0 text-muted d-flex">{user.username}</h6>
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