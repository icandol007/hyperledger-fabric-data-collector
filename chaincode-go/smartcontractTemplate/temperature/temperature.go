package temperature

import "smartcontractPool/smartcontractTemplate/common"

type Temperature struct {
	common.CommonAttributes         // 공통 속성 : id, name, region 사용
	TemperatureValue        float64 `json:"value"`
	Timestamp               string  `json:"timestamp"`
}
