### 1. Docker로 MySQL 실행

#### Docker 이미지 다운로드 및 실행

MySQL Docker 이미지를 다운로드하고 컨테이너를 실행
볼륨 마운트를 통해 데이터 지속성을 보장

```sh
docker pull mysql:latest
```

다음 명령어를 사용하여 MySQL 컨테이너를 실행

```sh
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=userinfo -v mysql-data:/var/lib/mysql -p 3306:3306 -d mysql:latest
```

- `--name mysql-container`: 컨테이너 이름을 `mysql-container`로 지정
- `-e MYSQL_ROOT_PASSWORD=password`: MySQL 루트 사용자 비밀번호를 `password`로 설정
- `-e MYSQL_DATABASE=mydatabase`: `userinfo`라는 이름의 데이터베이스 생성
- `-v mysql-data:/var/lib/mysql`: Docker 볼륨을 `/var/lib/mysql`에 마운트
- `-p 3306:3306`: 호스트의 3306 포트를 컨테이너의 3306 포트에 매핑
- `-d`: 백그라운드에서 실행

#### 데이터베이스 설정

MySQL에 접속하여 필요한 테이블을 생성

``````sh
docker exec -it mysql-container mysql -u root -p
``````

MySQL 프롬프트에서 비밀번호를 입력하고 다음 쿼리를 실행

``````sql
USE userinfo;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    CAkey VARCHAR(512) NOT NULL
);
``````

### 2. Node.js 서버 설정

Node.js 서버를 설정하고, MySQL 데이터베이스와 연결한 다음, 사용자 등록 API를 작성

#### 필요한 패키지 설치

``````sh
npm install express mysql2 body-parser crypto
``````

#### 서버 코드 작성

`server.js` 파일을 작성

``````javascript
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const crypto = require('crypto');

const app = express();
const port = 3000;

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost', // 도커 네트워크에서 실행할 경우 'mysql-container'로 변경
  user: 'root',
  password: 'password',  // MySQL 비밀번호
  database: 'userinfo'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
``````

#### 3. MySQL Workbench

1. **MySQL Workbench 설치**: [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)를 다운로드하여 설치합니다.

2. 새 연결 설정

   :

   - MySQL Workbench를 실행하고 "Database" 메뉴에서 "Manage Connections"를 선택합니다.
   - "New"를 클릭하여 새로운 연결을 생성합니다.
   - 연결 설정에 다음 정보를 입력합니다:
     - Connection Name: 원하는 이름 입력
     - Hostname: `localhost`
     - Port: `3306`
     - Username: `root`
     - Password: "Store in Vault"를 클릭하여 `password` 입력
   - "Test Connection"을 클릭하여 연결을 테스트하고, 성공하면 "OK"를 클릭합니다.

