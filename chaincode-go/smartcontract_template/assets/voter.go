package assets

import "smartcontractPool/common" // common 패키지를 import합니다.

// Voter 구조체는 투표 참여자 에셋을 정의합니다.
type Voter struct {
	common.CommonAttributes        // 공통 속성을 포함합니다.
	Gender                  string `json:"gender"`
	Region                  string `json:"region"`
}
