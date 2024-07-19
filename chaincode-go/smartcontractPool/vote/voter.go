package vote

import (
	"smartcontractPool/smartcontractPool/common"
)

// Voter 구조체는 투표 참여자 에셋을 정의
type Voter struct {
	common.CommonAttributes        // 공통 속성 ID, Name, Age, Gender, Region 사용
	CandidateNumber         string `json:"candidateNumber"`
}

// Candidater 구조체는 투표 후보자 에셋을 정의
type Candidate struct {
	common.CommonAttributes        // 공통 속성 ID 사용
	CandidateNumber         string `json:"candidateNumber"`
	CandidateName           string `json:"candidateName"`
	VoteCount               int    `json:"VoteCount"`
}
