// styles.js
import styled from 'styled-components';

export const Container = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #f4f6f9;
`;

export const Title = styled.h1`
  margin-bottom: 20px;
`;

export const Button = styled.button`
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

  &:hover {
    background-color: #0056b3;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  div {
    margin-right: 10px;
  }
`;

export const LogoutButton = styled(Button)`
  padding: 5px 10px;
  font-size: 12px;
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

export const Hidden = styled.div`
  display: none;
`;
