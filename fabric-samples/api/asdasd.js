const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// 각 조직의 관리자로 체인코드를 승인하고 커밋합니다.
async function deployChaincode() {
    try {
        const ccpPath = path.resolve(__dirname, 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('qscc');

        // 체인코드 설치 및 승인
        const chaincodeLabel = 'testlabel';
        const chaincodePackagePath = path.join(__dirname, 'test.go');
        const chaincodeLabelWithPackageID = `${chaincodeLabel}:${execSync(`sha256sum ${chaincodePackagePath} | awk '{print $1}'`).toString().trim()}`;

        console.log(`Installing chaincode with package ID: ${chaincodeLabelWithPackageID}`);
        execSync(`peer lifecycle chaincode install ${chaincodePackagePath}`, { stdio: 'inherit' });

        console.log(`Approving chaincode for Org1...`);
        await contract.submitTransaction('ApproveChaincodeDefinitionForMyOrg', 'mychannel', chaincodeLabelWithPackageID);

        console.log(`Approving chaincode for Org2...`);
        await contract.submitTransaction('ApproveChaincodeDefinitionForMyOrg', 'mychannel', chaincodeLabelWithPackageID);

        console.log(`Approving chaincode for Org3...`);
        await contract.submitTransaction('ApproveChaincodeDefinitionForMyOrg', 'mychannel', chaincodeLabelWithPackageID);

        // 체인코드 커밋
        console.log(`Committing chaincode for all orgs...`);
        await contract.submitTransaction('CommitChaincodeDefinition', 'mychannel', chaincodeLabelWithPackageID);

        console.log('체인코드가 성공적으로 배포되었습니다.');
    } catch (error) {
        console.error(`체인코드 배포에 실패했습니다: ${error}`);
    }
}

deployChaincode();
