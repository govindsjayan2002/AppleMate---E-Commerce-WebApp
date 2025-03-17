import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registration.css";
import Navbar from "../../../components/Navbar";

function Registration() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  // Function to get CSRF token from cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !email || !password || !userType) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = {
      username,
      email,
      password,
      user_type: userType,
      ...(userType === "retail_seller" && {
        store_name: storeName,
        owner_name: ownerName,
        phone_number: phoneNumber,
        store_address: storeAddress,
      }),
    };

    try {
      const csrftoken = getCookie('csrftoken');
      
      const response = await fetch("/api/register-retailer/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,  // Add CSRF token
        },
        credentials: 'include',  // Include cookies
        body: JSON.stringify(formData),
      });

      // Check if the response is in JSON format
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Registration failed. Try again.");
        }
        
        localStorage.setItem("userType", userType);
        
        alert("Registration successful! Awaiting admin approval.");
        navigate("/login");
      } else {
        // Handle non-JSON responses
        const errorText = await response.text();
        throw new Error(`Unexpected response format: ${errorText}`);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message);
    }
  };

  // Rest of the component remains the same...
  return (
    <>
      <Navbar />
      <div className="registration_container">
        <div className="registration_box">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            {/* Form fields remain the same */}
            <div className="input_group">
              <label>User Type</label>
              <select value={userType} onChange={(e) => setUserType(e.target.value)} required>
                <option value="">Select User Type</option>
                <option value="retail_seller">Retail Seller</option>
                <option value="wholesale_dealer">Wholesale Dealer</option>
              </select>
            </div>

            <div className="input_group">
              <label>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="input_group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="input_group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {userType === "retail_seller" && (
              <>
                <div className="input_group">
                  <label>Store Name</label>
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
                </div>

                <div className="input_group">
                  <label>Owner Name</label>
                  <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
                </div>

                <div className="input_group">
                  <label>Phone Number</label>
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>

                <div className="input_group">
                  <label>Store Address</label>
                  <textarea value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} required />
                </div>
              </>
            )}

            <button type="submit" className="submit_button">Register</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Registration;