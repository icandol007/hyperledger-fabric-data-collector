const FabricCAServices = require('fabric-ca-client'); // Hyperledger Fabric CA 서비스 관련
const { Wallets } = require('fabric-network'); // Hyperledger Fabric 네트워크 관련
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // 네트워크 파일 경로
        const ccpPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // CA 정보 가져오기
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem; // TLS CA 인증서
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName); // CA 클라이언트 인스턴스 생성

        // wallet 경로
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // 사용자가 wallet에 있는지
        const userIdentity = await wallet.get('appUser');
        if (userIdentity) {
            console.log('this user already exists in the wallet');
            return;
        }

        // enrollAdmin 제대로 됐는지..
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('User "admin" does not exist in the wallet');
            return;
        }

        // 관리자 신원을 사용하여 사용자 컨텍스트 가져오기
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // 새로운 사용자 등록
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: 'appUser',
            role: 'client'
        }, adminUser);

        // 등록된 사용자 정보로 사용자 등록
        const enrollment = await ca.enroll({
            enrollmentID: 'appUser',
            enrollmentSecret: secret
        });

        // 사용자 신원 정보 생성
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        // 지갑에 사용자 신원 정보 저장
        await wallet.put('appUser', x509Identity);

        console.log('Successfully registered and enrolled user "appUser" and imported it into the wallet');

    } catch (error) {
        // 오류 발생 시 오류 메시지 출력
        console.error(`Failed to register user: ${error}`);
        process.exit(1);
    }
}

main(); // main 함수 호출
