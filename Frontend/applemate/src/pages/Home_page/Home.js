import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './home.css'; 
import Navbar from '../../components/Navbar';

function Home() {
  return (
    <>
    <Navbar/>
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
    <section className='home-sec1'>
      <div className='sec1-left-items'>
        <p>Crunching happiness, one bite at a time</p>
      </div>
      <div className='sec1-right-items'>
        <img src='\Images\side-image_(2).jpg'/>
        
      </div>
    </section>
    <section className='home-sec2'>
      <div className='sec2-left-items'>

      </div>
      <div className='sec2-right-items'>

      </div>
    </section>
    <section className='home-sec3'>
      <div className='sec3-left-items'>
      <p>“From our kitchen to your table, the perfect treat!”</p>
      </div>
      <div className='sec3-right-items'>
        
      </div>
    </section>
    </>
  );
}

export default Home;
