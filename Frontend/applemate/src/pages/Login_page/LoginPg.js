import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthenticationContext';
import Navbar from '../../components/Navbar';
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  // Function to get CSRF token from cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Add the missing change handlers
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const csrftoken = getCookie('csrftoken');
      
      // Update the API endpoint to match your backend URL pattern
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Use the auth context to handle login
      // Store the authentication token and user type
      login(data.token || 'token', data.user_type || data.role);

      // Also store any additional user information if needed
      localStorage.setItem('username', data.username);

      // Redirect user based on role/user_type
      if (data.role === 'admin' || data.user_type === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.user_type === 'retail_seller') {
        navigate('/profile');
      } else if (data.user_type === 'wholesale_dealer') {
        navigate('/profile');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='login_container'>
        <div className='login_image_container'>
          <img src='/Images/side-image_(3).jpg' alt='Decorative' />
        </div>
        <div className='login_box'>
          <div className='login_form'>
            <div className='form_title'>Login</div>
            {error && <p className="error_message">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className='input_elements'>
                <div className='login_items'>
                  <img src='/Images/user_icon.png' alt='User Icon' />
                  <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={handleUsernameChange}
                    required
                  />
                </div>
                <div className='login_items'>
                  <img src='/Images/pwd_icon.png' alt='Password Icon' />
                  <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>
              <div className='submit-container'>
                <button 
                  type="submit" 
                  className='submit'
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
            <div className='links'>
              <a href='/signup'>Don't have an account? Sign Up</a>
              <br />
              <a href='/retail_signup'>Register as Retailer/Wholesaler</a>
              <br />
              <a href='/forgot-password'>Forgot Password?</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;