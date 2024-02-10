import React, { useState } from "react";
import Image from "next/image";
import ImageTable from "./ImageTable";
import Loading from "./Loading";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [listCropImg, setListCropImg] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);

    if (file) {
      // Immediately convert the file to a URL and set it for preview   const fileType = file.type;

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };


  if (isLoading) {
    return (
      <div className="w-full h-screen">
        <Loading isOpen={true} />
      </div>
    )
  }


  const handleUpload = async () => {

    setIsLoading(true);
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {

      const response = await fetch("http://127.0.0.1:8000/api/crop", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.crop_img) {
        // Assuming `responseData.crop_img` is the base64 string of the cropped image
        // Convert base64 string to an image and set it for preview
        setPreviewUrl(`data:image/jpeg;base64,${responseData.crop_img}`);
        // console.log(responseData.list_crop_img);
        if (Array.isArray(responseData.list_crop_img)) {
          const formattedList = responseData.list_crop_img.map((img: string) => `data:image/jpeg;base64,${img}`);
          setListCropImg(formattedList);
        }

      }

    } catch (error) {
      console.error("Error during file upload:", error);
      alert("There was an error uploading the file.");
    } finally {
      setIsLoading(false);

    }
  };

  return (

    <div className=" m-5 w-full sm:w-[800px] flex flex-col items-center justify-center p-6 bg-indigo-600 rounded-lg shadow-md mb-5 ">

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 block w-full px-4 py-2 text-sm text-gray-700 bg-indigo-300 0 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        accept="image/png, image/jpeg, image/tiff, application/pdf"
      />
      {previewUrl && (
        <div className="preview-container" style={{ overflow: "auto" }}>
          {selectedFile?.type === "application/pdf" ? (
            <object
              data={previewUrl}
              type="application/pdf"
              width="100%"
              height="500px"
              className="mb-4"
            >
              <p>
                Your browser does not support PDFs. Please download the PDF to
                view it: <a href={previewUrl}>Download PDF</a>.
              </p>
            </object>
          ) : selectedFile?.type === "image/tiff" ? (
            <Image
              src={previewUrl}
              alt="TIFF Preview"
              width={500}
              height={500}
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "500px",
                maxHeight: "500px",
              }}
            />
          ) : (
            <Image
              src={previewUrl}
              width={500}
              height={500}
              alt="Preview"
              className="mb-4 max-w-xs rounded-md"
            />
          )}
        </div>
      )}
      <div>
        <ImageTable
          images={listCropImg ?? []}
        />

      </div>

      <button
        onClick={handleUpload}
        className=" mt-5 px-6 py-2 text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        START PREDICT
      </button>

    </div>

  );
};


export default UploadFile;
