import React, { useState } from 'react';

const ParticipateDataCollection = () => {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/participate-data-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Feedback submitted successfully');
      } else {
        setMessage('Failed to submit feedback: ' + result.error);
      }
    } catch (error) {
      setMessage('Failed to submit feedback: ' + error.message);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1>데이터 수집에 참여하기</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback"
            required
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>Submit</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: 0,
    backgroundColor: '#f4f6f9',
  },
  container: {
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  textarea: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    margin: '10px 0',
  },
};

export default ParticipateDataCollection;