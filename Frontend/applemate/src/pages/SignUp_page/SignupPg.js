import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FormDataContext } from "./FormDataContext"; // Import the context
import "./signup.css"; // Import the CSS

function Signup() {
  const { setFormData } = useContext(FormDataContext); // ✅ Store data in Context
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // ✅ Fix: Define state for userType

  const userTypes = ["Retail seller", "Wholesale dealer"]; // ✅ Fix: Define userTypes array

  // ✅ Fix: Define handleChange function
  const handleChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !email || !password || !userType) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, user_type: userType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed. Try again.");
      }

      // ✅ Store username & email for Registration form
      setFormData({ username, email });

      // ✅ Redirect to Registration Form
      navigate("/rtreg");
    } catch (error) {
      console.error("Signup failed:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup_container">
        <div className="image_container">
          <img src="/Images/side-image_(1).jpg" alt="Decorative" />
        </div>
        <div className="signup_box">
          <div className="signup_form">
            <div className="text">Sign Up</div>
            <form onSubmit={handleSubmit}>
              <div className="input_elements">
                <div className="input_items">
                  <img src="/Images/user_icon.png" alt="User Icon" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="input_items">
                  <img src="/Images/email_icon.png" alt="Email Icon" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input_items">
                  <img src="/Images/pwd_icon.png" alt="Password Icon" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {/* ✅ Fix: Use <select> instead of <input> */}
                <div className="input_items">
                  <img src="/Images/user_type.png" alt="User Type Icon" />
                  <select value={userType} onChange={handleChange} required>
                    <option value="">Select User Type</option>
                    {userTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="submit-container">
                <button type="submit" className="submit">
                  Signup
                </button>
              </div>
            </form>
            <div className="links">
              <a href="/login">Already have an account? Login</a>
              <br />
              <a href="/forgot-password">Forgot Password?</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
