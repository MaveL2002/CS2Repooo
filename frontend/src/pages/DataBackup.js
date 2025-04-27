import React, { useState } from 'react';

const DataBackup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackup = async (format) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:5000/api/residents/export?format=${format}`, {
        method: 'GET',
        headers: {
          'Accept': format === 'csv' ? 'text/csv' : 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `residents_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Backup error:', error);
      setError(`Error creating backup: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Data Backup</h1>
          
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={() => handleBackup('json')}
                disabled={loading}
                className={`flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium 
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                  transition-colors`}
              >
                {loading ? 'Creating Backup...' : 'Download as JSON'}
              </button>
              
              <button
                onClick={() => handleBackup('csv')}
                disabled={loading}
                className={`flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium 
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'} 
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
                  transition-colors`}
              >
                {loading ? 'Creating Backup...' : 'Download as CSV'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-6 text-sm text-gray-500">
              <h2 className="font-semibold text-gray-700 mb-2">Export Options:</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>JSON format: Complete data structure with all relationships</li>
                <li>CSV format: Spreadsheet-compatible format for easy viewing and editing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBackup;