package main

import (
    "encoding/json"
    "fmt"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
    contractapi.Contract
}

type Data struct {
    ID    string `json:"id"`
    Value string `json:"value"`
}

func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
    data := []Data{
        {ID: "data1", Value: "value1"},
        {ID: "data2", Value: "value2"},
    }
    for _, d := range data {
        dataJSON, err := json.Marshal(d)
        if err != nil {
            return err
        }
        err = ctx.GetStub().PutState(d.ID, dataJSON)
        if err != nil {
            return fmt.Errorf("failed to put data to world state: %v", err)
        }
    }
    return nil
}

func (s *SmartContract) CreateData(ctx contractapi.TransactionContextInterface, id string, value string) error {
    data := Data{
        ID:    id,
        Value: value,
    }
    dataJSON, err := json.Marshal(data)
    if err != nil {
        return err
    }
    return ctx.GetStub().PutState(id, dataJSON)
}

func (s *SmartContract) ReadData(ctx contractapi.TransactionContextInterface, id string) (*Data, error) {
    dataJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return nil, fmt.Errorf("failed to read from world state: %v", err)
    }
    if dataJSON == nil {
        return nil, fmt.Errorf("the data %s does not exist", id)
    }
    var data Data
    err = json.Unmarshal(dataJSON, &data)
    if err != nil {
        return nil, err
    }
    return &data, nil
}

func main() {
    chaincode, err := contractapi.NewChaincode(new(SmartContract))
    if err != nil {
        fmt.Printf("Error create data-collector chaincode: %s", err.Error())
        return
    }
    if err := chaincode.Start(); err != nil {
        fmt.Printf("Error starting data-collector chaincode: %s", err.Error())
    }
}
