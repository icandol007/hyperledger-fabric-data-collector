package main

import (
	"encoding/json"
	"fmt"

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

type AirQualityData struct {
	Date   string  `json:"date"`
	Region string  `json:"region"`
	PM10   int     `json:"pm10"`
	Ozone  float64 `json:"ozone"`
	NO2    float64 `json:"no2"`
	CO     float64 `json:"co"`
}

type WeatherData struct {
	Date        string  `json:"date"`
	Region      string  `json:"region"`
	MaxTemp     float64 `json:"maxTemp"`
	MinTemp     float64 `json:"minTemp"`
	MaxWind     float64 `json:"maxWind"`
	MinHumidity int     `json:"minHumidity"`
}

// SmartContract 구조체 정의
type SmartContract struct {
	contractapi.Contract
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

// 기상 데이터 조회 함수
func (s *SmartContract) QueryWeatherData(ctx contractapi.TransactionContextInterface, date string, region string) (*WeatherData, error) {
	key := region + "_" + date
	weatherJSON, err := ctx.GetStub().GetState(key)
	if err != nil {
		return nil, fmt.Errorf("기상 데이터 조회 실패: %s", err.Error())
	}
	if weatherJSON == nil {
		return nil, fmt.Errorf("해당 기상 데이터가 없습니다.")
	}

	var weather WeatherData
	err = json.Unmarshal(weatherJSON, &weather)
	if err != nil {
		return nil, fmt.Errorf("JSON 변환 오류: %s", err.Error())
	}

	return &weather, nil
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
