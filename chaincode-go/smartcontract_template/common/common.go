package common

// CommonAttributes 구조체는 여러 템플릿에서 공통으로 사용할 수 있는 속성을 정의합니다.
type CommonAttributes struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Age    int    `json:"age"`
	Gender string `json:"gender"`
}
