import React, { useState } from "react";
import Image from "next/image";
import ImageTable from "./ImageTable";
import Loading from "./Loading";
import Modal from "./Modal";
import { UsersIcon } from "@heroicons/react/24/solid";

const UploadFile = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [listCropImg, setListCropImg] = useState<string[] | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [saveModal, setSaveModal] = useState(false);
    const [falseModal, setFalseModal] = useState(false);
    const [modelFail, setModelFail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [patientId, setPatientId] = useState('');
    const [birthOfDate, setBirthOfDate] = useState('');
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState(0);

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

    const upPatient = async () => {
        const today = new Date()
        const dob = new Date(birthOfDate)
        let a = today.getFullYear() - dob.getFullYear();
        let token = localStorage.getItem('token')
        setAge(a)

        if(birthOfDate != '' && gender != ''){
            try{
                const res = await fetch("http://localhost:5000/v1/patient/",{
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                    "age":age,
                    "birth_date":birthOfDate.toString(),
                    "gender":gender
                }),
                })

                const resdata = await res.json()
                console.log(resdata)
            }
            catch(error){

            }
        }
    }

    const getLastPatient = async () => {
        let token = localStorage.getItem('token')
        try{
            const res = await fetch("http://localhost:5000/v1/patient/",{
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            const resdata= await res.json()
            setPatientId(resdata.data[resdata.data.length - 1].patient_id)
            console.log(patientId)
        }
        catch(error){
        }
    }

    const handleUpload = async () => {
        await upPatient()
        await getLastPatient()

        if (!selectedFile) {
            setIsLoading(false);
            setFalseModal(true);
            return;
        }
        setIsLoading(true);

        const formData = new FormData();
        let token = localStorage.getItem('token');
        formData.append("patient_id", patientId);
        formData.append("file", selectedFile);
        
        try {
            const response = await fetch("http://127.0.0.1:8000/api/segmentation/crop", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const responseData = await response.json();
            if (responseData.data.bitewing_file) {
              // Assuming `responseData.crop_img` is the base64 string of the cropped image
              // Convert base64 string to an image and set it for preview
              setPreviewUrl(`data:image/jpeg;base64,${responseData.data.bitewing_file}`);
              // console.log(responseData.list_crop_img);
              if (Array.isArray(responseData.data.list_tooth)) {
                const formattedList = responseData.data.list_tooth.map((item: { image_file: string }) => `data:image/jpeg;base64,${item.image_file}`);
                setListCropImg(formattedList);
              }
      
            }

        } catch (error) {
            setIsLoading(false);
            setModelFail(true);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadCroppedImage = () => {
        if (previewUrl) {
            const link = document.createElement('a');
            link.href = previewUrl;
            // You can set a default file name for the download
            link.download = 'cropped-image.jpeg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        //  If there is no preview URL, show popup
        else {
            setFalseModal(true);
        }
    };

    return (
        <div className="m-5 w-full sm:w-[800px] flex flex-col items-center justify-center p-6 bg-indigo-600 rounded-lg shadow-md mb-5 ">
            
            <div className="flex flex-row items-center justify-center text-white mb-4">
                <select
                    className="rounded-md p-1 bg-inherit border mx-8"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                Date Of Birth:
                <input
                    className="rounded-md p-1 bg-inherit border mx-2"
                    type="date"
                    required
                    onChange={(e) => setBirthOfDate(e.target.value)}
                />
            </div >

            <Modal
                isOpen={openModal}
                setIsOpen={setOpenModal}
                title="Predict will use time"
                message="Are you sure you want to predict?"
                onUnderstood={() => handleUpload()}
                status={"info"}
            />

            <Modal
                isOpen={saveModal}
                setIsOpen={setSaveModal}
                title="Save predict result"
                message="Are you sure you want to save predict result?"
                onUnderstood={() => handleUpload()}
                status={"info"}
            />


            <Modal
                isOpen={falseModal}
                setIsOpen={setFalseModal}
                title="Fail to predict"
                message="Make sure you have selected a file."
                onUnderstood={() => setFalseModal(false)}
                status={"fail"}
            />

            <Modal
                isOpen={modelFail}
                setIsOpen={setModelFail}
                title="Fail to predict"
                message="Can not connect to server. Please try again."
                onUnderstood={() => setModelFail(false)}
                status={"fail"}
            />

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
            {listCropImg && (
                <button
                    onClick={() => {
                        setSaveModal(true)
                    }}
                    className=" mt-5 px-6 py-2 text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    SAVE PREDICT IMAGE
                </button>)}

            <button
                onClick={() => {
                    setOpenModal(true)
                }}
                className="px-6 py-2 text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                START PREDICT
            </button>
            {/* <button
        onClick={downloadCroppedImage}
        className="mt-5 px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        DOWNLOAD CROPPED IMAGE
      </button> */}


        </div>



    );
};


export default UploadFile;
