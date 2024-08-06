import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="container">
      <style>{`
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f4f6f9;
        }
        .container {
          text-align: center;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          margin-bottom: 20px;
        }
        button {
          display: block;
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: white;
        }
        button:hover {
          background-color: #0056b3;
        }
        .hidden {
          display: none;
        }
        .user-info {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
        .user-info div {
          margin-right: 10px;
        }
        .logout-btn {
          padding: 5px 10px;
          font-size: 12px;
          background-color: #dc3545;
        }
        .logout-btn:hover {
          background-color: #c82333;
        }
      `}</style>
      <h1>Data Collection System</h1>
      {user ? (
        <div id="userInfo" className="user-info">
          <div>Logged in as {user.id}</div>
          <button id="logoutBtn" className="logout-btn" onClick={logout}>로그아웃</button>
        </div>
      ) : (
        <>
          <button id="loginBtn" onClick={() => navigate('/login')}>로그인</button>
          <button id="registerBtn" onClick={() => navigate('/register')}>회원가입</button>
        </>
      )}
      {user && user.isAdmin && (
        <>
          <button id="templateListBtn" onClick={() => navigate('/template-list')}>스마트 컨트랙트 템플릿 리스트</button>
          <button id="monitorSmartContractsBtn" onClick={() => navigate('/monitor-smart-contracts')}>스마트 컨트랙트 모니터링</button>
          <button id="deploySmartContractBtn" onClick={() => navigate('/deploy-smart-contract')}>스마트 컨트랙트 배포</button>
        </>
      )}
      {user && !user.isAdmin && (
        <>
          <button id="collectDataBtn" onClick={() => navigate('/collect-data')}>데이터 수집하기</button>
          <button id="participateDataCollectionBtn" onClick={() => navigate('/participate-data-collection')}>데이터 수집에 참여하기</button>
        </>
      )}
    </div>
  );
};

export default MainPage;