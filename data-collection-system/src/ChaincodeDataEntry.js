import React, { useEffect, useState } from 'react';
import './ChaincodeDataEntry.css';

function ChaincodeDataEntry({ chaincodeName }) {
  const [metadata, setMetadata] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const response = await fetch(`/api/chaincode-metadata/${chaincodeName}`);
        if (!response.ok) {
          throw new Error(`Error fetching metadata: ${response.statusText}`);
        }
        const data = await response.json();
        setMetadata(data);
        setFormData(
          Object.keys(data).reduce((acc, key) => {
            acc[key] = '';
            return acc;
          }, {})
        );
      } catch (error) {
        console.error('Error fetching chaincode metadata:', error);
        setError('Failed to load chaincode metadata. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchMetadata();
  }, [chaincodeName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setStatus('Submitting data...');
      const response = await fetch('/api/create-asset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chaincodeName, data: formData }),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus('Data submitted successfully');
      } else {
        setStatus('Failed to submit data: ' + result.error);
      }
    } catch (error) {
      setStatus('Error submitting data: ' + error.message);
    }
  };

  if (loading) {
    return <p>Loading metadata...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="chaincode-data-entry-container">
      <h3>Enter data for chaincode: {chaincodeName}</h3>
      {Object.keys(metadata).length > 0 ? (
        Object.keys(metadata).map((key) => (
          <div key={key}>
            <label>{key} ({metadata[key]}): </label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          </div>
        ))
      ) : (
        <p>No metadata available for this chaincode.</p>
      )}
      <button onClick={handleSubmit}>Submit</button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default ChaincodeDataEntry;