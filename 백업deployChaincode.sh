#!/bin/bash

CHANNEL_NAME="mychannel"
CC_NAME="$1"
CC_SRC_PATH="$2"
CC_VERSION="1.0"
CC_SEQUENCE="1"
ORDERER_CA="./crypto-config/ordererOrganizations/data-collector.com/orderers/orderer.data-collector.com/tls/ca.crt"

set -e

# Docker 컨테이너 내부 경로
CONTAINER_CC_PATH="/opt/gopath/src/github.com/hyperledger/fabric/chaincode/${CC_NAME}"

# 컨테이너 내부 경로가 존재하지 않으면 생성
docker exec cli mkdir -p ${CONTAINER_CC_PATH}

# 호스트 시스템에서 Docker 컨테이너로 체인코드 디렉토리 복사
docker cp $CC_SRC_PATH cli:${CONTAINER_CC_PATH}

# 체인코드 디렉토리로 이동하여 go.mod 초기화 및 종속성 설치
docker exec cli sh -c "chmod -R 755 ${CONTAINER_CC_PATH} && cd ${CONTAINER_CC_PATH} && go mod init ${CC_NAME} && go mod tidy"

# 체인코드 패키징
docker exec cli peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CONTAINER_CC_PATH} --lang golang --label ${CC_NAME}_${CC_VERSION}

# peer0.org1에 체인코드 설치
docker exec cli peer lifecycle chaincode install ${CC_NAME}.tar.gz

# peer0.org2에 체인코드 설치
docker exec -e CORE_PEER_ADDRESS=peer0.org2.data-collector.com:9051 \
           -e CORE_PEER_LOCALMSPID=Org2MSP \
           -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/msp \
           -e CORE_PEER_TLS_ROOTCERT_FILE=./crypto-config/peerOrganizations/org2.data-collector.com/peers/peer0.org2.data-collector.com/tls/ca.crt \
           cli peer lifecycle chaincode install ${CC_NAME}.tar.gz

# 설치된 체인코드의 패키지 ID 확인
PACKAGE_ID=$(docker exec cli peer lifecycle chaincode queryinstalled | grep ${CC_NAME}_${CC_VERSION} | sed -n "/Package ID: /{s/^Package ID: //;s/, Label:.*$//;p;}")

# org1에 체인코드 승인
docker exec cli peer lifecycle chaincode approveformyorg -o orderer.data-collector.com:7050 \
          --ordererTLSHostnameOverride orderer.data-collector.com \
          --tls --cafile ${ORDERER_CA} --channelID ${CHANNEL_NAME} \
          --name ${CC_NAME} --version ${CC_VERSION} --package-id $PACKAGE_ID --sequence ${CC_SEQUENCE}

# org2에 체인코드 승인
docker exec -e CORE_PEER_ADDRESS=peer0.org2.data-collector.com:9051 \
          -e CORE_PEER_LOCALMSPID=Org2MSP \
          -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/fabric/msp \
          -e CORE_PEER_TLS_ROOTCERT_FILE=./crypto-config/peerOrganizations/org2.data-collector.com/peers/peer0.org2.data-collector.com/tls/ca.crt \
          cli peer lifecycle chaincode approveformyorg -o orderer.data-collector.com:7050 \
          --ordererTLSHostnameOverride orderer.data-collector.com \
          --tls --cafile ${ORDERER_CA} --channelID ${CHANNEL_NAME} \
          --name ${CC_NAME} --version ${CC_VERSION} --package-id $PACKAGE_ID --sequence ${CC_SEQUENCE}

# 체인코드 커밋
docker exec cli peer lifecycle chaincode commit -o orderer.data-collector.com:7050 \
          --ordererTLSHostnameOverride orderer.data-collector.com \
          --tls --cafile ${ORDERER_CA} --channelID ${CHANNEL_NAME} \
          --name ${CC_NAME} --version ${CC_VERSION} --sequence ${CC_SEQUENCE} \
          --peerAddresses peer0.org1.data-collector.com:7051 --tlsRootCertFiles ./crypto-config/peerOrganizations/org1.data-collector.com/peers/peer0.org1.data-collector.com/tls/ca.crt \
          --peerAddresses peer0.org2.data-collector.com:9051 --tlsRootCertFiles ./crypto-config/peerOrganizations/org2.data-collector.com/peers/peer0.org2.data-collector.com/tls/ca.crt
