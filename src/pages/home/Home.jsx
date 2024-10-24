import { React } from 'react'
import './Home.css'
import Navbar from '../../layouts/navbar/Navbar'
import NewRelases from './newrelases/NewRelases';
import Popular from './popular/Popular';
import Suggestion from './suggestion/Suggestion';
import ContactUs from './contactus/ContactUs';
import Footer from '../../layouts/footer/Footer';
import ContinueRead from './continueread/ContinueRead';

function Home() {
  return (
    <div className="home-page">
      <Navbar/>
      <ContinueRead/>
      <NewRelases/>
      <Popular/>
      <Suggestion/>
      <ContactUs/>
      <Footer/>
    </div>
  )
}

export default Home