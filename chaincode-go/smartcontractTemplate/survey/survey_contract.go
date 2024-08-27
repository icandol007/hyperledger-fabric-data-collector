package survey

import (
	"encoding/json"
	"fmt"
	"smartcontractPool/smartcontractTemplate/common"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SurveySmartContract struct {
	contractapi.Contract
	common.Common
}

// CreateSurveyItem : 새로운 설문조사 항목 에셋을 블록체인에 저장
func (s *SurveySmartContract) CreateSurveyItem(
	ctx contractapi.TransactionContextInterface,
	surveyQuestionNumber string,
	surveyQuestionContent string,
) error {
	surveyItem := SurveyItems{
		SurveyQuestionNumber:  surveyQuestionNumber,  // 설문 질문의 고유한 ID
		SurveyQuestionContent: surveyQuestionContent, // 설문 질문 내용
		SurveyAnswer:          "",                    // 질문을 생성하는 과정이기 때문에 답변 항목은 빈칸으로 저장
	}

	surveyItemJSON, err := json.Marshal(surveyItem)
	if err != nil {
		return err
	}
	// 구성한 에셋을 원장에 저장
	return ctx.GetStub().PutState(surveyQuestionNumber, surveyItemJSON)
}

// CreateSurveyParticipant : 새로운 설문조사 참여자 에셋을 블록체인에 저장
func (s *SurveySmartContract) CreateSurveyParticipant(ctx contractapi.TransactionContextInterface, id string, name string, age int, region string, gender int, surveyQuestionNumber string, surveyAnswer string) error {
	surveyItem := SurveyItems{
		SurveyQuestionNumber: surveyQuestionNumber, // 설문 질문의 고유한 ID
		SurveyAnswer:         surveyAnswer,         // 설문에 대한 응답을 저장
	}

	participant := SurveyParticipant{
		CommonAttributes: common.CommonAttributes{ // 공통으로 사용되는 에셋 재사용
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
	// 구성한 에셋을 원장에 저장
	ctx.GetStub().PutState(id, participantJSON)
	// 해당 설문조사 질문의 ID를 인자로 사용하여 참여 횟수를 1증가
	return s.VoteCountAscent(ctx, surveyQuestionNumber)
}

// GetSurveyItem : 블록체인에서 설문조사 항목 에셋을 조회
func (s *SurveySmartContract) GetSurveyItem(ctx contractapi.TransactionContextInterface, surveyQuestionNumber string) (*SurveyItems, error) {
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

// // GetSurveyParticipant : 블록체인에서 설문조사 참여자 에셋을 조회
// func (s *SurveySmartContract) GetSurveyParticipant(ctx contractapi.TransactionContextInterface, id string) (*SurveyParticipant, error) {
// 	participantJSON, err := ctx.GetStub().GetState(id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	if participantJSON == nil {
// 		return nil, fmt.Errorf("survey participant %s does not exist", id)
// 	}

// 	var participant SurveyParticipant
// 	err = json.Unmarshal(participantJSON, &participant)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return &participant, nil
// }
