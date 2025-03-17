import React, { useState } from 'react';
import { faBars, faCartShopping, faListCheck, faLock, faPowerOff, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthenticationContext';
import './retail_sidebar.css';

function RetailSidebar() {
    const [isExpanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    const toggleSidebar = () => {
        setExpanded(!isExpanded);
    };
    
    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            navigate('/');
        }
    };
    
    return (
        <div className={`retail-sidebar ${isExpanded ? "expanded" : ""}`}>
            <div className='rt-menu-icon' onClick={toggleSidebar} style={{justifyContent: isExpanded ? "flex-start" : "center"}}>
                <FontAwesomeIcon icon={faBars} style={isExpanded ? { marginLeft: "30px"} : {}} />
            </div>
            <div className='rt-menu-items'>
                <div className='rt-menu-item rt-link' onClick={() => navigate('/rtcart')} > 
                    <FontAwesomeIcon icon={faCartShopping} className="rt-icon" />
                    {isExpanded && <span>Cart</span>}
                </div>
                <div className='rt-menu-item rt-link' onClick={() => navigate('/orders')} >
                    <FontAwesomeIcon icon={faListCheck} className="rt-icon" />
                    {isExpanded && <span>Orders</span>}
                </div>
                <div className='rt-menu-item rt-link' onClick={() => navigate('/profile')} >
                    <FontAwesomeIcon icon={faUser} className="rt-icon" />
                    {isExpanded && <span>Profile Details</span>}
                </div>
                <div className='rt-menu-item rt-link' onClick={() => navigate('/change-password')} >
                    <FontAwesomeIcon icon={faLock} className="rt-icon" />
                    {isExpanded && <span>Change Password</span>}
                </div>
                <div className='rt-menu-item rt-link' onClick={handleLogout}>
                    <FontAwesomeIcon icon={faPowerOff} className='rt-icon'/>
                    {isExpanded && <span>Logout</span>}
                </div>
            </div>
        </div>
    );
}

export default RetailSidebar;