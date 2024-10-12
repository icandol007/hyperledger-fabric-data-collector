package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// 구조체 정의
type WaterQualityData struct {
	Date     string  `json:"date"`
	Region   string  `json:"region"`
	Temp     float64 `json:"temp"`
	PH       float64 `json:"ph"`
	Salinity float64 `json:"salinity"`
}

// SmartContract 구조체 정의
type SmartContract struct {
	contractapi.Contract
}

// 수질 데이터를 저장하는 함수
func (s *SmartContract) CreateWaterQuality(ctx contractapi.TransactionContextInterface, date string, region string, temp string, ph string, salinity string) error {
	temperature, err := strconv.ParseFloat(temp, 64)
	if err != nil {
		return fmt.Errorf("수온 변환 오류: %s", err.Error())
	}
	phValue, err := strconv.ParseFloat(ph, 64)
	if err != nil {
		return fmt.Errorf("pH 변환 오류: %s", err.Error())
	}
	salinityValue, err := strconv.ParseFloat(salinity, 64)
	if err != nil {
		return fmt.Errorf("염분 변환 오류: %s", err.Error())
	}

	waterQuality := WaterQualityData{
		Date:     date,
		Region:   region,
		Temp:     temperature,
		PH:       phValue,
		Salinity: salinityValue,
	}

	waterQualityJSON, err := json.Marshal(waterQuality)
	if err != nil {
		return fmt.Errorf("JSON 변환 오류: %s", err.Error())
	}

	key := region + "_" + date
	return ctx.GetStub().PutState(key, waterQualityJSON)
}

// 수질 데이터 조회 함수
func (s *SmartContract) QueryWaterQuality(ctx contractapi.TransactionContextInterface, date string, region string) (*WaterQualityData, error) {
	key := region + "_" + date
	waterQualityJSON, err := ctx.GetStub().GetState(key)
	if err != nil {
		return nil, fmt.Errorf("수질 데이터 조회 실패: %s", err.Error())
	}
	if waterQualityJSON == nil {
		return nil, fmt.Errorf("해당 수질 데이터가 없습니다.")
	}

	var waterQuality WaterQualityData
	err = json.Unmarshal(waterQualityJSON, &waterQuality)
	if err != nil {
		return nil, fmt.Errorf("JSON 변환 오류: %s", err.Error())
	}

	return &waterQuality, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("체인코드 생성 실패: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("체인코드 실행 실패: %s", err.Error())
	}
}

// WaterQualityData 메타데이터 반환
func (s *SmartContract) GetAssetMetadata(ctx contractapi.TransactionContextInterface) (map[string]string, error) {
	metadata := map[string]string{
		"Date":     "string",
		"Region":   "string",
		"Temp":     "float64",
		"PH":       "float64",
		"Salinity": "float64",
	}
	return metadata, nil
}
