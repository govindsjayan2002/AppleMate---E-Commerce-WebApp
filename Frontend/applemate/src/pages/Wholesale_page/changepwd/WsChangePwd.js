import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import RetailSidebar from "../../../components/RetailSidebar";
import "./chngpwd.css";

function ChangePwd() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/changepwd/", {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_password: newPassword, confirm_password: confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Password change failed");
      }

      setSuccess("Password changed successfully! Redirecting to login...");
      localStorage.removeItem("authToken");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="rt-pwd-container">
      <Navbar />
      <div className="rt-pwd">
        <RetailSidebar />
        <div className="chng-pwd-section">
          <h1>Change Password</h1>
          <form onSubmit={handleSubmit}>
            {error && <p className="error-msg">{error}</p>}
            {success && <p className="success-msg">{success}</p>}

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-change">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ChangePwd;
