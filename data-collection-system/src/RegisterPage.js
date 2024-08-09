// RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password, username, name }),
    });

    if (response.ok) {
      alert('회원가입이 완료되었습니다.');
      navigate('/');
    } else {
      const result = await response.json();
      setErrorMessage('회원가입에 실패했습니다: ' + result.error);
    }
  };

  return (
    <div className="page">
      <div className="titleWrap">
        회원가입
      </div>
      <form className="contentWrap" onSubmit={handleRegister}>
        <div className="inputWrap">
          <div className="inputTitle">ID</div>
          <input
            className="input"
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div className="inputWrap">
          <div className="inputTitle">Password</div>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="inputWrap">
          <div className="inputTitle">사용자 이름</div>
          <input
            className="input"
            type="text"
            placeholder="사용자 이름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="inputWrap">
          <div className="inputTitle">이름</div>
          <input
            className="input"
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {errorMessage && (
          <div className="errorMessageWrap">{errorMessage}</div>
        )}
        <button className="bottomButton" type="submit">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
