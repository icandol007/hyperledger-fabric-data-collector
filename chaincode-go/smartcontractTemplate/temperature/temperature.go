package temperature

import "smartcontractPool/smartcontractTemplate/common"

type Temperature struct {
	common.CommonAttributes         // 공통 속성 : id, name, region 사용
	NumericData             float64 `json:"value"`     // 숫자 데이터
	Timestamp               string  `json:"timestamp"` // 시간 데이터
}
