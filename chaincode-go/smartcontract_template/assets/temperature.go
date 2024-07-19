package assets

import "smartcontractPool/common" // common 패키지를 import합니다.

// Temperature 구조체는 온도 데이터를 정의합니다.
type Temperature struct {
	common.CommonAttributes         // 공통 속성을 포함합니다.
	Value                   float64 `json:"value"`
	Timestamp               string  `json:"timestamp"`
}
