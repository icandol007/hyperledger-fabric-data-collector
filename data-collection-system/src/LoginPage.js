import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, password })
    });

    const result = await response.json();
    if (response.ok) {
      alert('Login successful');
      navigate('/'); // 로그인 성공 시 메인 페이지로 리디렉션
    } else {
      alert('Failed to login: ' + result.error);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form id="loginForm" onSubmit={handleSubmit}>
        <input
          type="text"
          id="id"
          name="id"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;