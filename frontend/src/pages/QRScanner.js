import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';
import axios from 'axios';
import './QRScanner.css';

const QRScanner = () => {
  const navigate = useNavigate();
  const [delay, setDelay] = useState(500);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setResult(data.text);

      // Try to parse the QR data and process it
      try {
        const parsedData = JSON.parse(data.text);
        fetchResidentByQR(parsedData);
      } catch (err) {
        setError('Invalid QR code format. Please scan a valid resident QR code.');
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner error:', err);
    setError('Error accessing camera. Please make sure you have given permission to use the camera.');
  };

  const fetchResidentByQR = async (qrData) => {
    setLoading(true);
    setError('');

    try {
      // Check if the QR data contains a resident ID
      if (!qrData.residentId) {
        setError('QR code does not contain valid resident data.');
        setLoading(false);
        return;
      }

      // First try to fetch by the custom resident ID
      const response = await axios.get(`http://localhost:5000/api/residents?residentId=${qrData.residentId}`);

      if (response.data && response.data.success && response.data.data.length > 0) {
        setResident(response.data.data[0]);
        setIsCameraActive(false); // Stop camera when resident is found
      } else {
        setError('Resident not found. Please try scanning again.');
      }
    } catch (error) {
      console.error('Error fetching resident:', error);
      setError('Error retrieving resident data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
    setError('');
    setResident(null);
    setResult(null);
  };

  const navigateToEdit = () => {
    if (resident && resident._id) {
      navigate(`/edit-resident/${resident._id}`);
    }
  };

  const previewStyle = {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
  };

  return (
    <div className="qr-scanner-container">
      <h2>QR Code Scanner</h2>
      <p className="scanner-description">
        Scan a resident's QR code to quickly access their information
      </p>

      <div className="scanner-controls">
        <button 
          className={`scanner-button ${isCameraActive ? 'stop' : 'start'}`}
          onClick={toggleCamera}
        >
          {isCameraActive ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isCameraActive && (
        <div className="scanner-area">
          <div className="scanner-frame">
            <QrScanner
              delay={delay}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
            />
            <div className="scanner-overlay">
              <div className="scanner-corners">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
              </div>
            </div>
          </div>
          <p className="scanning-instruction">Position the QR code within the frame</p>
        </div>
      )}

      {loading && <div className="loading">Loading resident data...</div>}

      {resident && (
        <div className="resident-details">
          <h3>Resident Information</h3>
          <div className="resident-info-card">
            <div className="resident-info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{`${resident.firstName} ${resident.middleName ? resident.middleName + ' ' : ''}${resident.lastName}`}</span>
            </div>
            <div className="resident-info-row">
              <span className="info-label">ID:</span>
              <span className="info-value">{resident.residentId}</span>
            </div>
            <div className="resident-info-row">
              <span className="info-label">Gender:</span>
              <span className="info-value">{resident.gender}</span>
            </div>
            <div className="resident-info-row">
              <span className="info-label">Civil Status:</span>
              <span className="info-value">{resident.civilStatus}</span>
            </div>
            <div className="resident-info-row">
              <span className="info-label">Contact:</span>
              <span className="info-value">{resident.contactNumber}</span>
            </div>
            <div className="resident-info-row">
              <span className="info-label">Address:</span>
              <span className="info-value">
                {resident.address ? 
                  `${resident.address.houseNumber || ''} ${resident.address.street || ''}, ${resident.address.barangay || ''}, ${resident.address.city || ''}` : 
                  'N/A'}
              </span>
            </div>
          </div>
          <div className="resident-actions">
            <button className="edit-resident-btn" onClick={navigateToEdit}>
              Edit Resident
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;