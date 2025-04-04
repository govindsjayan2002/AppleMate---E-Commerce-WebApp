import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './home.css'; 
import Navbar from '../../components/Navbar';
import InquirySection from '../../components/Enquiry';
import Footer from '../../components/Footer';

function Home() {
  return (
    <>
    <Navbar/>
    <section className="project-title-section">
    <div className="carousel-overlay">
    <h1 className="carousel-title"><span>apple</span>mate</h1>
    <p className="carousel-tagline"><em>you will love to share</em></p>
  </div>
  <Carousel id="carouselExample" className="carousel slide">
    <Carousel.Item>
      <img
        className="d-block w-100 carousel-image"
        src="\Images\cover_picture_(1).png" 
        alt="First slide"
      />
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="d-block w-100 carousel-image"
        src="\Images\cover_picture_(2).jpg" 
        alt="Second slide"
      />
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="d-block w-100 carousel-image"
        src="\Images\cover_picture_(3).png" 
        alt="Third slide"
      />
    </Carousel.Item>
  </Carousel>
    </section>
    <section className='home-sec1'>
            <div className='sec1-left-items'>
                <p>
                    <span className='crunch'>Crunching</span> happiness, one bite at a time
                </p>
            </div>
            <div className='sec1-right-items'>                
                    <img src='/Images/Sec_image2.png' alt='Snack'/>
            </div>
        </section>
        <section className='home-sec2'>
          <div className='sec2-left-items'>
            <img src='/Images/Sec_image1.jpg' alt='Snack' className='sec2-image'/>
          <div className='sec2-overlay'>
            <p>“From our kitchen to your table, the <span>perfect</span> treat!”</p>
          </div>
          </div>
        </section>

    <section>
      <InquirySection/>
    </section>
    <section>
      <Footer/>
    </section>
    </>
  );
}

export default Home;
