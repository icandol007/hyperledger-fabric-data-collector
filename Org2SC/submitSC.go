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

// 기상 데이터를 저장하는 함수
func (s *SmartContract) CreateWeatherData(ctx contractapi.TransactionContextInterface, date string, region string, maxTemp string, minTemp string, maxWind string, minHumidity string) error {
	// 입력받은 데이터를 변환
	maxTempValue, err := strconv.ParseFloat(maxTemp, 64)
	if err != nil {
		return fmt.Errorf("최고 기온 변환 오류: %s", err.Error())
	}
	minTempValue, err := strconv.ParseFloat(minTemp, 64)
	if err != nil {
		return fmt.Errorf("최저 기온 변환 오류: %s", err.Error())
	}
	maxWindValue, err := strconv.ParseFloat(maxWind, 64)
	if err != nil {
		return fmt.Errorf("최대 풍속 변환 오류: %s", err.Error())
	}
	minHumidityValue, err := strconv.Atoi(minHumidity)
	if err != nil {
		return fmt.Errorf("최소 습도 변환 오류: %s", err.Error())
	}

	// WeatherData 객체 생성
	weather := WeatherData{
		Date:        date,
		Region:      region,
		MaxTemp:     maxTempValue,
		MinTemp:     minTempValue,
		MaxWind:     maxWindValue,
		MinHumidity: minHumidityValue,
	}

	// 객체를 JSON 형식으로 변환
	weatherJSON, err := json.Marshal(weather)
	if err != nil {
		return fmt.Errorf("JSON 변환 오류: %s", err.Error())
	}

	// 블록체인에 저장 (키는 "region_date" 형식)
	key := region + "_" + date
	return ctx.GetStub().PutState(key, weatherJSON)
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
