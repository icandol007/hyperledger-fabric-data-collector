const { execSync } = require('child_process');
const path = require('path');

// 입력 파라미터를 가져옴
const CHAINCODE_NAME = process.argv[2];
const CHAINCODE_PATH = process.argv[3];
const CHAINCODE_LABEL = process.argv[4];

if (!CHAINCODE_NAME || !CHAINCODE_PATH || !CHAINCODE_LABEL) {
  console.error('입력 형식: node deployChaincode.js 체인코드이름 체인코드경로 체인코드라벨');
  process.exit(1);
}

const CONTAINER_CC_PATH = `/opt/gopath/src/github.com/hyperledger/fabric/chaincode/${CHAINCODE_NAME}`;
const PACKAGE_NAME = `${CHAINCODE_NAME}.tar.gz`;

// 패키지 파일이 이미 존재하면 삭제
try {
  execSync(`rm -f ${PACKAGE_NAME}`);
} catch (error) {
  console.error(`Error deleting existing package: ${error}`);
}

// 컨테이너 내부 경로 없을때 생성
try {
  execSync(`docker exec cli mkdir -p ${CONTAINER_CC_PATH}`);
  execSync(`docker cp ${CHAINCODE_PATH} cli:${CONTAINER_CC_PATH}`);
  execSync(`docker exec -i cli bash -c "cd ${CONTAINER_CC_PATH} && go mod init ${CHAINCODE_NAME} && go mod tidy"`);
} catch (error) {
  console.error(`Error preparing container: ${error}`);
  process.exit(1);
}

// 패키징
try {
  execSync(`docker exec -i cli bash -c "peer lifecycle chaincode package ${PACKAGE_NAME} --path ${CONTAINER_CC_PATH} --lang golang --label ${CHAINCODE_LABEL}"`);
} catch (error) {
  console.error(`Error packaging chaincode: ${error}`);
  process.exit(1);
}

const peerPorts = {
  'peer0.org1.data-collector.com': 7051,
  'peer1.org1.data-collector.com': 8051,
  'peer0.org2.data-collector.com': 9051,
  'peer1.org2.data-collector.com': 10051,
  'peer0.org3.data-collector.com': 11051,
  'peer1.org3.data-collector.com': 12051
};

// 모든 피어에 설치
for (let org = 1; org <= 3; org++) {
  for (let peer = 0; peer <= 1; peer++) {
    const PEER_ADDRESS = `peer${peer}.org${org}.data-collector.com:${peerPorts[`peer${peer}.org${org}.data-collector.com`]}`;
    console.log(`peer${peer}.org${org}에 체인코드 설치 중`);
    try {
      execSync(`docker exec -i cli bash -c "CORE_PEER_ADDRESS=${PEER_ADDRESS} \
        CORE_PEER_LOCALMSPID=Org${org}MSP \
        CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/crypto-config/peerOrganizations/org${org}.data-collector.com/peers/peer${peer}.org${org}.data-collector.com/tls/ca.crt \
        CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/crypto-config/peerOrganizations/org${org}.data-collector.com/users/Admin@org${org}.data-collector.com/msp \
        peer lifecycle chaincode install ${PACKAGE_NAME}"`);
    } catch (error) {
      console.error(`Error installing chaincode on peer${peer}.org${org}: ${error}`);
    }
  }
}

// 패키징된 ID 확인
let PACKAGE_ID;
try {
  const queryInstalledResult = execSync(`docker exec -i cli bash -c "peer lifecycle chaincode queryinstalled"`).toString();
  const packageIdMatch = queryInstalledResult.match(new RegExp(`Package ID: (\\S+), Label: ${CHAINCODE_LABEL}`));
  if (packageIdMatch) {
    PACKAGE_ID = packageIdMatch[1];
    console.log(`Package ID: ${PACKAGE_ID}`);
  } else {
    throw new Error('Package ID not found');
  }
} catch (error) {
  console.error(`Error querying installed chaincode: ${error}`);
  process.exit(1);
}

// 모든 Org에서 승인
for (let org = 1; org <= 3; org++) {
  console.log(`Org${org} 체인코드 승인 중`);
  try {
    execSync(`docker exec -i cli bash -c "CORE_PEER_ADDRESS=peer0.org${org}.data-collector.com:${peerPorts[`peer0.org${org}.data-collector.com`]} \
      CORE_PEER_LOCALMSPID=Org${org}MSP \
      CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/crypto-config/peerOrganizations/org${org}.data-collector.com/peers/peer0.org${org}.data-collector.com/tls/ca.crt \
      CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/crypto-config/peerOrganizations/org${org}.data-collector.com/users/Admin@org${org}.data-collector.com/msp \
      peer lifecycle chaincode approveformyorg -o orderer.data-collector.com:7050 --ordererTLSHostnameOverride orderer.data-collector.com --tls --cafile /etc/hyperledger/orderer/tls/ca.crt --channelID mychannel --name ${CHAINCODE_NAME} --version 1.0 --package-id ${PACKAGE_ID} --sequence 1"`);
  } catch (error) {
    console.error(`Error approving chaincode for Org${org}: ${error}`);
  }
}

// 커밋
console.log("커밋 중");
try {
  execSync(`docker exec -i cli bash -c "peer lifecycle chaincode commit -o orderer.data-collector.com:7050 --ordererTLSHostnameOverride orderer.data-collector.com --tls --cafile /etc/hyperledger/orderer/tls/ca.crt --channelID mychannel --name ${CHAINCODE_NAME} --version 1.0 --sequence 1 --peerAddresses peer0.org1.data-collector.com:7051 --tlsRootCertFiles /etc/hyperledger/fabric/crypto-config/peerOrganizations/org1.data-collector.com/peers/peer0.org1.data-collector.com/tls/ca.crt --peerAddresses peer0.org2.data-collector.com:9051 --tlsRootCertFiles /etc/hyperledger/fabric/crypto-config/peerOrganizations/org2.data-collector.com/peers/peer0.org2.data-collector.com/tls/ca.crt --peerAddresses peer0.org3.data-collector.com:11051 --tlsRootCertFiles /etc/hyperledger/fabric/crypto-config/peerOrganizations/org3.data-collector.com/peers/peer0.org3.data-collector.com/tls/ca.crt"`);
} catch (error) {
  console.error(`Error committing chaincode: ${error}`);
}

// 커밋 결과 확인
console.log("커밋 결과:");
try {
  const commitQueryResult = execSync(`docker exec -i cli bash -c "peer lifecycle chaincode querycommitted --channelID mychannel --name ${CHAINCODE_NAME}"`).toString();
  console.log(commitQueryResult);
} catch (error) {
  console.error(`Error querying committed chaincode: ${error}`);
}
