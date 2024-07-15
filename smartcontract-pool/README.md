### 체인코드 컴파일 및 실행

체인코드를 컴파일하고 실행합니다.

``````sh
go build -o chaincode
``````

이제 체인코드를 Docker 컨테이너에서 실행할 수 있습니다. 이 작업은 Docker Compose를 사용하거나 직접 Docker 명령어를 사용할 수 있습니다.

### 체인코드 Docker 컨테이너 실행

Docker Compose 파일을 사용하여 체인코드를 실행하려면 `docker-compose.yml` 파일을 작성합니다. 예를 들어:

``````yaml
version: '2'

services:
  chaincode:
    image: golang:1.18
    volumes:
      - ./chaincode:/chaincode
    working_dir: /chaincode
    command: go run chaincode.go
``````



### Hyperledger Fabric 네트워크 설정

체인코드 서버와 통신할 수 있도록 Hyperledger Fabric 피어를 설정합니다. `core.yaml` 파일이나 환경 변수를 사용하여 설정합니다.

``````sh
export CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:9999
export CORE_PEER_CHAINCODEADDRESS=peer0.org1.example.com:7052
``````

이 파일을 사용하여 Docker Compose를 통해 체인코드를 실행합니다.

```sh
docker-compose up
```

이 단계들에 따라 `shim` 패키지를 사용하여 체인코드를 작성하고 실행할 수 있습니다. 체인코드의 기능을 테스트하고, 블록체인 네트워크와 상호작용하여 데이터를 관리할 수 있습니다.

이 과정은 데이터 수집 시스템에 필요한 스마트 컨트랙트 템플릿을 저장하고 필요에 따라 적절한 템플릿을 실행하는 체인코드를 만드는 방법을 설명합니다. Hyperledger Fabric 네트워크에서 `shim.ChaincodeServer`를 사용하여 체인코드를 외부 서비스로 실행하고, 체인코드 설치 및 승인 후 템플릿을 저장하고 실행할 수 있습니다. 이를 통해 데이터 수집 시스템에서 효율적으로 스마트 컨트랙트 템플릿을 관리하고 사용할 수 있습니다.