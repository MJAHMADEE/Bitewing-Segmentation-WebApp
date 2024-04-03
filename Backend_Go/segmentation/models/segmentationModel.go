package models

import (
	patient "segmentation/patient/models"
	"time"
)

type (
	SegmentationDetailModel struct {
		Id          uint64               `json:"id"`
		Bitewing    BitewingModel        `json:"bitewing"`
		Patient     patient.PatientModel `json:"patient"`
		Description *string              `json:"description"`
		Treatment   *string              `json:"treatment"`
		CreatedAt   time.Time            `json:"created_at"`
		ListTooth   []*ToothModel        `json:"list_tooth"`
	}

	SegmentationModel struct {
		Id          uint64               `json:"id"`
		Bitewing    BitewingModel        `json:"bitewing"`
		Patient     patient.PatientModel `json:"patient"`
		Description *string              `json:"description"`
		Treatment   *string              `json:"treatment"`
		CreatedAt   time.Time            `json:"created_at"`
	}

	SegmentationUpdateModel struct {
		Description string             `json:"description"`
		Treatment   string             `json:"treatment"`
		ListTooth   []ToothUpdateModel `json:"list_tooth" validate:"required,dive"`
	}

	ToothUpdateModel struct {
		ToothId     uint64 `json:"tooth_id" validate:"required"`
		Name        string `json:"name"`
		TypeTooth   string `json:"type_tooth"`
		TypeCaries  string `json:"type_caries"`
		Filing      string `json:"filing"`
		Description string `json:"description"`
		Treatment   string `json:"treatment"`
	}

	ToothModel struct {
		Id          uint64  `json:"id"`
		Image       string  `json:"image"`
		Name        *string `json:"name"`
		TypeTooth   *string `json:"type_tooth"`
		TypeCaries  *string `json:"type_caries"`
		Numbering   uint64  `json:"numbering"`
		Filing      *string `json:"filing"`
		Position    string  `json:"position"`
		Description *string `json:"description"`
		Treatment   *string `json:"treatment"`
	}

	BitewingModel struct {
		Id    uint64  `json:"id"`
		Image string  `json:"image"`
		Name  *string `json:"name"`
		Side  *string `json:"side"`
	}
)
