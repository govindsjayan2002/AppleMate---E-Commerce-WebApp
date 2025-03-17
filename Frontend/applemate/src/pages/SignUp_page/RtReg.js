import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './rtform.css'; // Import the CSS
import Navbar from '../../components/Navbar';
import { FormDataContext } from './FormDataContext';  // Import the context

function RtReg() {
  const navigate = useNavigate();
  const { formData } = useContext(FormDataContext);  
  const [email, setEmail] = useState(formData.email || "");  
  const [username, setUsername] = useState(formData.username || "");  
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/register-retailer/", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,  
          email: email,  // ✅ Ensure email is sent
          store_name: shopName,
          owner_name: ownerName,
          mobile_number: mobileNumber,
          store_address: storeAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      alert("Retail Seller Registration successful! Awaiting admin approval.");
      navigate("/login");  

    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message);
    }
  };

  

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className='rtreg-signup_container'>
        <div className='rtreg-image_container'>
          <img src='\Images\side-image_(1).jpg' alt='Decorative' />
        </div>
        <div className='rtreg-signup_box'>
          <div className='rtreg-signup_form'>
            <div className='text'>Registration</div>
            <form onSubmit={handleSubmit}>
              <div className='rtreg-input_elements'>
                <div className='rtreg-input_items'>
                  <img src='\Images\user_icon.png' alt='User Icon' />
                  <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className='rtreg-input_items'>
                  <img src='\Images\email_icon.png' alt='Email Icon' />
                  <input type='email' placeholder='Email' value={email}  onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className='rtreg-input_items'>
                  <img src='\Images\email_icon.png' alt='Email Icon' />
                  <input
                    type='text'
                    placeholder='Shop name'
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                  />
                </div>
                <div className='rtreg-input_items'>
                  <img src='\Images\email_icon.png' alt='Email Icon' />
                  <input
                    type='text'
                    placeholder='Owner name'
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                  />
                </div>
                <div className='rtreg-input_items'>
                  <img src='\Images\email_icon.png' alt='Email Icon' />
                  <input
                    type='number'
                    placeholder='Mobile number'
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div className='rtreg-input_items' >
                <img src='\Images\email_icon.png' alt='Email Icon' />
                  <textarea type='text' placeholder='Store Address'
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    required  
                    className="rtreg-address-input"
                  />
                </div>
              </div>
              <div className='submit-container'>
                <button type="submit" className='submit'>Register</button>
              </div>
            </form>
            <div className='links'>
              <a href='/login'>Already have an account? Login</a>
              <br />
              <a href='/forgot-password'>Forgot Password?</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RtReg;
