package common

import "github.com/hyperledger/fabric-contract-api-go/contractapi"

// CommonAttributes 구조체는 여러 템플릿에서 공통으로 사용
type CommonAttributes struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Age       int    `json:"age"`
	Region    string `json:"region"`
	Gender    int    `json:"gender"`
	VoteCount int    `json:"voteCount"`
}

type Common interface {
	VoteCountAscent(ctx contractapi.TransactionContextInterface, search_ID string) error
}
