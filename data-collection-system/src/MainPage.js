import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';  // RegisterPage.css 파일을 import

const MainPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await fetch('/api/me');
        const data = await response.json();
        if (data.loggedIn) {
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching login status:', error);
      }
    }
    checkLoginStatus();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="page">
      <div className="titleWrap">
        <h1>Data Collection System</h1>
      </div>
      {user ? (
        <div id="userInfo" className="user-info">
          <div>Logged in as {user.id}</div>
          <button id="logoutBtn" className="logout-btn bottomButton" onClick={logout}>로그아웃</button>
        </div>
      ) : (
        <div className="contentWrap">
          <button id="loginBtn" className="bottomButton" onClick={() => navigate('/login')}>로그인</button>
          <button id="registerBtn" className="bottomButton" onClick={() => navigate('/register')}>회원가입</button>
        </div>
      )}
      {user && user.isAdmin && (
        <div className="contentWrap">
          <button id="templateListBtn" className="bottomButton" onClick={() => navigate('/template-list')}>스마트 컨트랙트 템플릿 리스트</button>
          <button id="monitorSmartContractsBtn" className="bottomButton" onClick={() => navigate('/monitor-smart-contracts')}>스마트 컨트랙트 모니터링</button>
          <button id="deploySmartContractBtn" className="bottomButton" onClick={() => navigate('/deploy-smart-contract')}>스마트 컨트랙트 배포</button>
        </div>
      )}
      {user && !user.isAdmin && (
        <div className="contentWrap">
          <button id="collectDataBtn" className="bottomButton" onClick={() => navigate('/collect-data')}>데이터 수집하기</button>
          <button id="participateDataCollectionBtn" className="bottomButton" onClick={() => navigate('/participate-data-collection')}>데이터 수집에 참여하기</button>
        </div>
      )}
    </div>
  );
};

export default MainPage;
