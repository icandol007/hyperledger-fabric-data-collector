// server.js
const express = require('express');
const nano = require('nano')('http://admin:password@localhost:5984'); // CouchDB URL with credentials
const app = express();
const port = 3000;

// CouchDB 데이터베이스 선택
const chaincodeDB = nano.db.use('smart_contract_pool'); // 'chaincode_db'는 CouchDB 데이터베이스 이름

// 정적 파일 제공
app.use(express.static('public'));

// 체인코드 조회 API
app.get('/api/chaincode/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await chaincodeDB.get(id);
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chaincode from CouchDB', details: error });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});