import React, { useEffect, useState } from 'react';
import './MyChaincodePage.css';

function MyChaincodePage() {
  const [chaincodes, setChaincodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChaincodes = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/mychaincode');
        if (!response.ok) {
          throw new Error(`Error fetching chaincodes: ${response.statusText}`);
        }
        const data = await response.json();
        setChaincodes(data.chaincodeName);
      } catch (error) {
        console.error('Error fetching chaincodes:', error);
        setError('Failed to load chaincodes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChaincodes();
  }, []);

  return (
    <div className="my-chaincodes-page-container">
      <h2>나의 데이터 수집</h2>
      {loading ? (
        <p>Loading my deployed chaincodes...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : chaincodes.length > 0 ? (
        <ul>
          {chaincodes.map((chaincode, index) => (
            <li key={index}>
              <div>
                <strong>Chaincode Name:</strong> {chaincode.chaincodename}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No deployed chaincodes found.</p>
      )}
    </div>
  );
}

export default MyChaincodePage;