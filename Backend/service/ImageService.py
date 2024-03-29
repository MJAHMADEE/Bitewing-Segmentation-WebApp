import base64
from io import BytesIO
from PIL import Image

class ImageService:
    def image_to_base64(image: Image.Image) -> str:
        buffered = BytesIO()
        image.save(buffered, format="PNG")  
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return img_str