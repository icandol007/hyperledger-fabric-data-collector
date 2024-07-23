const express = require('express');
const mysql = require('mysql2');
const nano = require('nano')('http://admin:password@localhost:5984'); // CouchDB URL with credentials
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
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

// 세션 설정
app.use(session({
  secret: 'your-secret-key', // 세션 암호화에 사용할 키
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // HTTPS 사용 시 true로 설정
}));

// 루트 경로에 대한 요청을 main.html로 리디렉션
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

// 정적 파일 제공
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 회원가입 API
app.post('/api/register', async (req, res) => {
  const { id, password, username, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱
  const query = 'INSERT INTO users (id, password, username, name) VALUES (?, ?, ?, ?)';
  db.query(query, [id, hashedPassword, username, name], (err, result) => {
    if (err) {
      console.error('Error during user registration:', err);
      res.status(500).json({ error: 'Failed to register user', details: err });
      return;
    }
    res.json({ message: 'User registered successfully', result });
  });
});

// 로그인 API
app.post('/api/login', (req, res) => {
  const { id, password } = req.body;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], async (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'Failed to login', details: err });
      return;
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = results[0];
    // 비밀번호 확인
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // 로그인 성공, 세션 저장
    req.session.user = user;
    res.json({ message: 'Login successful' });
  });
});

// 로그아웃 API
app.post('/api/logout', (req, res) => {
  // 세션을 파괴하여 로그아웃합니다.
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});


// 로그인 상태 확인 API
app.get('/api/me', (req, res) => {
  // 사용자 세션 또는 토큰에서 로그인 정보를 가져옵니다.
  // 예를 들어, 세션을 사용하여 로그인 상태를 확인합니다.
  // (여기서는 간단하게 세션 정보를 사용한다고 가정합니다.)
  const user = req.session.user; // 세션에서 사용자 정보를 가져옵니다.
  
  if (user) {
    res.json({ loggedIn: true, id: user.id, isAdmin: user.is_admin });
  } else {
    res.json({ loggedIn: false });
  }
});

// 관리자 인증 미들웨어
function adminAuth(req, res, next) {
  if (req.session.user && req.session.user.is_admin) {
    return next();
  }
  res.status(403).json({ error: 'Access denied' });
}

// 모든 문서의 _id 조회 API
app.get('/api/templates', adminAuth, async (req, res) => {
  try {
    const ids = await chaincodeDB.list({ include_docs: false });
    res.json(ids.rows.map(row => row.id));
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve templates from CouchDB', details: error });
  }
});

// 특정 문서 조회 API
app.get('/api/templates/:id', adminAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await chaincodeDB.get(id);
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve template from CouchDB', details: error });
  }
});

// 특정 문서 수정 API
app.post('/api/templates/:id', adminAuth, async (req, res) => {
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
