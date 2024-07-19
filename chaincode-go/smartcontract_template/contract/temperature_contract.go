package contract

import (
	"encoding/json"
	"fmt"

	"smartcontract_pool/assets" // assets 패키지를 import
	"smartcontract_pool/common" // common 패키지를 import

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// TemperatureSmartContract 구조체는 온도 데이터 체인코드의 메인 구조체입니다.
type TemperatureSmartContract struct {
	contractapi.Contract
}

// CreateTemperature 함수는 새로운 온도 데이터를 블록체인에 저장합니다.
func (s *TemperatureSmartContract) CreateTemperature(ctx contractapi.TransactionContextInterface, id string, name string, age int, value float64, timestamp string) error {
	temperature := assets.Temperature{
		CommonAttributes: common.CommonAttributes{
			ID:   id,
			Name: name,
			Age:  age,
		},
		Value:     value,
		Timestamp: timestamp,
	}

	temperatureJSON, err := json.Marshal(temperature)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, temperatureJSON)
}

// GetTemperature 함수는 블록체인에서 온도 데이터를 조회합니다.
func (s *TemperatureSmartContract) GetTemperature(ctx contractapi.TransactionContextInterface, id string) (*assets.Temperature, error) {
	temperatureJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, err
	}
	if temperatureJSON == nil {
		return nil, fmt.Errorf("temperature data %s does not exist", id)
	}

	var temperature assets.Temperature
	err = json.Unmarshal(temperatureJSON, &temperature)
	if err != nil {
		return nil, err
	}

	return &temperature, nil
}
