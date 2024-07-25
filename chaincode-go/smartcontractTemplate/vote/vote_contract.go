package vote

import (
	"encoding/json"
	"fmt"
	"smartcontractPool/smartcontractTemplate/common"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type VoteSmartContract struct {
	contractapi.Contract
	common.Common
}

// CreateVoter : 새로운 투표 참여자 에셋을 블록체인에 저장
func (s *VoteSmartContract) CreateVoter(ctx contractapi.TransactionContextInterface, id string, name string, age int, gender string, region string, candidateNumber string) error {
	// Check if voter already exists
	voterJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return err
	}
	if voterJSON != nil {
		return fmt.Errorf("voter with ID %s already exists", id)
	}

	voter := Voter{
		CommonAttributes: common.CommonAttributes{
			ID:     id,
			Name:   name,
			Age:    age,
			Gender: gender,
			Region: region,
		},

		Candidate: Candidate{
			CandidateNumber: candidateNumber,
		},
	}

	voterJSON, err = json.Marshal(voter)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(id, voterJSON)
	if err != nil {
		return err
	}

	return s.VoteCountAscent(ctx, candidateNumber)
}

func (s *VoteSmartContract) CreateCandidate(ctx contractapi.TransactionContextInterface, candidateNumber string, candidateName string) error {
	candidate := Candidate{
		CandidateNumber: candidateNumber,
		CandidateName:   candidateName,
		CommonAttributes: common.CommonAttributes{
			VoteCount: 0,
		},
	}

	candidateJSON, err := json.Marshal(candidate)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(candidateNumber, candidateJSON)
}

// // GetVoter : 블록체인에서 투표 참여자 에셋을 조회
// func (s *VoteSmartContract) GetVoter(ctx contractapi.TransactionContextInterface, id string) (*Voter, error) {
// 	voterJSON, err := ctx.GetStub().GetState(id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	if voterJSON == nil {
// 		return nil, fmt.Errorf("voter %s does not exist", id)
// 	}

// 	var voter Voter
// 	err = json.Unmarshal(voterJSON, &voter)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return &voter, nil
// }

// VoteCountAscent : 투표 데이터 제출 시 득표 변수 1증가
func (s *VoteSmartContract) VoteCountAscent(ctx contractapi.TransactionContextInterface, searchID string) error {
	queryString := fmt.Sprintf(`{"selector":{"candidateNumber":"%s"}}`, searchID)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return err
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return err
		}

		var candidate Candidate
		err = json.Unmarshal(queryResponse.Value, &candidate)
		if err != nil {
			return err
		}

		candidate.VoteCount++

		candidateJSON, err := json.Marshal(candidate)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(candidate.CandidateNumber, candidateJSON)
		if err != nil {
			return err
		}
	}

	return nil
}
