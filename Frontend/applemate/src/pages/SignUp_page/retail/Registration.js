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

  // Retail Seller Fields
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  // Wholesale Dealer Fields
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [wholesalePhone, setWholesalePhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  // Function to get CSRF token from cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !email || !password || !userType) {
      alert("Please fill in all required fields.");
      return;
    }

    let formData = {
      username,
      email,
      password,
      user_type: userType,
    };

    if (userType === "retail_seller") {
      formData = {
        ...formData,
        store_name: storeName,
        owner_name: ownerName,
        phone_number: phoneNumber,
        store_address: storeAddress,
      };
    } else if (userType === "wholesale_dealer") {
      formData = {
        ...formData,
        company_name: companyName,
        contact_person: contactPerson,
        phone_number: wholesalePhone,
        company_address: companyAddress,
      };
    }

    try {
      const csrftoken = getCookie("csrftoken");
      const endpoint =
        userType === "retail_seller"
          ? "/api/register-retailer/"
          : "/api/register-wholesale/";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken, // Add CSRF token
        },
        credentials: "include", // Include cookies
        body: JSON.stringify(formData),
      });

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
        const errorText = await response.text();
        throw new Error(`Unexpected response format: ${errorText}`);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="registration-container">
        {/* Left Section */}
        <div className="left-section">
          <img src="\Images\side-image_(1).jpg" alt="Side Image" className="side-image" />
          <div className="overlay">
            <h1>Welcome to<br></br> AppleMate</h1>
            <p>Join us today and be part of something amazing!</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="registration-box">
            <h2>Register Here..</h2>
            <form onSubmit={handleSubmit}>
              {/* Common Fields */}
              
              <div className="reg-form-row">
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>
              </div>
              <div className="reg-form-row">

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* User Type Selection */}
              <div className="input-group">
                <label>User Type</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                >
                  <option value="">Select User Type</option>
                  <option value="retail_seller">Retail Seller</option>
                  <option value="wholesale_dealer">Wholesale Dealer</option>
                </select>
              </div>
              </div>

              {/* Retail Seller Form */}
              {userType === "retail_seller" && (
                <>
                <div className="reg-form-row">
                  <div className="input-group">
                    <label>Store Name</label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Owner Name</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="reg-form-row">

                  <div className="input-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Store Address</label>
                    <textarea
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
                </>
              )}

              {/* Wholesale Dealer Form */}
              {userType === "wholesale_dealer" && (
                <>
                  <div className="input-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Contact Person</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={wholesalePhone}
                      onChange={(e) => setWholesalePhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Company Address</label>
                    <textarea
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button type="submit" className="reg-submit-button">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;
