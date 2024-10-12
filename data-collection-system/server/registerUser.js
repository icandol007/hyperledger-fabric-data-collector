const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function registerUser(organization, id, name, password, phonenumber) {
    console.log('Starting user registration...');
    const connection = await mysql.createConnection({host: 'localhost', user: 'root', password: '1234', database: 'userinfo'});

    try {
        console.log('MySQL connection established');
        
        const ccpPath = path.resolve(__dirname, '../../config-files', `connection-${organization}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        console.log('Configuration file loaded');

        const caInfo = ccp.certificateAuthorities[`ca.${organization}.data-collector.com`];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
        console.log('Fabric CA service initialized');

        const walletPath = path.resolve(__dirname, 'wallet', `${organization}`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path (이건 레지스터): ${walletPath}`);

        const userIdentity = await wallet.get(id);
        if (userIdentity) {
            console.error(`An identity for the user ${id} already exists in the wallet`);
            throw new Error(`An identity for the user ${id} already exists in the wallet`);
        }

        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.error('Admin user does not exist');
            throw new Error(`Admin user does not exist in the wallet for ${organization}`);
        }

        console.log('Admin identity found');

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');
        console.log('Admin user context retrieved');

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed');

        const secret = await ca.register({
            affiliation: `${organization}.department1`,
            enrollmentID: id,
            role: 'client',
            attrs: [
                { name: 'phonenumber', value: phonenumber, ecert: true }  // 전화번호 추가 ????
            ]
        }, adminUser);
        console.log(`User ${id} registered with CA`);

        const enrollment = await ca.enroll({
            enrollmentID: id,
            enrollmentSecret: secret
        });
        console.log(`User ${id} enrolled with CA`);

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${organization.charAt(0).toUpperCase() + organization.slice(1)}MSP`,
            type: 'X.509',
        };

        await wallet.put(id, x509Identity);
        console.log(`User ${id} identity added to wallet`);

        // MySQL에 사용자 정보 저장
        await connection.execute(
            'INSERT INTO users (id, password, name, phonenumber, organization, certificate, private_key, msp_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, hashedPassword, name, phonenumber, organization, x509Identity.credentials.certificate, x509Identity.credentials.privateKey, x509Identity.mspId]
        );
        console.log(`User ${id} information stored in database`);

        console.log(`Successfully registered and enrolled user ${id} for ${organization} and imported it into the wallet and database`);

    } catch (error) {
        console.error(`Failed to register user for ${organization}:`, error.stack);
        throw new Error(`Failed to register user for ${organization}: ${error}`);
    } finally {
        await connection.end();
        console.log('MySQL connection closed');
    }
}

module.exports = registerUser;
