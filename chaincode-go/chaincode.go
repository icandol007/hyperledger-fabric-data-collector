package main

import (
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
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

// CreateTemplate : 데이터 수집에 사용되는 스마트 컨트랙트 템플릿을 생성하여 템플릿 배열에 추가(근데 어차피 코드 직접 추가할거면 Create함수가 필요한가??)
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
	// CCID (string)- CCID should match chaincode’s package name on peer. 
	// This is the CCID associated with the installed chaincode as returned by the peer lifecycle chaincode install <package> CLI command. 
	// This can be obtained post-install using the “peer lifecycle chaincode queryinstalled” command.
	ccid := "mycc:fcbf8724572d42e859a7dd9a7cd8e2efb84058292017df6e3d89178b64e6c831"

        server := &shim.ChaincodeServer{
                        CCID: ccid,
                        Address: "myhost:9999"
                        CC: new(SimpleChaincode),
                        TLSProps: shim.TLSProperties{
                                Disabled: true,
                        },
                }
        err := server.Start()
        if err != nil {
                fmt.Printf("Error starting Simple chaincode: %s", err)
        }
}
