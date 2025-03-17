import React from 'react'
import './staff_sidebar.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, 
  faClipboardUser, 
  faMoneyCheckDollar, 
  faUser, 
  faLock, 
  faPowerOff 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Staff_sidebar() {
    const [isExpanded, setExpanded] = useState(false);

    const navigate = useNavigate()

    const handleLogout = async () =>{
      const success = await logout()
      if(success)
        navigate('/')
    }
  
    const toggleSidebar = () => {
      setExpanded(!isExpanded);
    };
  return (
    
          <div className={`staff-sidebar ${isExpanded ? "expanded" : ""}`}>
            <div className="menu-icon" onClick={toggleSidebar} style={{justifyContent: isExpanded ? "flex-start" : "center"}} >
              <FontAwesomeIcon icon={faBars} style={isExpanded ? { marginLeft: "30px"} : {}} />
            </div>
            <div className="menu-items">
              <div className="menu-item">
                {/* <FontAwesomeIcon icon={faClipboardUser} className="icon" />
                {isExpanded && <span>Attendance</span>}
              </div>
              <div className="menu-item">
                <FontAwesomeIcon icon={faMoneyCheckDollar} className="icon" onClick={() => navigate("")} />
                {isExpanded && <span>Salary</span>} */}
              </div>
              <div className="menu-item">
                <FontAwesomeIcon icon={faUser} className="icon" onClick={() => navigate('/staff-profile')}/>
                {isExpanded && <span>Profile Details</span>}
              </div>
              <div className="menu-item">
                <FontAwesomeIcon icon={faLock} className="icon" onClick={() => navigate('/staff-chngpwd')}/>
                {isExpanded && <span>Change Password</span>}
              </div>
              <div className="menu-item">
                <FontAwesomeIcon icon={faPowerOff} className="icon" onClick={handleLogout}/>
                {isExpanded && <span>Logout</span>}
              </div>
            </div>
    </div>
  );
}

export default Staff_sidebar