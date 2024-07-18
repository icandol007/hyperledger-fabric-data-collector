package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/peer"
)

// TemperatureRecord represents a temperature record
type TemperatureRecord struct {
	Region      string  `json:"region"`
	Temperature float64 `json:"temperature"`
	Timestamp   string  `json:"timestamp"`
}

// TemperatureChaincode implements the chaincode interface
type TemperatureChaincode struct {
}

// Init initializes the chaincode
func (t *TemperatureChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

// Invoke routes the chaincode functions
func (t *TemperatureChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	function, args := stub.GetFunctionAndParameters()
	switch function {
	case "RecordTemperature":
		return t.RecordTemperature(stub, args)
	case "QueryTemperature":
		return t.QueryTemperature(stub, args)
	default:
		return shim.Error("Invalid function name")
	}
}

// RecordTemperature : 온도 데이터를 기록. 지역과 타임스탬프를 키로 사용하여 온도 데이터를 상태 데이터베이스에 저장
func (t *TemperatureChaincode) RecordTemperature(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	region := args[0]
	temperature, err := strconv.ParseFloat(args[1], 64)
	if err != nil {
		return shim.Error("Invalid temperature value")
	}
	timestamp := args[2]

	// 데이터 생성
	record := TemperatureRecord{
		Region:      region,
		Temperature: temperature,
		Timestamp:   timestamp,
	}

	recordBytes, err := json.Marshal(record)
	if err != nil {
		return shim.Error("Failed to marshal record")
	}

	// 생성된 데이터 원장에 저장
	err = stub.PutState(region+"_"+timestamp, recordBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record temperature for region %s", region))
	}

	return shim.Success(nil)
}

// QueryTemperature : 지역과 타임스탬프를 사용하여 상태 데이터베이스에서 온도 데이터를 조회
func (t *TemperatureChaincode) QueryTemperature(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	region := args[0]
	timestamp := args[1]

	// 원장에서 온도 데이터를 검색
	recordBytes, err := stub.GetState(region + "_" + timestamp)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to get record for region %s", region))
	}
	if recordBytes == nil {
		return shim.Error(fmt.Sprintf("Record for region %s and timestamp %s not found", region, timestamp))
	}

	return shim.Success(recordBytes)
}

func main() {
	err := shim.Start(new(TemperatureChaincode))
	if err != nil {
		fmt.Printf("Error starting TemperatureChaincode: %s", err)
	}
}
