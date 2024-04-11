package server

import (
	authHandler "segmentation/auth/handlers"
	authUsecase "segmentation/auth/usecases"

	dentistHandler "segmentation/dentists/handlers"
	dentistRepository "segmentation/dentists/repositories"
	dentistUsecase "segmentation/dentists/usecases"

	patientHandler "segmentation/patient/handlers"
	patientRepository "segmentation/patient/repositories"
	patientUsecase "segmentation/patient/usecases"

	SegmentationHandler "segmentation/segmentation/handlers"
	SegmentationRepository "segmentation/segmentation/repositories"
	SegmentationUsecase "segmentation/segmentation/usecases"
)

func (s *echoServer) initializeRouters() {
	s.initializeAuthHttpHandler()
	s.initializeDentistHttpHandler()
	s.initializePatientHttpHandler()
	s.initializeSegmentationHttpHandler()
}

func (s *echoServer) initializeAuthHttpHandler() {
	dentistPosgresRepository := dentistRepository.NewDentistPostgresRepository(s.db)
	authUsecase := authUsecase.NewAuthUsecaseImpl(dentistPosgresRepository)
	authHttpHandler := authHandler.NewAuthHttpHandler(authUsecase)

	authRouters := s.app.Group("v1/auth")

	authRouters.POST("/register", authHttpHandler.Register)
	authRouters.POST("/login", authHttpHandler.Login)
}

func (s *echoServer) initializeDentistHttpHandler() {
	dentistPosgresRepository := dentistRepository.NewDentistPostgresRepository(s.db)
	dentistUsecase := dentistUsecase.NewDentistUsecaseImpl(dentistPosgresRepository)
	dentistHttpHandler := dentistHandler.NewDentistHttpHandler(dentistUsecase)

	dentistRouters := s.app.Group("v1/dentist")

	dentistRouters.Use(TokenAuthentication(dentistPosgresRepository))
	dentistRouters.PUT("/", dentistHttpHandler.UpdateDentist)
	dentistRouters.GET("/", dentistHttpHandler.GetDentistById)
	dentistRouters.GET("/", dentistHttpHandler.GetDentistAll)
	dentistRouters.DELETE("/", dentistHttpHandler.DeleteDentist)
}

func (s *echoServer) initializePatientHttpHandler() {
	patientPosgresRepository := patientRepository.NewPatientPostgresRepository(s.db)
	patientUsecase := patientUsecase.NewPatientUsecaseImpl(patientPosgresRepository)
	patientHttpHandler := patientHandler.NewPatientHttpHandler(patientUsecase)

	patientRouters := s.app.Group("v1/patient")

	patientRouters.Use(TokenAuthentication(dentistRepositoryForAuth(s)))
	patientRouters.POST("/", patientHttpHandler.CreatePatient)
	patientRouters.GET("/:id", patientHttpHandler.GetPatientById)
	patientRouters.GET("/", patientHttpHandler.GetPatientsByDentist)
	patientRouters.DELETE("/:id", patientHttpHandler.DeletePatient)
	patientRouters.PUT("/:id", patientHttpHandler.UpdatePatient)
}
func (s *echoServer) initializeSegmentationHttpHandler() {
	//imagePosgresRepository := SegmentationRepository.NewImagePostgresRepository(s.db)
	resultPosgresRepository := SegmentationRepository.NewResultPostgresRepository(s.db)
	bitewingPosgresRepository := SegmentationRepository.NewBitewingPostgresRepository(s.db)
	toothPosgresRepository := SegmentationRepository.NewToothPostgresRepository(s.db)

	resultUsecase := SegmentationUsecase.NewResultUsecaseImpl(
		resultPosgresRepository,
		bitewingPosgresRepository,
		toothPosgresRepository)

	segmentationHttpHandler := SegmentationHandler.NewSegmentationHttpHandler(resultUsecase)

	segmentationRouters := s.app.Group("v1/segmentation")

	segmentationRouters.Use(TokenAuthentication(dentistRepositoryForAuth(s)))
	segmentationRouters.PUT("/:id", segmentationHttpHandler.SaveResult)
	segmentationRouters.GET("/", segmentationHttpHandler.GetResults)
	segmentationRouters.GET("/:id", segmentationHttpHandler.GetDetailResult)
	segmentationRouters.DELETE("/:id", segmentationHttpHandler.DeleteResult)

}

func dentistRepositoryForAuth(s *echoServer) dentistRepository.DentistRepository {
	return dentistRepository.NewDentistPostgresRepository(s.db)
}
