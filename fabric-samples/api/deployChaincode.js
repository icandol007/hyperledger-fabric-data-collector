// 필요한 패키지들을 불러옵니다.
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

// 체인코드 배포에 필요한 환경 변수와 경로를 설정합니다.
const chaincodeName = 'test';
const chaincodePath = '../chaincode/test';
const chaincodeLabel = 'test_1.0';

async function main() {
    try {
        // 지갑과 게이트웨이를 설정합니다.
        const walletPath = path.join(process.cwd(), 'wallet'); // 지갑 경로를 설정합니다.
        const wallet = await Wallets.newFileSystemWallet(walletPath); // 파일 시스템 지갑을 생성합니다.
        const gateway = new Gateway(); // 새로운 게이트웨이를 생성합니다.

        // 연결 프로파일을 로드합니다.
        const ccpPath = path.resolve(__dirname, 'connection-org1.json'); // 연결 프로파일의 경로를 설정합니다.
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8')); // 연결 프로파일을 읽어서 JSON으로 파싱합니다.

        // 체인코드 디렉토리로 이동하여 Go 모듈을 초기화하고 필요 패키지를 다운로드합니다.
        process.chdir(chaincodePath); // 체인코드 디렉토리로 이동합니다.
        execSync('go mod init ' + chaincodeName); // Go 모듈을 초기화합니다.
        execSync('go mod tidy'); // 필요한 패키지를 다운로드합니다.
        process.chdir(__dirname); // 원래 디렉토리로 돌아옵니다.

        // 체인코드를 패키징합니다.
        const packageCommand = `peer lifecycle chaincode package ${chaincodeName}.tar.gz --path ${chaincodePath} --lang golang --label ${chaincodeLabel}`;
        execSync(packageCommand, { stdio: 'inherit' });

        // 게이트웨이에 연결합니다.
        await gateway.connect(ccp, {
            wallet, // 지갑을 사용합니다.
            identity: 'admin', // admin 신원을 사용합니다.
            discovery: { enabled: true, asLocalhost: true } // 디스커버리를 활성화하고 로컬호스트로 설정합니다.
        });

        // 네트워크 채널을 가져옵니다.
        const network = await gateway.getNetwork('mychannel'); // 'mychannel' 채널을 가져옵니다.

        // 네트워크 채널에서 컨트랙트를 가져옵니다.
        const contract = network.getContract(chaincodeName); // 'test' 체인코드 컨트랙트를 가져옵니다.

        // 체인코드를 설치합니다.
        const installCommand = `peer lifecycle chaincode install ${chaincodeName}.tar.gz`;
        execSync(installCommand, { stdio: 'inherit' });

        // 체인코드를 승인합니다.
        const approveCommand = `peer lifecycle chaincode approveformyorg --channelID mychannel --name ${chaincodeName} --version 1.0 --package-id ${chaincodeLabel} --sequence 1 --tls --cafile /etc/hyperledger/orderer/tls/ca.crt`;
        execSync(approveCommand, { stdio: 'inherit' });

        // 체인코드를 커밋합니다.
        const commitCommand = `peer lifecycle chaincode commit -o orderer.data-collector.com:7050 --channelID mychannel --name ${chaincodeName} --version 1.0 --sequence 1 --tls --cafile /etc/hyperledger/orderer/tls/ca.crt --peerAddresses peer0.org1.data-collector.com:7051 --tlsRootCertFiles /etc/hyperledger/fabric/tls/ca.crt`;
        execSync(commitCommand, { stdio: 'inherit' });

        // 체인코드 배포 트랜잭션을 제출합니다.
        await contract.submitTransaction('initLedger'); // 'initLedger' 트랜잭션을 제출합니다.
        console.log('체인코드가 성공적으로 배포되었습니다.');

        // 게이트웨이에서 연결을 끊습니다.
        await gateway.disconnect(); // 게이트웨이 연결을 끊습니다.
    } catch (error) {
        console.error(`체인코드 배포에 실패했습니다: ${error}`); // 에러가 발생하면 콘솔에 출력합니다.
        process.exit(1); // 프로세스를 종료합니다.
    }
}

main();
