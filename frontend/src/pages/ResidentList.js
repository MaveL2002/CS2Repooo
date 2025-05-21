import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ResidentList.css';

const ResidentList = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/residents');
      
      // Check if the response has the expected structure
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setResidents(response.data.data); // Access the data array from response.data.data
      } else {
        setError('Invalid data format received from server');
        setResidents([]);
      }
    } catch (error) {
      console.error('Error fetching residents:', error);
      setError('Failed to fetch residents');
      setResidents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resident?')) {
      try {
        await axios.delete(`http://localhost:5000/api/residents/${id}`);
        // Refresh the list after deletion
        fetchResidents();
      } catch (error) {
        console.error('Error deleting resident:', error);
        setError('Failed to delete resident');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading residents...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="resident-list-container">
      <h2>Resident List</h2>
      
      {residents.length === 0 ? (
        <p>No residents found. Add some residents to see them here.</p>
      ) : (
        <table className="residents-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Civil Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(residents) && residents.map((resident) => (
              <tr key={resident._id}>
                <td>{`${resident.firstName} ${resident.middleName ? resident.middleName + ' ' : ''}${resident.lastName}`}</td>
                <td>{resident.contactNumber}</td>
                <td>{resident.address ? 
                  `${resident.address.street || ''}, ${resident.address.barangay || ''}, ${resident.address.city || ''}` : 
                  'N/A'}</td>
                <td>{resident.civilStatus}</td>
                <td>
                  <div className="action-buttons">
                    <Link 
                      to={`/edit-resident/${resident._id}`} 
                      className="edit-btn"
                    >
                      Edit
                    </Link>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(resident._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResidentList;