package contract

import (
	"encoding/json"
	"fmt"

	"smartcontract_pool/assets" // assets 패키지를 import
	"smartcontract_pool/common"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract 구조체는 체인코드의 메인 구조체입니다.
type SmartContract struct {
	contractapi.Contract
}

// CreateVoter 함수는 새로운 투표 참여자 에셋을 블록체인에 저장합니다.
func (s *SmartContract) CreateVoter(ctx contractapi.TransactionContextInterface, id string, name string, age int, gender string, region string) error {
	voter := assets.Voter{
		CommonAttributes: common.CommonAttributes{
			ID:   id,
			Name: name,
			Age:  age,
		},
		Gender: gender,
		Region: region,
	}

	voterJSON, err := json.Marshal(voter)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, voterJSON)
}

// GetVoter 함수는 블록체인에서 투표 참여자 에셋을 조회합니다.
func (s *SmartContract) GetVoter(ctx contractapi.TransactionContextInterface, id string) (*assets.Voter, error) {
	voterJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, err
	}
	if voterJSON == nil {
		return nil, fmt.Errorf("voter %s does not exist", id)
	}

	var voter assets.Voter
	err = json.Unmarshal(voterJSON, &voter)
	if err != nil {
		return nil, err
	}

	return &voter, nil
}
