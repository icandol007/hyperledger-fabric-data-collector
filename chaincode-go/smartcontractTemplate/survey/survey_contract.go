package survey

import (
	"encoding/json"
	"fmt"
	"smartcontractPool/smartcontractTemplate/common"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
	common.Common
}

// CreateSurveyItem : 새로운 설문조사 항목 에셋을 블록체인에 저장
func (s *SmartContract) CreateSurveyItem(ctx contractapi.TransactionContextInterface, surveyQuestionNumber string, surveyQuestionContent string) error {
	surveyItem := SurveyItems{
		SurveyQuestionNumber:  surveyQuestionNumber,
		SurveyQuestionContent: surveyQuestionContent,
		SurveyAnswer:          "", // 질문을 생성하는 과정이기 때문에 답변 항목은 빈칸으로 저장

		CommonAttributes: common.CommonAttributes{
			VoteCount: 0,
		},
	}

	surveyItemJSON, err := json.Marshal(surveyItem)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(surveyQuestionNumber, surveyItemJSON)
}

// CreateSurveyParticipant : 새로운 설문조사 참여자 에셋을 블록체인에 저장
func (s *SmartContract) CreateSurveyParticipant(ctx contractapi.TransactionContextInterface, id string, name string, age int, region string, gender string, surveyQuestionNumber string, surveyAnswer string) error {
	surveyItem := SurveyItems{
		SurveyQuestionNumber: surveyQuestionNumber,
		SurveyAnswer:         surveyAnswer,
	}

	participant := SurveyParticipant{
		CommonAttributes: common.CommonAttributes{
			ID:     id,
			Name:   name,
			Age:    age,
			Region: region,
			Gender: gender,
		},
		SurveyItems: surveyItem,
	}

	participantJSON, err := json.Marshal(participant)
	if err != nil {
		return err
	}

	ctx.GetStub().PutState(id, participantJSON)

	return s.VoteCountAscent(ctx, surveyQuestionNumber) // 해당 설문조사 질문의 참여 횟수를 1증가
}

// GetSurveyItem : 블록체인에서 설문조사 항목 에셋을 조회
func (s *SmartContract) GetSurveyItem(ctx contractapi.TransactionContextInterface, surveyQuestionNumber string) (*SurveyItems, error) {
	surveyItemJSON, err := ctx.GetStub().GetState(surveyQuestionNumber)
	if err != nil {
		return nil, err
	}
	if surveyItemJSON == nil {
		return nil, fmt.Errorf("survey item %s does not exist", surveyQuestionNumber)
	}

	var surveyItem SurveyItems
	err = json.Unmarshal(surveyItemJSON, &surveyItem)
	if err != nil {
		return nil, err
	}

	return &surveyItem, nil
}

// GetSurveyParticipant : 블록체인에서 설문조사 참여자 에셋을 조회
func (s *SmartContract) GetSurveyParticipant(ctx contractapi.TransactionContextInterface, id string) (*SurveyParticipant, error) {
	participantJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, err
	}
	if participantJSON == nil {
		return nil, fmt.Errorf("survey participant %s does not exist", id)
	}

	var participant SurveyParticipant
	err = json.Unmarshal(participantJSON, &participant)
	if err != nil {
		return nil, err
	}

	return &participant, nil
}

// UpdateAnswerSurvey : 설문조사 항목에 답변을 업데이트
func (s *SmartContract) UpdateAnswerSurvey(ctx contractapi.TransactionContextInterface, id string, surveyAnswer string) error {
	participant, err := s.GetSurveyParticipant(ctx, id)
	if err != nil {
		return err
	}

	participant.SurveyAnswer = surveyAnswer

	participantJSON, err := json.Marshal(participant)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, participantJSON)
}

// common 패키지의 interface를 override하여 사용
func (s *SmartContract) VoteCountAscent(ctx contractapi.TransactionContextInterface, surveyQuestionNumber string) error {
	queryString := fmt.Sprintf(`{"selector":{"surveyQuestionNumber":"%s"}}`, surveyQuestionNumber)
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

		var surveyItem SurveyItems
		err = json.Unmarshal(queryResponse.Value, &surveyItem)
		if err != nil {
			return err
		}

		surveyItem.VoteCount++

		surveyItemJSON, err := json.Marshal(surveyItem)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(surveyItem.SurveyQuestionNumber, surveyItemJSON)
		if err != nil {
			return err
		}
	}

	return nil
}
