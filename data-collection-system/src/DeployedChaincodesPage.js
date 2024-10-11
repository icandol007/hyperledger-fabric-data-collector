import React, { useEffect, useState } from 'react';
import './DeployedChaincodesPage.css';
import './ChaincodeDataEntry.css';
import ChaincodeDataEntry from './ChaincodeDataEntry';

function ChaincodeSelection() {
  const [chaincodes, setChaincodes] = useState([]);
  const [selectedChaincode, setSelectedChaincode] = useState(null);

  useEffect(() => {
    // 배포된 체인코드 목록을 가져오기 위한 API 호출
    async function fetchChaincodes() {
      try {
        const response = await fetch('/api/deployed-chaincodes');
        const result = await response.json();
        setChaincodes(result);
      } catch (error) {
        console.error('Error fetching chaincodes:', error);
      }
    }
    fetchChaincodes();
  }, []);

  const handleChaincodeSelect = (chaincode) => {
    setSelectedChaincode(chaincode);
  };

  return (
    <div className="chaincode-selection-container">
      <h3>Select a Deployed Chaincode</h3>
      <ul>
        {chaincodes.map((chaincode, index) => (
          <li key={index} onClick={() => handleChaincodeSelect(chaincode)}>
            {chaincode.name} (Version: {chaincode.version})
          </li>
        ))}
      </ul>

      {selectedChaincode && <ChaincodeDataEntry chaincodeName={"AirQuality"} />}
    </div>
  );
}

export default ChaincodeSelection;