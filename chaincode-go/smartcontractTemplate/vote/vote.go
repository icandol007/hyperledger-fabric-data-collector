package vote

import "smartcontractPool/smartcontractTemplate/common"

// Candidater : 투표 후보자 에셋
type Candidate struct {
	common.CommonAttributes        // 공통 속성 : ID, VoteCount 사용
	CandidateNumber         string `json:"candidateNumber"`
	CandidateName           string `json:"candidateName"`
}

// Voter : 투표 참여자 에셋
type Voter struct {
	common.CommonAttributes // 공통 속성 : ID, Name, Age, Gender, Region 사용
	Candidate               // 공통 속성 : CandidateNumber
}
