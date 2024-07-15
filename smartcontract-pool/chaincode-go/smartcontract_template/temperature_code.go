package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-chaincode-go/shim"
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
func (t *TemperatureChaincode) Init(stub shim.ChaincodeStubInterface) shim.Response {
	return shim.Success(nil)
}

// Invoke routes the chaincode functions
func (t *TemperatureChaincode) Invoke(stub shim.ChaincodeStubInterface) shim.Response {
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

// RecordTemperature records a new temperature entry
func (t *TemperatureChaincode) RecordTemperature(stub shim.ChaincodeStubInterface, args []string) shim.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	region := args[0]
	temperature, err := strconv.ParseFloat(args[1], 64)
	if err != nil {
		return shim.Error("Invalid temperature value")
	}
	timestamp := args[2]

	// Create a new temperature record
	record := TemperatureRecord{
		Region:      region,
		Temperature: temperature,
		Timestamp:   timestamp,
	}

	recordBytes, err := json.Marshal(record)
	if err != nil {
		return shim.Error("Failed to marshal record")
	}

	// Save the record to the ledger
	err = stub.PutState(region+"_"+timestamp, recordBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record temperature for region %s", region))
	}

	return shim.Success(nil)
}

// QueryTemperature retrieves a temperature record
func (t *TemperatureChaincode) QueryTemperature(stub shim.ChaincodeStubInterface, args []string) shim.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	region := args[0]
	timestamp := args[1]

	// Retrieve the temperature record from the ledger
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
