from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from config.database import postgres
import uvicorn
import os
import cropping_model as cropping
from PIL import Image

def initialize_app():

    @asynccontextmanager
    async def lifespan(app:FastAPI):
        print("Starting app")
        #connect to database
        await postgres.start()

        yield 
        print("Stopping app")
        #disconnect from database
        await postgres.stop()
        
        
    app =FastAPI(lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        #allow_origins=["http://localhost:3000"],  # Replace with the actual origin of your web app
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    def read_root():
        #get env variable
        return {"Hello": "World"}
    
    app.mount("/images",StaticFiles(directory="./img"),name="images")


    from controller.segmentation import router as segmentation_router
    app.include_router(segmentation_router)



    return app

app = initialize_app()
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)
    #uvicorn.run(app, host="127.0.0.1", port=8000)