import React, { useState } from 'react';
import axios from 'axios';
import './ResidentForm.css';

const ResidentForm = () => {
  const [residentData, setResidentData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: '',
    civilStatus: '',
    contactNumber: '',
    email: '',
    address: {
      street: '',
      houseNumber: '',
      barangay: '',
      city: '',
      province: '',
      zipCode: ''
    },
    occupation: '',
    monthlyIncome: '',
    voterStatus: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setResidentData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setResidentData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (!residentData.firstName || !residentData.lastName || !residentData.dateOfBirth || 
        !residentData.gender || !residentData.civilStatus || !residentData.contactNumber) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Prepare data for submission
      const dataToSend = {
        ...residentData,
        monthlyIncome: residentData.monthlyIncome === '' ? 0 : parseFloat(residentData.monthlyIncome)
      };

      console.log('Sending data:', JSON.stringify(dataToSend, null, 2));

      const response = await axios.post('http://localhost:5000/api/residents', dataToSend);
      
      if (response.data.success) {
        setSuccess('Resident registered successfully!');
        // Reset form
        setResidentData({
          firstName: '',
          lastName: '',
          middleName: '',
          dateOfBirth: '',
          gender: '',
          civilStatus: '',
          contactNumber: '',
          email: '',
          address: {
            street: '',
            houseNumber: '',
            barangay: '',
            city: '',
            province: '',
            zipCode: ''
          },
          occupation: '',
          monthlyIncome: '',
          voterStatus: false
        });
      }
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        setError(`Error: ${error.response.data.error || error.response.data.message || 'Unknown error'}`);
      } else {
        setError('Network error or server is not responding');
      }
    }
  };

  return (
    <div className="resident-form-container">
      <h2>Resident Registration Form</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={residentData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={residentData.middleName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={residentData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={residentData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={residentData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Civil Status *</label>
              <select
                name="civilStatus"
                value={residentData.civilStatus}
                onChange={handleChange}
                required
              >
                <option value="">Select Civil Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                name="contactNumber"
                value={residentData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={residentData.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Address Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>House Number</label>
              <input
                type="text"
                name="address.houseNumber"
                value={residentData.address.houseNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                name="address.street"
                value={residentData.address.street}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Barangay</label>
              <input
                type="text"
                name="address.barangay"
                value={residentData.address.barangay}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="address.city"
                value={residentData.address.city}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Province</label>
              <input
                type="text"
                name="address.province"
                value={residentData.address.province}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                name="address.zipCode"
                value={residentData.address.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="occupation"
                value={residentData.occupation}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Monthly Income</label>
              <input
                type="number"
                name="monthlyIncome"
                value={residentData.monthlyIncome}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group voter-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="voterStatus"
                  checked={residentData.voterStatus}
                  onChange={handleChange}
                />
                Registered Voter
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">Register Resident</button>
        </div>
      </form>
    </div>
  );
};

export default ResidentForm;