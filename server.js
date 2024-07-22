const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// 체인코드 템플릿 파일 경로
const chaincodeTemplatePath = path.join(__dirname, 'chaincode-Template.go');

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 체인코드 템플릿 내용 전달
app.get('/api/chaincode-template', (req, res) => {
    fs.readFile(chaincodeTemplatePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read chaincode template' });
        }
        res.json({ template: data });
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});