package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// 구조체 정의
type AirQualityData struct {
	Date   string  `json:"date"`
	Region string  `json:"region"`
	PM10   int     `json:"pm10"`
	Ozone  float64 `json:"ozone"`
	NO2    float64 `json:"no2"`
	CO     float64 `json:"co"`
}

// SmartContract 구조체 정의
type SmartContract struct {
	contractapi.Contract
}

// 대기질 데이터를 저장하는 함수
func (s *SmartContract) CreateAirQuality(ctx contractapi.TransactionContextInterface, date string, region string, pm10 string, ozone string, no2 string, co string) error {
	pm10Value, err := strconv.Atoi(pm10)
	if err != nil {
		return fmt.Errorf("PM10 변환 오류: %s", err.Error())
	}
	ozoneValue, err := strconv.ParseFloat(ozone, 64)
	if err != nil {
		return fmt.Errorf("오존 변환 오류: %s", err.Error())
	}
	no2Value, err := strconv.ParseFloat(no2, 64)
	if err != nil {
		return fmt.Errorf("NO2 변환 오류: %s", err.Error())
	}
	coValue, err := strconv.ParseFloat(co, 64)
	if err != nil {
		return fmt.Errorf("CO 변환 오류: %s", err.Error())
	}

	airQuality := AirQualityData{
		Date:   date,
		Region: region,
		PM10:   pm10Value,
		Ozone:  ozoneValue,
		NO2:    no2Value,
		CO:     coValue,
	}

	airQualityJSON, err := json.Marshal(airQuality)
	if err != nil {
		return fmt.Errorf("JSON 변환 오류: %s", err.Error())
	}

	key := region + "_" + date
	return ctx.GetStub().PutState(key, airQualityJSON)
}

// 대기질 데이터 조회 함수
func (s *SmartContract) QueryAirQuality(ctx contractapi.TransactionContextInterface, date string, region string) (*AirQualityData, error) {
	key := region + "_" + date
	airQualityJSON, err := ctx.GetStub().GetState(key)
	if err != nil {
		return nil, fmt.Errorf("대기질 데이터 조회 실패: %s", err.Error())
	}
	if airQualityJSON == nil {
		return nil, fmt.Errorf("해당 대기질 데이터가 없습니다.")
	}

	var airQuality AirQualityData
	err = json.Unmarshal(airQualityJSON, &airQuality)
	if err != nil {
		return nil, fmt.Errorf("JSON 변환 오류: %s", err.Error())
	}

	return &airQuality, nil
}

// AirQualityData 메타데이터 반환
func (s *SmartContract) GetAssetMetadata(ctx contractapi.TransactionContextInterface) (map[string]string, error) {
	metadata := map[string]string{
		"Date":   "string",
		"Region": "string",
		"PM10":   "int",
		"Ozone":  "float64",
		"NO2":    "float64",
		"CO":     "float64",
	}
	return metadata, nil
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
