import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <>
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Address */}
        <div className="footer-section">
          <img
            src="\Images\logo.png"
            alt="Asians Snacks Logo"
            className="footer-logo"
          />
          <p className="footer-address">
            Anugraha Foods
            <br />
            Vakathanam, Kottayam
            <br />
            Kerala, India, 686538
          </p>
        </div>

        {/* Company Links */}
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about_us">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/agency">Agency</a></li>
          </ul>
        </div>

        {/* Product Links */}
        <div className="footer-section">
          <h3>Products</h3>
          <ul>
            <li><a href="/products">Chips & Mixtures</a></li>
            <li><a href="/products">Savoury & Sweets</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="footer-section">
          <h3>Social Media</h3>
          <ul className="social-links">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i> Facebook
              </a>
            </li>
            <li>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i> YouTube
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}

    </footer>
          <div className="footer-bottom">
          Anugraha Food Products. All Rights Reserved |{" "}
          <a href="/terms-of-use">Terms of Use</a> |{" "}
          <a href="/privacy-policy">Privacy Policy</a>
        </div>
        </>
  );
};

export default Footer;
