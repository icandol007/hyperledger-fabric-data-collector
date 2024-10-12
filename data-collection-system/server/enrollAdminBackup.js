const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // 네트워크 구성 파일
        const ccpPath = path.resolve(__dirname, '../../config-files/connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8')); // JSON 형식으로 구성 파일 읽기

        // CA와 상호 작용하기 위한 새로운 CA 클라이언트 생성
        const caInfo = ccp.certificateAuthorities['ca.org1.data-collector.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem; // TLS CA 인증서 로드
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName); // CA 클라이언트 인스턴스 생성

        // wallet 생성
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath); // 파일 시스템 지갑 생성
        console.log(`Wallet path: ${walletPath}`);

        // admin 이미 등록되어 있는지 
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // admin 등록, wallet에 저장
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('admin', x509Identity); // 지갑에 관리자 신원 정보 저장
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1); // 오류 발생 시 프로세스 종료
    }
}

main(); // main 함수 호출
