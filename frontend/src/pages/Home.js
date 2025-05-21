// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Barangay Hinaplanon</h1>
        <p>A management system for barangay residents and services</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>Resident Registration</h3>
          <p>Register new residents in the barangay database with comprehensive profile information.</p>
          <Link to="/register" className="feature-link">Register Residents</Link>
        </div>
        
        <div className="feature-card">
          <h3>Resident Management</h3>
          <p>View, edit, and manage resident profiles with easy-to-use interface.</p>
          <Link to="/residents" className="feature-link">Manage Residents</Link>
        </div>
        
        <div className="feature-card">
          <h3>QR Code Generation</h3>
          <p>Generate QR codes for resident identification and quick profile access.</p>
          <Link to="/qr-generator" className="feature-link">Generate QR Codes</Link>
        </div>
        
        <div className="feature-card">
          <h3>Data Backup & Recovery</h3>
          <p>Create backups of resident data in various formats for safe record keeping.</p>
          <Link to="/backup" className="feature-link">Backup Data</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;