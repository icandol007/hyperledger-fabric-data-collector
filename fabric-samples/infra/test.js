const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

const ccpPaths = {
    org1: path.resolve(__dirname, 'connection-org1.json'),
    org2: path.resolve(__dirname, 'connection-org2.json'),
    org3: path.resolve(__dirname, 'connection-org3.json'),
};

async function main() {
    try {
        // Wallet 설정
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        for (const org in ccpPaths) {
            const ccp = JSON.parse(fs.readFileSync(ccpPaths[org], 'utf8'));
            await installApproveChaincodeForOrg(wallet, ccp, org);
        }

        await commitChaincodeForAllOrgs(wallet);

        console.log('Chaincode installation, approval, and commit completed successfully');

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

async function installApproveChaincodeForOrg(wallet, ccp, org) {
    try {
        // 사용자 인증서 확인
        const identity = await wallet.get(`admin`);
        if (!identity) {
            console.log(`An identity for the admin user of ${org} does not exist in the wallet`);
            return;
        }

        // Gateway 설정 및 연결
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: `${org}Admin`, discovery: { enabled: true, asLocalhost: true } });

        // 네트워크 채널 가져오기
        const network = await gateway.getNetwork('mychannel');

        // Chaincode 패키지화
        const contractPath = path.resolve(__dirname, 'chaincode');
        const packagePath = path.join(contractPath, 'mychaincode.tar.gz');
        const chaincodeLabel = 'mychaincode_1';
        const chaincodePath = 'chaincode';
        const chaincodeLang = 'golang';
        const chaincodeVersion = '1.0';
        const chaincodeSequence = '1';

        // 설치 준비
        const installRequest = {
            label: chaincodeLabel,
            packagePath,
        };

        // Chaincode 설치
        console.log(`Installing chaincode for ${org}...`);
        const installResult = await network.getContract('lscc').submitTransaction('InstallChaincode', JSON.stringify(installRequest));
        console.log(`Install chaincode response for ${org}:`, installResult.toString());

        // Chaincode 승인
        const approveRequest = {
            name: 'mychaincode',
            version: chaincodeVersion,
            sequence: chaincodeSequence,
            endorsementPlugin: 'escc',
            validationPlugin: 'vscc',
            policy: {
                identities: [
                    { role: { name: 'member', mspId: `${org}MSP` } },
                ],
                policy: {
                    '1-of': [{ 'signed-by': 0 }],
                },
            },
            collections: [],
            initRequired: true,
        };

        console.log(`Approving chaincode for ${org}...`);
        const approveResult = await network.getContract('qscc').submitTransaction('ApproveChaincode', JSON.stringify(approveRequest));
        console.log(`Approve chaincode response for ${org}:`, approveResult.toString());

        // Gateway 연결 종료
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to install/approve chaincode for ${org}: ${error}`);
    }
}

async function commitChaincodeForAllOrgs(wallet) {
    try {
        for (const org in ccpPaths) {
            const ccp = JSON.parse(fs.readFileSync(ccpPaths[org], 'utf8'));

            const identity = await wallet.get(`admin`);
            if (!identity) {
                console.log(`An identity for the admin user of ${org} does not exist in the wallet`);
                return;
            }

            // Gateway 설정 및 연결
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: `${org}Admin`, discovery: { enabled: true, asLocalhost: true } });

            // 네트워크 채널 가져오기
            const network = await gateway.getNetwork('mychannel');

            // Chaincode 커밋
            const commitRequest = {
                name: 'mychaincode',
                version: '1.0',
                sequence: '1',
                endorsementPlugin: 'escc',
                validationPlugin: 'vscc',
                initRequired: true,
            };

            console.log(`Committing chaincode for ${org}...`);
            const commitResult = await network.getContract('qscc').submitTransaction('CommitChaincode', JSON.stringify(commitRequest));
            console.log(`Commit chaincode response for ${org}:`, commitResult.toString());

            // Gateway 연결 종료
            await gateway.disconnect();
        }
    } catch (error) {
        console.error(`Failed to commit chaincode for all orgs: ${error}`);
    }
}

main();
