import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import TemplateListPage from './TemplateListPage';
import TemplateViewPage from './TemplateViewPage';
import TemplateEditorPage from './TemplateEditorPage';
import ChaincodeContentPage from './ChaincodeContentPage';
import ChaincodeViewer from './ChaincodeViewer';
import CollectDataPage from './CollectDataPage';
import ParticipateDataCollection from './ParticipateDataCollection';
import DeploySmartContractPage from './DeploySmartContractPage';
import MonitorSmartContracts from './MonitorSmartContracts';
import DeployedChaincodesPage from './DeployedChaincodesPage';
import ChaincodeDataEntry from './ChaincodeDataEntry';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/template-list" element={<TemplateListPage />} />
        <Route path="/template-view/:id" element={<TemplateViewPage />} />
        <Route path="/template-editor/:id" element={<TemplateEditorPage />} />
        <Route path="/chaincode-content/:id" element={<ChaincodeContentPage />} />
        <Route path="/chaincode-viewer" element={<ChaincodeViewer />} />
        <Route path="/collect-data" element={<CollectDataPage />} />
        <Route path="/participate-data-collection" element={<ParticipateDataCollection />} />
        <Route path="/deploy-smart-contract" element={<DeploySmartContractPage />} />
        <Route path="/monitor-smart-contracts" element={<MonitorSmartContracts />} />
        <Route path="/deployed-chaincodes" element={<DeployedChaincodesPage />} />
        <Route path="/create-asset" element={<ChaincodeDataEntry/>} />
      </Routes>
    </Router>
  );
}

export default App;