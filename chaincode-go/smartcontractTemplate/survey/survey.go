package survey

import (
	"smartcontractPool/smartcontractTemplate/common"
)

// SurveyItem 구조체는 설문조사 항목 에셋을 정의
type SurveyItems struct {
	SurveyQuestionNumber  string `json:"surveyQuestionNumber"`  // 설문 번호
	SurveyQuestionContent string `json:"surveyQusetionContent"` // 설문 내용
	SurveyAnswer          string `json:"surveyAnswer"`          // 설문 답변(데이터 수집자가 에셋 생성 시 비어있는 항목, 참여자가 답변 생성 시 해당 답변으로 transfer)
}

// SurveyParticipant 구조체는 설문조사 참여자 에셋을 정의
type SurveyParticipant struct {
	common.CommonAttributes // 공통 속성 ID, Name, Age, Region, Gender 사용
	SurveyItems             // SurveyQuestionNumber, SurveyAnswer 사용
}
