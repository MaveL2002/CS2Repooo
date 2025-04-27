// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Adopt-a-Barangay</h1>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/register">Register Resident</Link></li>
        <li><Link to="/residents">View Residents</Link></li>
        <li><Link to="/qr-generator">QR Generator</Link></li>
        <li><Link to="/backup">Data Backup</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;