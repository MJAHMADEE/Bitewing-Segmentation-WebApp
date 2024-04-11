package handlers

import (
	dentistError "segmentation/dentists/errors"
	"segmentation/dentists/models"
	"segmentation/dentists/usecases"

	"github.com/gofiber/fiber/v2/log"
	"github.com/labstack/echo/v4"
)

type dentistHttpHandler struct {
	dentistUsecase usecases.DentistUsecase
}

func NewDentistHttpHandler(dentistUsecase usecases.DentistUsecase) DentistHandler {
	return &dentistHttpHandler{
		dentistUsecase: dentistUsecase,
	}
}

func (h *dentistHttpHandler) GetDentistById(c echo.Context) error {
	dentistId := c.Get("dentistId").(string)
	if err := h.dentistUsecase.CheckDentistId(&dentistId); err != nil {
		log.Errorf("Error validating request body: %v", err)
		if _, ok := err.(*dentistError.ServerInternalError); ok {
			return response(c, 500, "Server Internal Error", nil)
		} else {
			return response(c, 400, err.Error(), nil)
		}
	}
	dentist, err := h.dentistUsecase.GetDentistById(&dentistId)
	if err != nil {
		log.Errorf("Error getting dentist by id: %v", err)
		if _, ok := err.(*dentistError.ServerInternalError); ok {
			return response(c, 500, "Server Internal Error", nil)
		} else {
			return response(c, 400, err.Error(), nil)
		}
	}
	return response(c, 200, "Success", dentist)
}

func (h *dentistHttpHandler) GetDentistAll(c echo.Context) error {
	dentists, err := h.dentistUsecase.GetDentistAll()
	if err != nil {
		log.Errorf("Error getting all dentists: %v", err)
		if _, ok := err.(*dentistError.ServerInternalError); ok {
			return response(c, 500, "Server Internal Error", nil)
		} else {
			return response(c, 400, err.Error(), nil)
		}
	}
	return response(c, 200, "Success", dentists)
}

func (h *dentistHttpHandler) UpdateDentist(c echo.Context) error {
	dentistId := c.Get("dentistId").(string)
	reqBody := new(models.UpdateModel)
	if err := c.Bind(reqBody); err != nil {
		log.Errorf("Error binding request body: %v", err)
		return response(c, 400, "Bad request", nil)
	}
	if err := c.Validate(reqBody); err != nil {
		log.Errorf("Error validating request body: %v", err)
		return validationErrorResponse(c, err)
	}
	if err := h.dentistUsecase.CheckDentistId(&dentistId); err != nil {
		log.Errorf("Error validating request body: %v", err)
		if _, ok := err.(*dentistError.ServerInternalError); ok {
			return response(c, 500, "Server Internal Error", nil)
		} else {
			return response(c, 400, err.Error(), nil)
		}
	}

	if err := h.dentistUsecase.UpdateDentist(reqBody, &dentistId); err != nil {
		log.Errorf("Error updating dentist: %v", err)
		if _, ok := err.(*dentistError.ServerInternalError); ok {
			return response(c, 500, "Server Internal Error", nil)
		} else {
			return response(c, 400, err.Error(), nil)
		}
	}
	return response(c, 200, "Success", nil)
}

func (h *dentistHttpHandler) DeleteDentist(c echo.Context) error {
	dentistId := c.Get("dentistId").(string)
	if err := h.dentistUsecase.CheckDentistId(&dentistId); err != nil {
		log.Errorf("Error validating request body: %v", err)
		if _, ok := err.(*dentistError.ServerInternalError); ok {
			return response(c, 500, "Server Internal Error", nil)
		} else {
			return response(c, 400, err.Error(), nil)
		}
	}
	if err := h.dentistUsecase.DeleteDentist(&dentistId); err != nil {
		log.Errorf("Error deleting dentist: %v", err)
		if _, ok := err.(*dentistError.ServerInternalError); ok {
			return response(c, 500, "Server Internal Error", nil)
		} else {
			return response(c, 400, err.Error(), nil)
		}
	}
	return response(c, 200, "Success", nil)
}
