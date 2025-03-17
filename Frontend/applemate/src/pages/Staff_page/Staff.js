import React, { useState } from 'react';
import './staff.css';
import Navbar from '../../components/Navbar';
import Staff_sidebar from '../../components/Staff_sidebar';

function Staff() {


  return (
    <>
    <div><Navbar/></div>
    <div><Staff_sidebar/></div>
    </>
  );
}

export default Staff;
