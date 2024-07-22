const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 3000;

const requestListener = (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.method === 'POST' && req.url === '/register') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const username = params.get('username');
      try {
        execSync(`node registerUser.js ${username}`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Successfully registered user: ${username}`);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Failed to register user: ${username}`);
      }
    });
  } else if (req.method === 'POST' && req.url === '/deploy') {
    const chaincodeName = 'test';
    const chaincodePath = '../chaincode/test';
    const chaincodeLabel = 'test_1.0';

    try {
      // 체인코드 배포 스크립트를 Node.js로 실행
      execSync(`node deployChaincode.js ${chaincodeName} ${chaincodePath} ${chaincodeLabel}`);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('체인코드 배포가 완료되었습니다.');
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`체인코드 배포에 실패했습니다: ${error.message}`);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

const server = http.createServer(requestListener);
server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
