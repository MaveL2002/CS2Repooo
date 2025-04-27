import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Fixed import
import axios from 'axios';
import './QRCodeGenerator.css';

const QRCodeGenerator = () => {
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState('');
  const [selectedResidentData, setSelectedResidentData] = useState(null);
  const [qrData, setQrData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/residents');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setResidents(response.data.data); // Fixed: accessing data.data
      } else {
        console.error('Invalid data structure received:', response.data);
        setResidents([]);
        setError('Failed to load residents data');
      }
    } catch (error) {
      console.error('Error fetching residents:', error);
      setError('Failed to fetch residents');
      setResidents([]);
    }
  };

  const handleResidentSelect = (e) => {
    const residentId = e.target.value;
    setSelectedResident(residentId);
    
    if (residentId) {
      const resident = residents.find(r => r._id === residentId);
      if (resident) {
        setSelectedResidentData(resident);
        // Create QR code data
        const qrContent = {
          residentId: resident.residentId || resident._id,
          name: `${resident.firstName} ${resident.lastName}`,
          address: {
            street: resident.address?.street || '',
            barangay: resident.address?.barangay || '',
            city: resident.address?.city || '',
            province: resident.address?.province || ''
          },
          contactNumber: resident.contactNumber,
          civilStatus: resident.civilStatus,
          dateOfBirth: resident.dateOfBirth
        };
        setQrData(JSON.stringify(qrContent));
      }
    } else {
      setSelectedResidentData(null);
      setQrData('');
    }
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('.qr-code-display canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${selectedResidentData.firstName}_${selectedResidentData.lastName}_QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="qr-generator-container">
      <h2>QR Code Generator</h2>
      <div className="qr-form">
        <div className="form-group">
          <label>Select Resident:</label>
          <select value={selectedResident} onChange={handleResidentSelect}>
            <option value="">Select a resident</option>
            {Array.isArray(residents) && residents.map(resident => (
              <option key={resident._id} value={resident._id}>
                {`${resident.firstName} ${resident.lastName}`}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        {selectedResidentData && (
          <div className="resident-preview">
            <h3>Selected Resident Information</h3>
            <p><strong>Name:</strong> {`${selectedResidentData.firstName} ${selectedResidentData.lastName}`}</p>
            <p><strong>Contact:</strong> {selectedResidentData.contactNumber}</p>
            <p><strong>Address:</strong> {
              [
                selectedResidentData.address?.houseNumber,
                selectedResidentData.address?.street,
                selectedResidentData.address?.barangay,
                selectedResidentData.address?.city,
                selectedResidentData.address?.province
              ].filter(Boolean).join(', ')
            }</p>
          </div>
        )}

        {qrData && (
          <div className="qr-code-display">
            <QRCodeCanvas 
              value={qrData}
              size={256}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/barangay-logo.png", // Optional: add your barangay logo
                x: null,
                y: null,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
            <button 
              className="download-btn" 
              onClick={downloadQRCode}
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;