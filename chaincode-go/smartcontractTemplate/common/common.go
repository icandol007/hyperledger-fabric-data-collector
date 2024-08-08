package common

import "github.com/hyperledger/fabric-contract-api-go/contractapi"

// CommonAttributes 구조체는 여러 템플릿에서 공통으로 사용
type CommonAttributes struct {
	ID        string `json:"id"`        // 사용자가 로그인 시 사용되는 고유한 ID
	Name      string `json:"name"`      // 사용자의 이름
	Age       int    `json:"age"`       // 사용자의 나이
	Region    string `json:"region"`    // 데이터를 수집할 때 필요한 지역 정보
	Gender    int    `json:"gender"`    // 사용자의 성별 (남성: 0, 여성: 1)
	VoteCount int    `json:"voteCount"` // 1씩 증가시킬 수 있는 득표수 변수
}

// 득표수를 1 증가시키는 함수의 interface, override하여 사용
type Common interface {
	VoteCountAscent(ctx contractapi.TransactionContextInterface, search_ID string) error
}
