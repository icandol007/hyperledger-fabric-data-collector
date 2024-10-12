import React, { useEffect, useState } from 'react';
import './DeploySmartContractPage.css';

const DeploySmartContractPage = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        const templates = await response.json();
        setTemplates(templates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateClick = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleDeployClick = async () => {
    if (!selectedTemplateId) return;

    setIsDeploying(true);

    try {
      const response = await fetch('/api/deploy-smart-contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ templateId: selectedTemplateId })
      });

      if (response.ok) {
        alert('Smart contract deployed successfully');
      } else {
        const error = await response.json();
        alert('Failed to deploy smart contract: ' + error.error);
      }
    } catch (error) {
      console.error('Error deploying smart contract:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div>
      <h1>Smart Contract Deployment</h1>
      <div id="template-list">
        <h2>Select a Smart Contract Template to Deploy</h2>
        <ul id="templates">
          {templates.map((templateId) => (
            <li
              key={templateId}
              className={selectedTemplateId === templateId ? 'selected' : ''}
              onClick={() => handleTemplateClick(templateId)}
            >
              {templateId}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleDeployClick} disabled={!selectedTemplateId || isDeploying}>
        {isDeploying ? 'Deploying...' : 'Deploy Selected Contract'}
      </button>
    </div>
  );
};

export default DeploySmartContractPage;