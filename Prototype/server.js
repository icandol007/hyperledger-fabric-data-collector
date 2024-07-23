const express = require('express');
const mysql = require('mysql2');
const nano = require('nano')('http://admin:password@localhost:5984'); // CouchDB URL with credentials
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// CouchDB 데이터베이스 선택
const chaincodeDB = nano.db.use('smart_contract_pool'); // 'chaincode_db'는 CouchDB 데이터베이스 이름

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'userinfo',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// 루트 경로에 대한 요청을 main.html로 리디렉션
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

// 정적 파일 제공
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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


// 회원가입 API
app.post('/api/register', (req, res) => {
  // fabric-sdk 사용해서 fabric-CA 받아와 두개의 키를 crypto 함수 이용해 하나의 cypher-text로 만들어 밑의 req.body로 함께 묶어 users 테이블에 추가 예정
  const { id, password, username, name } = req.body;
  const query = 'INSERT INTO users (id, password, username, name) VALUES (?, ?, ?, ?)';
  db.query(query, [id, password, username, name], (err, result) => {
    if (err) {
      console.error('Error during user registration:', err);  // 오류 로그 출력
      res.status(500).json({ error: 'Failed to register user', details: err });
      return;
    }
    res.json({ message: 'User registered successfully', result });
  });
});


// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
