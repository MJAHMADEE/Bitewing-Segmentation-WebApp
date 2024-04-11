from model.segmentation import SegmentationRequest, SegmentationInsert
from model.image import ImageInsert
from model.bitewing import BitewingInsert
from model.tooth import ToothInsert
from repository.bitewing import BitewingRepository
from repository.image import ImageRepository
from repository.segmentation import SegmentationRepository
from repository.tooth import ToothRepository
from service.imageService import ImageService
from PIL import Image


class SegmentationService:
    
    @staticmethod
    async def insert(segmentation_request: SegmentationRequest):
        image_insert = ImageInsert(
            path=segmentation_request.bitewing_path,
            status="Active"
        )
        image_id = await ImageRepository.create(image_insert)
        if not image_id:
            return None

        bitewing_insert = BitewingInsert(
            image_id=image_id,
            status="Active",
            created_at="now()",
        )
        bitewing_id = await BitewingRepository.create(bitewing_insert)
        if not bitewing_id:
            return None

        #insert result to database
        segmentation_insert = SegmentationInsert(
            bitewing_id=bitewing_id,
            dentist_id=segmentation_request.dentist_id,
            patient_id=segmentation_request.patient_id,
            status="Active"
        )
        result_id = await SegmentationRepository.create(segmentation_insert)
        if not result_id:
            return None
        
        list_tooth_id = []
        for tooth_data in segmentation_request.list_crop_img:
            image_insert = ImageInsert(
                path=tooth_data.get("image_path"),
                status="Active"
            )
            image_id = await ImageRepository.create(image_insert)
            if not image_id:
                return None
            tooth_insert = ToothInsert(
                result_id=result_id,
                image_id=image_id,
                numbering=tooth_data.get("numbering"),
                position=tooth_data.get("position"),
                status="Active"
            )
            tooth_id = await ToothRepository.create(tooth_insert)
            if not tooth_id:
                return None
            

            tooth_data = {
                "tooth_id": tooth_id,
                "numbering":tooth_data.get("numbering"),
                "confidence":tooth_data.get("confidence"),
                "image_url": tooth_data.get("image_path"),
            }
            list_tooth_id.append(tooth_data)


        data_response ={
            "segmentation_id": result_id,
            "bitewing_id": bitewing_id,
            "bitewing_url": segmentation_request.bitewing_path,
            "list_tooth": list_tooth_id
        }
        return data_response
