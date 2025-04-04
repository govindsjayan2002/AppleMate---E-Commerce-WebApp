import React from 'react';
import './enquiry.css';

const InquirySection = () => {

    const getCSRFToken = () => {
        let csrfToken = null;
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            if (key === 'csrftoken') csrfToken = value;
        });
        return csrfToken;
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const enquiryData = {
            name: document.getElementById('name').value,
            subject: document.getElementById('subject').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
        };
    
        try {
            const response = await fetch('/api/enquiries/submit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),  // Add CSRF token here
                },
                credentials: 'include',  // Include cookies
                body: JSON.stringify(enquiryData),
            });
    
            if (response.ok) {
                alert('Enquiry submitted successfully!');
            } else {
                const data = await response.json();
                alert(`Failed to submit enquiry: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting your enquiry.');
        }
    };
    
    
    return (
        <div className="inquiry-container">
            <div className="inquiry-header">
                <div className="title-container">
                    <h2 className="title">Enquiry</h2>
                    <hr className="title-underline" />
                </div>
                <img src="\Images\Enquiry_icon.png" alt="Enquiry Icon" className="enquiry-icon"/>
            </div>
            <form className="inquiry-content">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Enter Your Name Here" 
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <select id="subject" className="form-input">
                            <option value="">Select Subject</option>
                            <option value="Feedback">Feedback</option>
                            <option value="Complaint">Complaint</option>
                            <option value="Inquiry">Inquiry</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Enter Your Email Here" 
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Mobile Number</label>
                        <input 
                            type="text" 
                            id="phone" 
                            placeholder="Enter Your Mobile Number Here" 
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="form-group full-width">
                    <label htmlFor="message">Message</label>
                    <textarea 
                        id="message" 
                        placeholder="Your Message" 
                        rows="4" 
                        className="form-textarea"
                    ></textarea>
                </div>
                <button type="submit" className="inquiry-submit-button" onClick={handleSubmit}>
                    Submit
                </button>
            </form>
            <div className="contact-info">
                <p><strong>Phone:</strong> +91 9845679023</p>
                <p><strong>Email:</strong> applemate@gmail.com</p>
                <p><strong>Address:</strong> Anugraha Foods, Vakathanam P.O Kottayam</p>
            </div>
        </div>
    );
};

export default InquirySection;
