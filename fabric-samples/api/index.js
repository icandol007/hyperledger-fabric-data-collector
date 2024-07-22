const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 웹 페이지를 반환하는 라우트 설정
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <button onclick="deployChaincode()">Deploy Chaincode</button>
        <script>
          function deployChaincode() {
            fetch('/deploy')
              .then(response => response.json())
              .then(data => alert(data.message))
              .catch(error => console.error('Error:', error));
          }
        </script>
      </body>
    </html>
  `);
});

// 체인코드 배포를 수행하는 라우트 설정
app.get('/deploy', async (req, res) => {
  try {
    // 네트워크 설정 파일 로드
    const ccpPath = path.resolve(__dirname, 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // 파일 시스템 기반 지갑 생성
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // 관리자 사용자가 지갑에 있는지 확인
    const identity = await wallet.get('admin');
    if (!identity) {
      console.log('지갑에 "admin" 사용자의 신원이 존재하지 않습니다');
      console.log('enrollAdmin.js를 먼저 실행하세요');
      return;
    }

    // 피어 노드에 연결할 게이트웨이 생성
    const gateway = new Gateway();
    const options = {
      wallet,
      identity: 'admin',
      discovery: { enabled: true, asLocalhost: true }
    };
    await gateway.connect(ccp, options);

    // 체인코드가 배포된 네트워크(채널) 가져오기
    const network = await gateway.getNetwork('mychannel');

    // 네트워크에서 컨트랙트 가져오기
    const contract = network.getContract('lscc');

    // 체인코드 속성 정의
    const chaincodeName = 'test';
    const chaincodeVersion = '1.0';
    const chaincodePath = 'github.com/chaincode/test';
    const chaincodeType = 'golang';

    // 피어에 체인코드 설치
    await contract.submitTransaction(
      'install',
      chaincodeName,
      chaincodePath,
      chaincodeVersion,
      chaincodeType
    );

    console.log('체인코드가 설치되었습니다');
    
    // 체인코드 승인 및 커밋 (각 조직에 대해 수행)
    await contract.submitTransaction(
      'approveformyorg',
      chaincodeName,
      chaincodePath,
      chaincodeVersion,
      chaincodeType
    );

    console.log('Org1에 대해 체인코드가 승인되었습니다');

    await contract.submitTransaction(
      'commit',
      chaincodeName,
      chaincodePath,
      chaincodeVersion,
      chaincodeType
    );

    console.log('체인코드가 커밋되었습니다');
    
    res.json({ message: '체인코드가 성공적으로 배포되었습니다' });

    // 게이트웨이 연결 종료
    await gateway.disconnect();

  } catch (error) {
    console.error(`체인코드 배포 실패: ${error}`);
    res.status(500).json({ message: `체인코드 배포 실패: ${error}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
