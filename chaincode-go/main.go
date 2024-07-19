package main

import (
	"fmt"
	"smartcontractPool/smartcontractPool/temperature" // temperature 패키지를 import
	"smartcontractPool/smartcontractPool/vote"        // vote 패키지를 import

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func main() {
	voterChaincode, err := contractapi.NewChaincode(new(vote.SmartContract))
	if err != nil {
		fmt.Printf("Error creating voter chaincode: %s", err.Error())
		return
	}

	temperatureChaincode, err := contractapi.NewChaincode(new(temperature.TemperatureSmartContract))
	if err != nil {
		fmt.Printf("Error creating temperature chaincode: %s", err.Error())
		return
	}

	fmt.Println("Starting chaincodes...")

	if err := voterChaincode.Start(); err != nil {
		fmt.Printf("Error starting voter chaincode: %s", err.Error())
	}

	if err := temperatureChaincode.Start(); err != nil {
		fmt.Printf("Error starting temperature chaincode: %s", err.Error())
	}
}
