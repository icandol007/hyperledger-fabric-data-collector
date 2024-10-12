import React, { useState } from 'react';
import './DeploySmartContractPage.css'; // 스타일링 파일

function DeploySmartContract() {
  const [chaincodeName, setChaincodeName] = useState('');
  const [chaincodePath, setChaincodePath] = useState('');
  const [chaincodeLabel, setChaincodeLabel] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handleDeploy = async () => {
    setLoading(true); // 로딩 상태 시작
    try {
      const response = await fetch('/api/deploy-smart-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chaincodeName,
          chaincodePath,
          chaincodeLabel,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Smart contract deployed successfully: ' + result.message);
      } else {
        alert('Failed to deploy smart contract: ' + result.error);
      }
    } catch (error) {
      alert('Error deploying smart contract: ' + error.message);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div className="form-container">
      <h3>Deploy Smart Contract</h3>
      <label>Chaincode Name:</label>
      <input
        type="text"
        value={chaincodeName}
        onChange={(e) => setChaincodeName(e.target.value)}
        required
      />
      <label>Chaincode Path:</label>
      <input
        type="text"
        value={chaincodePath}
        onChange={(e) => setChaincodePath(e.target.value)}
        required
      />
      <label>Chaincode Label:</label>
      <input
        type="text"
        value={chaincodeLabel}
        onChange={(e) => setChaincodeLabel(e.target.value)}
        required
      />
      <button onClick={handleDeploy} disabled={loading}>
        {loading ? 'Deploying...' : 'Deploy'}
      </button>
      {loading && <div className="loader"></div>} {/* 로딩 스피너 추가 */}
    </div>
  );
}

export default DeploySmartContract;
