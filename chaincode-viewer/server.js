const express = require('express');
const nano = require('nano')('http://admin:password@localhost:5984'); // CouchDB URL with credentials
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// CouchDB 데이터베이스 선택
const chaincodeDB = nano.db.use('smart_contract_pool'); // 'chaincode_db'는 CouchDB 데이터베이스 이름

// 루트 경로에 대한 요청을 main.html로 리디렉션
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

// 정적 파일 제공
app.use(express.static('public'));
app.use(bodyParser.json());

// 모든 문서의 _id 조회 API
app.get('/api/templates', async (req, res) => {
  try {
    const ids = await chaincodeDB.list({ include_docs: false });
    res.json(ids.rows.map(row => row.id));
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve templates from CouchDB', details: error });
  }
});

// 특정 문서 조회 API
app.get('/api/templates/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await chaincodeDB.get(id);
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve template from CouchDB', details: error });
  }
});

// 특정 문서 수정 API
app.post('/api/templates/:id', async (req, res) => {
  const id = req.params.id;
  const newContent = req.body.content;
  try {
    const doc = await chaincodeDB.get(id);
    doc.content = newContent;
    const response = await chaincodeDB.insert(doc);
    res.json({ message: 'Template updated successfully', response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template in CouchDB', details: error });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
