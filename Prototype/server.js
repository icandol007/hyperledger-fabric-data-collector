const express = require('express');
const mysql = require('mysql');
const nano = require('nano')('http://admin:password@localhost:5984'); // CouchDB URL with credentials
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const crypto = require('crypto');
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

// 암호화 함수
function encrypt(text, masterKey) {
  const cipher = crypto.createCipher('aes-256-cbc', Buffer.from(masterKey));
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// 회원가입 엔드포인트
app.post('/register', (req, res) => {
  const { username, password, name, secretKey, publicKey } = req.body;

  // CA 키를 하나로 합쳐서 암호화
  const combinedKeys = JSON.stringify({ secretKey, publicKey });
  const masterKey = crypto.randomBytes(32); // 마스터 키 생성 (예시)
  const encryptedKeys = encrypt(combinedKeys, masterKey);

  // 사용자 정보와 암호화된 키를 MySQL에 저장
  const query = `INSERT INTO users (username, password, name, keys) VALUES (?, ?, ?, ?)`;
  db.query(query, [username, password, name, encryptedKeys], (err, result) => {
    if (err) return res.status(500).send('Error registering user');
    res.status(200).send('User registered successfully');
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
