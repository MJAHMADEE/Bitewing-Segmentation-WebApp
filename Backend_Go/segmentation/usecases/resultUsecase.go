package usecases

import (
	"fmt"
	patient "segmentation/patient/models"
	segmentationError "segmentation/segmentation/errors"
	"segmentation/segmentation/models"
	"segmentation/segmentation/repositories"
	"strconv"
)

type ResultUsecase interface {
	CheckResultId(resultId *string) error
	SaveResult(in *models.SegmentationUpdateModel, resultId *string) error
	GetDetailResult(resultId *string) (*models.SegmentationDetailModel, error)
	GetResultsByDentistId(dentistId *string) ([]*models.SegmentationModel, error)
	DeleteResult(resultId *string) error
}

type resultUsecaseImpl struct {
	resultRepository   repositories.ResultRepository
	bitewingRepository repositories.BitewingRepository
	toothRepository    repositories.ToothRepository
}

func NewResultUsecaseImpl(resultRepository repositories.ResultRepository, bitewingRepository repositories.BitewingRepository, toothRepository repositories.ToothRepository) ResultUsecase {
	return &resultUsecaseImpl{
		resultRepository:   resultRepository,
		bitewingRepository: bitewingRepository,
		toothRepository:    toothRepository,
	}
}

func (u *resultUsecaseImpl) CheckResultId(resultId *string) error {
	if result, err := u.resultRepository.Search("id", resultId); !result || err != nil {
		if err != nil {
			return err
		} else {
			return &segmentationError.ResultNotFoundError{}
		}
	}
	return nil
}

func (u *resultUsecaseImpl) GetDetailResult(resultId *string) (*models.SegmentationDetailModel, error) {
	resultData, err := u.resultRepository.GetResultDataByKey("id", resultId, true)
	fmt.Println(resultData.Bitewing.Image.Path)
	if err != nil {
		return nil, err
	}
	if resultData == nil {
		return nil, &segmentationError.ResultNotFoundError{}
	}
	listTooth, err := u.toothRepository.GetTeethDataByKey("result_id", resultId)
	if err != nil {
		return nil, err
	}
	listToothModel := make([]*models.ToothModel, 0)
	for _, tooth := range listTooth {
		toothModel := &models.ToothModel{
			Id:          uint64(tooth.ID),
			Image:       tooth.Image.Path,
			Name:        tooth.Name,
			TypeTooth:   tooth.TypeTooth,
			TypeCaries:  tooth.TypeCaries,
			Numbering:   tooth.Numbering,
			Filing:      tooth.Filing,
			Position:    tooth.Position,
			Description: tooth.Description,
			Treatment:   tooth.Treatment,
		}
		listToothModel = append(listToothModel, toothModel)
	}
	bitewingModel := &models.BitewingModel{
		Id:    uint64(resultData.Bitewing.ID),
		Image: resultData.Bitewing.Image.Path,
		Name:  stringIsNil(resultData.Bitewing.Name),
		Side:  stringIsNil(resultData.Bitewing.Side),
	}
	patientModel := &patient.PatientModel{
		ID:        uint64(resultData.Patient.ID),
		BirthDate: resultData.Patient.BirthDate,
		Gender:    resultData.Patient.Gender,
		Age:       resultData.Patient.Age,
		Phone:     resultData.Patient.Phone,
	}
	result := &models.SegmentationDetailModel{
		Id:          uint64(resultData.ID),
		Bitewing:    *bitewingModel,
		Patient:     *patientModel,
		Description: resultData.Description,
		Treatment:   resultData.Treatment,
		CreatedAt:   resultData.CreatedAt,
		ListTooth:   listToothModel,
	}

	return result, nil
}

func (u *resultUsecaseImpl) SaveResult(in *models.SegmentationUpdateModel, resultId *string) error {
	resultData, err := u.resultRepository.GetResultDataByKey("id", resultId, false)
	if err != nil {
		return err
	}
	if resultData == nil {
		return &segmentationError.ResultNotFoundError{}
	}
	resultData.Description = stringIsNil(in.Description)
	resultData.Treatment = stringIsNil(in.Treatment)

	for _, tooth := range in.ListTooth {
		toothIdStr := fmt.Sprint(tooth.ToothId)
		if check, err := u.toothRepository.SearchWithResultId("id", &toothIdStr, resultId); !check || err != nil {
			if err != nil {
				return err
			} else {
				return &segmentationError.ResultNotFoundError{}
			}
		}
		toothData, err := u.toothRepository.GetToothDataByKey("id", &toothIdStr)
		if err != nil {
			return err
		}
		if toothData == nil {
			return &segmentationError.ToothNotFoundError{}
		}
		toothData.Name = stringIsNil(tooth.Name)
		toothData.TypeTooth = stringIsNil(tooth.TypeTooth)
		toothData.TypeCaries = &tooth.TypeCaries
		toothData.Filing = stringIsNil(tooth.Filing)
		toothData.Description = stringIsNil(tooth.Description)
		toothData.Treatment = stringIsNil(tooth.Treatment)
		if err := u.toothRepository.UpdateToothData(toothData); err != nil {
			return err
		}
	}
	if err := u.resultRepository.UpdateResultData(resultData); err != nil {
		return err
	}
	return nil
}

func (u *resultUsecaseImpl) GetResultsByDentistId(dentistId *string) ([]*models.SegmentationModel, error) {
	listResult, err := u.resultRepository.GetResultsDataByKey("dentist_id", dentistId, true)
	if err != nil {
		return nil, err
	}
	if listResult == nil {
		return nil, &segmentationError.ResultNotFoundError{}
	}
	listResultModel := make([]*models.SegmentationModel, 0)
	for _, result := range listResult {
		bitewingModel := &models.BitewingModel{
			Id:    uint64(result.Bitewing.ID),
			Image: result.Bitewing.Image.Path,
			Name:  stringIsNil(result.Bitewing.Name),
			Side:  stringIsNil(result.Bitewing.Side),
		}
		patientModel := &patient.PatientModel{
			ID:        uint64(result.Patient.ID),
			BirthDate: result.Patient.BirthDate,
			Gender:    result.Patient.Gender,
			Age:       result.Patient.Age,
			Phone:     result.Patient.Phone,
		}
		resultModel := &models.SegmentationModel{
			Id:          uint64(result.ID),
			Bitewing:    *bitewingModel,
			Patient:     *patientModel,
			Description: result.Description,
			Treatment:   result.Treatment,
			CreatedAt:   result.CreatedAt,
		}
		listResultModel = append(listResultModel, resultModel)
	}

	return listResultModel, nil
}

func (u *resultUsecaseImpl) DeleteResult(resultId *string) error {
	idUint64, err := strconv.ParseUint(*resultId, 10, 64)
	if err != nil {
		return &segmentationError.ServerInternalError{}
	}
	resultData, err := u.resultRepository.GetResultDataByKey("id", resultId, false)
	if err != nil {
		return err
	}
	if resultData == nil {
		return &segmentationError.ResultNotFoundError{}
	}
	listTooth, err := u.toothRepository.GetTeethDataByKey("result_id", resultId)
	if err != nil {
		return err
	}
	for _, tooth := range listTooth {
		toothId := uint64(tooth.ID)
		if err := u.toothRepository.DeleteToothData(&toothId); err != nil {
			return err
		}
	}
	bitewingId := uint64(resultData.BitewingId)
	if err := u.bitewingRepository.DeleteBitewingData(&bitewingId); err != nil {
		return err
	}
	if err := u.resultRepository.DeleteResultData(&idUint64); err != nil {
		return err
	}
	return nil
}
