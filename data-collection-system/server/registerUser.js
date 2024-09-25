const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function registerUser(organization, id, name, password, phonenumber) {
    const connection = await mysql.createConnection({host: 'localhost', user: 'root', database: 'users'});

    try {
        const ccpPath = path.resolve(__dirname, '../../config-files', `${organization}.data-collector.com`, `connection-${organization}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caInfo = ccp.certificateAuthorities[`ca.${organization}.data-collector.com`];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        const walletPath = path.join(process.cwd(), `wallet-${organization}`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const userIdentity = await wallet.get(id);
        if (userIdentity) {
            throw new Error(`User ${id} already exists in the wallet`);
        }

        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            throw new Error(`Admin user does not exist in the wallet for ${organization}`);
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        const secret = await ca.register({
            affiliation: `${organization}.department1`,
            enrollmentID: id,
            role: 'client',
            attrs: [
                { name: 'name', value: name, ecert: true },
                //{ name: 'phonenumber', value: phonenumber, ecert: true }  // 전화번호 추가
            ]
        }, adminUser);

        const enrollment = await ca.enroll({
            enrollmentID: id,
            enrollmentSecret: secret
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${organization.charAt(0).toUpperCase() + organization.slice(1)}MSP`,
            type: 'X.509',
        };

        await wallet.put(id, x509Identity);

        // MySQL에 사용자 정보 저장
        await connection.execute(
            'INSERT INTO userinfo (id, password, name, phonenumber, organization, certificate, private_key, msp_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, hashedPassword, name, phonenumber, organization, x509Identity.credentials.certificate, x509Identity.credentials.privateKey, x509Identity.mspId]
        );

        console.log(`Successfully registered and enrolled user ${id} for ${organization} and imported it into the wallet and database`);

    } catch (error) {
        throw new Error(`Failed to register user for ${organization}: ${error}`);
    } finally {
        await connection.end();
    }
}

module.exports = registerUser;
