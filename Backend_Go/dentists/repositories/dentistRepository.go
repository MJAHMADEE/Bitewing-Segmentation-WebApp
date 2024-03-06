package repositories

import "segmentation/dentists/entities"

type DentistRepository interface {
	Search(key string, value *string) (bool, error)
	GetDentistDataByKey(key string, value *string) (*entities.Dentist, error)
	InsertDentistData(in *entities.InsertDentist) error
	UpdateDentistData(in *entities.UpdateDentist, id *uint32) error
}
