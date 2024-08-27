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
func (s *VoteSmartContract) CreateVoter(ctx contractapi.TransactionContextInterface, id string, name string, age int, gender int, region string, candidateNumber string) error {
	// 투표 데이터를 이미 제출한 사람인지 id를 통해 확인
	voterJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return err
	}
	if voterJSON != nil {
		return fmt.Errorf("voter with ID %s already exists", id)
	}

	voter := Voter{
		// common의 에셋을 재사용
		CommonAttributes: common.CommonAttributes{
			ID:     id,
			Name:   name,
			Age:    age,
			Gender: gender,
			Region: region,
		},
		// candidate의 에셋을 재사용
		Candidate: Candidate{
			CandidateNumber: candidateNumber,
		},
	}

	voterJSON, err = json.Marshal(voter)
	if err != nil {
		return err
	}
	// 입력 내용으로 만든 voter 에셋을 원장에 추가
	err = ctx.GetStub().PutState(id, voterJSON)
	if err != nil {
		return err
	}
	// 마지막 return문에 VoteCountAscent 함수를 실행시켜 득표수 1증가
	return s.VoteCountAscent(ctx, candidateNumber)
}

func (s *VoteSmartContract) CreateCandidate(ctx contractapi.TransactionContextInterface, candidateNumber string, candidateName string) error {
	candidate := Candidate{
		CandidateNumber: candidateNumber, // 투표 후보 기호
		CandidateName:   candidateName,   // 투표 후보 이름
		CommonAttributes: common.CommonAttributes{
			VoteCount: 0, // 득표 : 0
		},
	}

	candidateJSON, err := json.Marshal(candidate)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(candidateNumber, candidateJSON)
}

// GetAllCandidates : 블록체인에서 모든 후보자 에셋을 조회
func (s *VoteSmartContract) GetAllCandidates(ctx contractapi.TransactionContextInterface) ([]*Candidate, error) {
	// 후보자 데이터를 찾기 위해 candidateNumber가 존재하는지 확인하는 쿼리
	queryString := `{"selector":{"candidateNumber":{"$exists":true}}}`

	// resultsIterator : 쿼리 결과를 순회하며 각 후보자 정보를 Candidate 구조체로 디코딩하고, candidates 슬라이스에 추가
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var candidates []*Candidate
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var candidate Candidate
		err = json.Unmarshal(queryResponse.Value, &candidate)
		if err != nil {
			return nil, err
		}
		candidates = append(candidates, &candidate)
	}

	return candidates, nil
}

// VoteCountAscent : 투표 데이터 제출 시 득표 변수 1증가
func (s *VoteSmartContract) VoteCountAscent(ctx contractapi.TransactionContextInterface, searchID string) error {
	// CandidateNumber가 일치하는 에셋을 검색
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
		// 찾은 candidate 에셋의 VoteCount 변수 1 증가
		candidate.VoteCount++

		candidateJSON, err := json.Marshal(candidate)
		if err != nil {
			return err
		}
		// 바뀐 에셋으로 원장 저장
		err = ctx.GetStub().PutState(candidate.CandidateNumber, candidateJSON)
		if err != nil {
			return err
		}
	}

	return nil
}
