package common

import "github.com/hyperledger/fabric-contract-api-go/contractapi"

// CommonAttributes 구조체는 여러 템플릿에서 공통으로 사용할 수 있는 속성을 정의합니다.
type CommonAttributes struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Age       int    `json:"age"`
	Region    string `json:"region"`
	Gender    string `json:"gender"`
	VoteCount int    `json:"voteCount"`
}

type Common interface {
	VoteCountAscent(ctx contractapi.TransactionContextInterface, searchID string) error
}
