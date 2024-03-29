import time
from fastapi import APIRouter, File, Form, UploadFile
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from model.response import ResponseModel
from service.cropping import CroppingService
from service.auth import AuthService
from service.segmentation import SegmentationService
from service.imageService import ImageService
from model.segmentation import SegmentationRequest
from PIL import Image

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(
    prefix="/api/segmentation",
    tags=["segmentation"],
    responses={404: {"description": "Not found"}},
)
@router.post("/crop",response_model= ResponseModel,response_model_exclude_none=True)
async def cropping(file: UploadFile = File(...),patient_id:int=Form(...) ,token:str = Depends(oauth2_scheme)):
    start_time = time.time()
    dentist_id = await AuthService.verifyAuth(token)
    image = CroppingService.save_image(file)
    data_path = CroppingService.cropping(image)
    bitewing_image_path = data_path[1]
    image_path_crop = data_path[0]
    #add to database
    segmentation_request = SegmentationRequest(
        dentist_id=dentist_id,
        patient_id=patient_id,
        bitewing_path=bitewing_image_path,
        list_crop_img=image_path_crop,
    )
    result = await SegmentationService.insert(segmentation_request)
    if result == None:
        raise HTTPException(
            status_code=400,
            detail="Failed to insert data",
        )
    

    end_time = time.time()
    print(f"Total time: {end_time - start_time} seconds")
    return ResponseModel(data=result, message="Image has been cropped successfully")


@router.post("/test_crop",response_model= ResponseModel,response_model_exclude_none=True)
async def crop(file: UploadFile = File(...)):
    start_time = time.time()  # Start timing

    image = CroppingService.save_image(file)
    save_time = time.time()
    data_path = CroppingService.cropping(image)
    crop_time = time.time()

    image_path = data_path[0]
    image_path_crop = data_path[1]
    img = Image.open(image_path_crop)

    response = dict(
        crop_img=image_path_crop,
        crop_img_file=ImageService.image_to_base64(img),
        list_crop_img=image_path
    )   
    end_time = time.time()
    print(f"Save image time: {save_time - start_time} seconds")
    print(f"Cropping time: {crop_time - save_time} seconds")
    print(f"Total time: {end_time - start_time} seconds")
    return ResponseModel(data=response, message="Image has been cropped successfully")