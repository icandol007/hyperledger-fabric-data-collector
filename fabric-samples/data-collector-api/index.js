const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const ccpPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
const walletPath = path.join(process.cwd(), 'wallet');

async function connectToNetwork(username) {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('data-collector');

    return contract;
}

app.post('/data', async (req, res) => {
    const { username, id, value } = req.body;

    try {
        const contract = await connectToNetwork(username);
        await contract.submitTransaction('CreateData', id, value);
        res.status(200).send('Data has been submitted');
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send('Failed to submit transaction');
    }
});

app.get('/data/:id', async (req, res) => {
    const username = req.headers.username;
    const { id } = req.params;

    try {
        const contract = await connectToNetwork(username);
        const result = await contract.evaluateTransaction('ReadData', id);
        res.status(200).json(JSON.parse(result.toString()));
    } catch (error) {
        console.error(`Failed to read data: ${error}`);
        res.status(500).send('Failed to read data');
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const userIdentity = await wallet.get(username);
        if (userIdentity) {
            res.status(400).send(`An identity for the user "${username}" already exists in the wallet`);
            return;
        }

        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            res.status(500).send('An identity for the admin user "admin" does not exist in the wallet. Run the enrollAdmin.js application before retrying');
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: username,
            role: 'client'
        }, adminUser);

        const enrollment = await ca.enroll({
            enrollmentID: username,
            enrollmentSecret: secret
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put(username, x509Identity);

        res.status(201).send(`Successfully registered and enrolled user "${username}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        res.status(500).send(`Failed to register user: ${error}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
