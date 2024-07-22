export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/../infra/crypto-config/peerOrganizations/org1.data-collector.com/peers/peer1.org1.data-collector.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/../infra/crypto-config/peerOrganizations/org1.data-collector.com/users/Admin@org1.data-collector.com/msp
export CORE_PEER_ADDRESS=peer0.org1.data-collector.com:7051