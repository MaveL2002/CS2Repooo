// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ResidentRegistration from './pages/ResidentRegistration';
import ResidentList from './pages/ResidentList';
import QRCodeGenerator from './pages/QRCodeGenerator';
import DataBackup from './pages/DataBackup';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<ResidentRegistration />} />
            <Route path="/residents" element={<ResidentList />} />
            <Route path="/qr-generator" element={<QRCodeGenerator />} />
            <Route path="/backup" element={<DataBackup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;