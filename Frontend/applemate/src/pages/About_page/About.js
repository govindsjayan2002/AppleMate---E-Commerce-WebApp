import React from 'react';
import Navbar from '../../components/Navbar';
import './about.css';
import InquirySection from '../../components/Enquiry';
import Footer from '../../components/Footer';

function About() {
  return (
    <>
            <Navbar />
            <div className="about-container">
                <div className="about-header">
                    <h1>About Us</h1>
                    <p className="about-tagline">"Delivering Excellence, One Step at a Time"</p>
                </div>
                <div className="about-content">
                    <div className="who-we-are">
                        <div className="us-contents">
                            <div className="us-header">
                                <div className="us-contents-header">
                                    <h1>Who We Are</h1>
                                    <div className="underline"></div>
                                </div>
                                <img src="/Images/who_we_are.png" alt="Who we are" className="who-we-are-image" />
                            </div>
                            <p>
                            At AppleMate, we are driven by a passion for delivering exceptional products and services to our customers. 
                            Since our inception in 1998 as Anugraha Food Products, we have grown from humble beginnings in Vakathanam, Kottayam district, Kerala, into a trusted name in the industry. 
                            Our journey began with a vision to make quality accessible and affordable for everyone, and this commitment has guided us every step of the way. 
                            With a focused approach and dedicated efforts, we have continuously upgraded our snacks manufacturing processes using advanced technology. 
                            Over the years, we have expanded our production capacity and refined our quality assurance standards to ensure the highest level of hygiene and excellence in every product we offer. 
                            Today, innovation and customer satisfaction remain at the heart of everything we do.
                            </p>
                        </div>
                        <div className="about-image">
                            <img src="/Images/about_image.png" alt="About Us" className="about-us-image" />
                        </div>
                    </div>
                    <div className="mission">
                        <div className="mission-header">
                            <h2>Our Mission</h2>
                            <hr className="mission-underline" />
                            <img src="/Images/mission.png" alt="Our Mission" className="mission-image" />
                        </div>
                        <p>
                            Our mission is to enrich lives by delivering high-quality, affordable products that exceed customer expectations.
                            We aim to set new standards in the industry while maintaining the highest levels of hygiene and quality.
                        </p>
                    </div>
                    <div className="why-choose-us">
                      <div className="why-choose-us-header">
                        <h2>Why Choose Us?</h2>
                        <img src="/Images/why_us.png" alt="Why Choose Us" className="why-choose-us-image" />
                      </div>
                      <ul className="why-choose-us-list">
                        <li>High-quality products</li>
                        <li>Exceptional customer service</li>
                        <li>Affordable pricing</li>
                        <li>Innovative solutions</li>
                      </ul>
                    </div>

                    <div className="contact-us">
                      <div className="contact-us-header">
                        <h2>Contact Us</h2>
                        <img src="/Images/contact_us.png" alt="Contact Us" className="contact-us-image" />
                      </div>
                      <p>
                        Have questions or need assistance? Feel free to reach out to us at
                        <a href="mailto:support@applemate.com"> support@applemate.com</a>.
                      </p>
                    </div>
                </div>
            </div>
            <InquirySection />
            <Footer />
        </>
  );
}

export default About;
