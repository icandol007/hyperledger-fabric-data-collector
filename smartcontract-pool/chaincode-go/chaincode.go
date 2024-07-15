package main

import (
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Template struct {
	ID          string `json:"ID"`
	Name        string `json:"Name"`
	Version     string `json:"Version"`
	Code        string `json:"Code"`
	Description string `json:"Description"`
}

type SmartContract struct {
	contractapi.Contract
}

var templates = []Template{
	// 예시 템플릿 1번 : 투표 데이터 수집하는 스마트 컨트랙트 템플릿
	{ID: "template1", Name: "VoteDataCollection", Version: "1.0", Code: "voteCode", Description: "Collects vote data"},
	// 예시 템플릿 2번 : 온도 데이터 수집하는 스마트 컨트랙트 템플릿
	{ID: "template2", Name: "TemperatureDataCollection", Version: "1.0", Code: "temperatureCode", Description: "Collects temperature data"},
}

// CreateTemplate : 데이터 수집에 사용되는 스마트 컨트랙트 템플릿을 생성하여 템플릿 배열에 추가
func (s *SmartContract) CreateTemplate(ctx contractapi.TransactionContextInterface, id string, name string, version string, code string, description string) error {
	template := Template{
		ID:          id,
		Name:        name,
		Version:     version,
		Code:        code,
		Description: description,
	}

	templates = append(templates, template)
	return nil
}

// ExecuteTemplate : 템플릿 아이디를 인수로 전달하여 해당 스마트 컨트랙트 템플릿을 실행하는 함수
// 현재 템플릿을 추가할 시 case 를 추가하여 해당 템플릿을 실행하는 함수를 return 시켜야함(이렇게 구현할 시 템플릿 추가할 때 마다 템플릿 함수가 추가되어 복잡해짐)
func (s *SmartContract) ExecuteTemplate(ctx contractapi.TransactionContextInterface, id string) (string, error) {
	for _, template := range templates {
		if template.ID == id {
			switch template.Code {
			case "voteCode":
				return s.executeVoteCode(ctx)
			case "temperatureCode":
				return s.executeTemperatureCode(ctx)
			default:
				return "", fmt.Errorf("unsupported code: %s", template.Code)
			}
		}
	}
	return "", fmt.Errorf("template not found: %s", id)
}

// 스마트 컨트랙트 템플릿 1번 실행하는 함수
func (s *SmartContract) executeVoteCode(ctx contractapi.TransactionContextInterface) (string, error) {
	// smartcontract_template의 vote_code.go를 실행시켜야함
	return "Executed VoteCode", nil
}

// 스마트 컨트랙트 템플릿 2번 실행하는 함수
func (s *SmartContract) executeTemperatureCode(ctx contractapi.TransactionContextInterface) (string, error) {
	// smartcontract_template의 temperature_code.go를 실행시켜야함
	return "Executed TemperatureCode", nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		fmt.Printf("Error creating chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting chaincode: %s", err.Error())
	}
}
