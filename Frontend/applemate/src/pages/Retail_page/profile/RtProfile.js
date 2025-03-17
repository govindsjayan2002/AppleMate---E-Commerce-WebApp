import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import RetailSidebar from "../../../components/RetailSidebar";
import "./rtprofile.css";

function RtProfile() {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetch("/api/RtDetails/", {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setUserDetails(data))
      .catch((error) => console.error("Error fetching user details:", error));
  }, []);

  return (
    <>
      <section className="rt-profile-container">
        {/* Navbar */}
        <div className="nav-section">
          <Navbar />
        </div>

        {/* Main Profile Content */}
        <div className="rt-profile-content">
          {/* Sidebar */}
          <div className="sidebar-section">
            <RetailSidebar />
          </div>

          {/* Profile Details Section */}
          <div className="rt-profile-section">
            <h1 className="profile-heading">Profile</h1>

            {/* Profile Card */}
            <div className="profile-card">
              {/* Profile Image Section */}
              <div className="profile-image">
                <img src="\Images\UserProfile.png" alt="Profile" className="profile-pic" />
              </div>

              {/* User Info Section */}
              <div className="profile-info">
                {userDetails ? (
                  <>
                    <p><strong>Username:</strong> {userDetails.username}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Store Name:</strong> {userDetails.store_name || "N/A"}</p>
                    <p><strong>Phone Number:</strong> {userDetails.phone_number || "N/A"}</p>
                    <p><strong>Address:</strong> {userDetails.store_address || "N/A"}</p>
                    <p><strong>Joined:</strong> {new Date(userDetails.date_joined).toLocaleDateString()}</p>
                  </>
                ) : (
                  <p>Loading profile details...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default RtProfile;
