package common

import (
	"encoding/json"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// CommonAttributes 구조체는 여러 템플릿에서 공통으로 사용할 수 있는 속성을 정의합니다.
type CommonAttributes struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// PutCommonAttributes 함수는 공통 속성을 블록체인에 저장하는 기능을 제공합니다.
func PutCommonAttributes(ctx contractapi.TransactionContextInterface, id string, attributes CommonAttributes) error {
	attributesJSON, err := json.Marshal(attributes)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, attributesJSON)
}

// GetCommonAttributes 함수는 블록체인에서 공통 속성을 조회하는 기능을 제공합니다.
func GetCommonAttributes(ctx contractapi.TransactionContextInterface, id string) (*CommonAttributes, error) {
	attributesJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, err
	}
	if attributesJSON == nil {
		return nil, nil
	}

	var attributes CommonAttributes
	err = json.Unmarshal(attributesJSON, &attributes)
	if err != nil {
		return nil, err
	}

	return &attributes, nil
}
