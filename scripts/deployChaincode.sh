#!/bin/bash

CHAINCODE_NAME=$1
CHAINCODE_PATH=$2
CHAINCODE_LABEL=$3

if [ -z "$CHAINCODE_NAME" ] || [ -z "$CHAINCODE_PATH" ] || [ -z "$CHAINCODE_LABEL" ]; then
  echo "입력 형식: ./deployChaincode.sh 체인코드이름 체인코드경로 체인코드라벨"
  exit 1
fi

set -e

CONTAINER_CC_PATH="/opt/gopath/src/github.com/hyperledger/fabric/chaincode/${CHAINCODE_NAME}"

PACKAGE_NAME=${CHAINCODE_NAME}.tar.gz
rm -f $PACKAGE_NAME

# 컨테이너 내부 경로 없을때 생성
docker exec cli mkdir -p ${CONTAINER_CC_PATH}
docker cp $CHAINCODE_PATH cli:/opt/gopath/src/github.com/hyperledger/fabric/chaincode/$CHAINCODE_NAME

docker exec -i cli bash -c "cd /opt/gopath/src/github.com/hyperledger/fabric/chaincode/$CHAINCODE_NAME && go mod init $CHAINCODE_NAME && go mod tidy"

# 패키징
docker exec -i cli bash -c "peer lifecycle chaincode package $PACKAGE_NAME --path /opt/gopath/src/github.com/hyperledger/fabric/chaincode/$CHAINCODE_NAME --lang golang --label $CHAINCODE_LABEL"

declare -A peer_ports=( ["peer0.org1.data-collector.com"]=7051 
                        ["peer1.org1.data-collector.com"]=8051 
                        ["peer0.org2.data-collector.com"]=9051 
                        ["peer1.org2.data-collector.com"]=10051 
                        ["peer0.org3.data-collector.com"]=11051 
                        ["peer1.org3.data-collector.com"]=12051 )

# 모든 피어에 설치
for org in 1 2 3; do
  for peer in 0 1; do
    PEER_ADDRESS="peer${peer}.org${org}.data-collector.com:${peer_ports[peer${peer}.org${org}.data-collector.com]}"
    echo "peer${peer}.org${org}에 체인코드 설치 중"
    docker exec -i cli bash -c "CORE_PEER_ADDRESS=$PEER_ADDRESS \
      CORE_PEER_LOCALMSPID=Org${org}MSP \
      CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/crypto-config/peerOrganizations/org${org}.data-collector.com/peers/peer${peer}.org${org}.data-collector.com/tls/ca.crt \
      CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/crypto-config/peerOrganizations/org${org}.data-collector.com/users/Admin@org${org}.data-collector.com/msp \
      peer lifecycle chaincode install $PACKAGE_NAME"
  done
done

# 패키징된 ID 확인
PACKAGE_ID=$(docker exec -i cli bash -c "peer lifecycle chaincode queryinstalled" | grep $CHAINCODE_LABEL | sed -n 's/^Package ID: \(\S*\), Label:.*$/\1/p')
echo "Package ID: $PACKAGE_ID"

# 모든 Org에서 승인
for org in 1 2 3; do
  echo "Org${org} 체인코드 승인 중"
  docker exec -i cli bash -c "CORE_PEER_ADDRESS=peer0.org${org}.data-collector.com:${peer_ports[peer0.org${org}.data-collector.com]} \
    CORE_PEER_LOCALMSPID=Org${org}MSP \
    CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/crypto-config/peerOrganizations/org${org}.data-collector.com/peers/peer0.org${org}.data-collector.com/tls/ca.crt \
    CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/crypto-config/peerOrganizations/org${org}.data-collector.com/users/Admin@org${org}.data-collector.com/msp \
    peer lifecycle chaincode approveformyorg -o orderer.data-collector.com:7050 --ordererTLSHostnameOverride orderer.data-collector.com --tls --cafile /etc/hyperledger/orderer/tls/ca.crt --channelID mychannel --name $CHAINCODE_NAME --version 1.0 --package-id $PACKAGE_ID --sequence 1"
done

# 커밋
echo "커밋 중"
docker exec -i cli bash -c "peer lifecycle chaincode commit -o orderer.data-collector.com:7050 --ordererTLSHostnameOverride orderer.data-collector.com --tls --cafile /etc/hyperledger/orderer/tls/ca.crt --channelID mychannel --name $CHAINCODE_NAME --version 1.0 --sequence 1 --peerAddresses peer0.org1.data-collector.com:7051 --tlsRootCertFiles /etc/hyperledger/fabric/crypto-config/peerOrganizations/org1.data-collector.com/peers/peer0.org1.data-collector.com/tls/ca.crt --peerAddresses peer0.org2.data-collector.com:9051 --tlsRootCertFiles /etc/hyperledger/fabric/crypto-config/peerOrganizations/org2.data-collector.com/peers/peer0.org2.data-collector.com/tls/ca.crt --peerAddresses peer0.org3.data-collector.com:11051 --tlsRootCertFiles /etc/hyperledger/fabric/crypto-config/peerOrganizations/org3.data-collector.com/peers/peer0.org3.data-collector.com/tls/ca.crt"

# 커밋 제대로 됐는지 쿼리 <-- 나중에 빼기
echo "커밋 결과:"
docker exec -i cli bash -c "peer lifecycle chaincode querycommitted --channelID mychannel --name $CHAINCODE_NAME"
