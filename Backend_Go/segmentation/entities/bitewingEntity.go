package entities

import (
	"gorm.io/gorm"
)

type (
	Bitewing struct {
		gorm.Model
		ImageId uint32 `json:"image_id" gorm:"foreignkey:Image"`
		Name    string `json:"name"`
		Side    string `json:"side"`
		Status  string `json:"status"`
	}
)
