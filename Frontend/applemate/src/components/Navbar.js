import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthenticationContext';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userType, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark position-absolute w-100 fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src="/Images/logo.png" alt="Logo" width="100" height="50" className="d-inline-block align-text-top" />
          </a>
          <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav d-none d-lg-flex">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about_us">About Us</Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">Profile</Link>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>&times;</button>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/about_us">About Us</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>

      {/* Optional Backdrop */}
      {isOpen && <div className="backdrop" onClick={toggleSidebar}></div>}
    </>
  );
}

export default Navbar;