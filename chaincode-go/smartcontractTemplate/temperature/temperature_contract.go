package temperature

import (
	"encoding/json"
	"fmt"
	"smartcontractPool/smartcontractTemplate/common"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type TemperatureSmartContract struct {
	contractapi.Contract
}

// CreateTemperature 함수는 새로운 온도 데이터를 블록체인에 저장
func (s *TemperatureSmartContract) CreateTemperature(ctx contractapi.TransactionContextInterface, id string, name string, region string, temperatureValue float64, timestamp string) error {
	temperature := Temperature{
		CommonAttributes: common.CommonAttributes{ // 데이터 수집에 사용되는 공통 항목들
			ID:     id,
			Name:   name,
			Region: region, // 온도 데이터에 해당하는 지역
		},
		TemperatureValue: temperatureValue, // 온도 데이터
		Timestamp:        timestamp,        // 온도 데이터에 해당하는 시간
	}

	temperatureJSON, err := json.Marshal(temperature)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(region, temperatureJSON)
}

// GetTemperature : 블록체인에서 온도 데이터 조회
func (s *TemperatureSmartContract) GetTemperature(ctx contractapi.TransactionContextInterface, region string) (*Temperature, error) {
	temperatureJSON, err := ctx.GetStub().GetState(region)
	if err != nil {
		return nil, err
	}
	if temperatureJSON == nil {
		return nil, fmt.Errorf("temperature data %s does not exist", region)
	}

	var temperature Temperature
	err = json.Unmarshal(temperatureJSON, &temperature)
	if err != nil {
		return nil, err
	}

	return &temperature, nil
}
