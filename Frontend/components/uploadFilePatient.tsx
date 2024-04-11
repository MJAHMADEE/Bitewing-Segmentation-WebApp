import React, { useState } from "react";
import Image from "next/image";
import ImageTable from "./ImageTable";
import Loading from "./Loading";
import Modal from "./Modal";
import { UsersIcon } from "@heroicons/react/24/solid";
import FolderUploadComponent from "./FolderUploadComponent";

interface Tooth {
    tooth_id: number;
    severity: string;
    carie_type: string;
    detail: string;
    numbering: string;
    image_file: string;
    confidence: string;
}

interface listToothSave {
    tooth_id: number;
    name: string;
    type_tooth: string;
    type_caries: string;
    filing: string;
    description: string;
    treatment: string;
}

interface save {
    description: string,
    treatment: string,
    list_tooth: listToothSave[]
}

const UploadFile = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [listCropImg, setListCropImg] = useState<Tooth[]>();
    const [openModal, setOpenModal] = useState(false);
    const [saveModal, setSaveModal] = useState(false);
    // const [falseModal, setFalseModal] = useState(false);
    const [modelFail, setModelFail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [patientId, setPatientId] = useState('');
    const [birthOfDate, setBirthOfDate] = useState('');
    const [gender, setGender] = useState('male');
    const [show, setShow] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [sid, setSid] = useState(null)
    const [saveState, setSaveState] = useState<save>({ description: "", treatment: "", list_tooth: [] });
    const [previewUrls, setPreviewUrls] = useState<Array<{ file: File, url: string }> | null>(null);
    const [isFolderUpload, setIsFolderUpload] = useState(false);


    const prepareSaveData = () => {
        if (listCropImg != null) {
            let tempList = listCropImg.map(tooth => ({
                tooth_id: tooth.tooth_id,
                name: "",
                type_tooth: tooth.severity,
                type_caries: tooth.carie_type,
                filing: "",
                description: "",
                treatment: tooth.detail
            }));
            setSaveState({ ...saveState, list_tooth: tempList })
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, isFolder: boolean) => {
        const files = event.target.files ? Array.from(event.target.files) : [];

        if (isFolder) {
            const imageFiles = files.map(file => {
                const url = URL.createObjectURL(file);
                return { file, url };
            });

            setPreviewUrls(imageFiles);
            setSelectedFile(null); // Reset single file upload
        } else {
            const file = files[0];
            setSelectedFile(file);

            if (file) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                setPreviewUrls(null); // Reset folder upload
            }
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

        const data = JSON.stringify({
            "age": a,
            "birth_date": birthOfDate.toString(),
            "gender": gender
        })
        console.log(data)

        if (birthOfDate != '' && gender != '') {
            try {
                const res = await fetch("http://localhost:5000/v1/patient/", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: data,
                })

                const resdata = await res.json()
                console.log(resdata)
                if (resdata.message == 'Patient created') {
                    await getLastPatient()
                    setShowUpload(true)
                }
            }
            catch (error) {

            }
        }
        else {
            alert("fill")
        }
    }

    const getLastPatient = async () => {
        let token = localStorage.getItem('token')
        try {
            const res = await fetch("http://localhost:5000/v1/patient/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            const resdata = await res.json()
            setPatientId(resdata.data[resdata.data.length - 1].patient_id)
            console.log(patientId)
        }
        catch (error) {
        }
    }

    const handleUpload = async () => {
        setIsLoading(true);
        let token = localStorage.getItem('token');

        // If it's a folder upload, loop through all files and post them one by one
        if (isFolderUpload && previewUrls) {

            setListFullCropImg([]);
            for (const fileData of previewUrls) {
                const formData = new FormData();
                formData.append("patient_id", patientId);
                formData.append("file", fileData.file); // Assuming `fileData.file` is the actual File object

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
                    // Process each response
                    console.log(responseData);
                    setListFullCropImg(prevList => [
                        ...prevList,
                        { url: responseData.url || `data:image/jpeg;base64,${responseData.data.bitewing_file}` }
                    ]);
                    // Here you may want to update state with each image result
                    // ...


                } catch (error) {
                    console.error('Error uploading file:', error);
                    setModelFail(true);
                    // Decide if you want to continue or break the loop on error
                    break;
                }
            }
            setIsLoading(false);

        } else if (selectedFile) {
            // If it's a single file upload, do the usual single file post
            const formData = new FormData();
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
                        const formattedList = await responseData.data.list_tooth.map((item: { numbering: string; confidence: string; image_file: string; tooth_id: string }) => ({
                            tooth_id: item.tooth_id,
                            numbering: item.numbering,
                            confidence: item.confidence,
                            image_file: `data:image/jpeg;base64,${item.image_file}`,
                            carie_type: 'NONE',
                            severity: 'NONE',
                            detail: ''
                        }));
                        console.log(formattedList)
                        setSid(responseData.data.segmentation_id)
                        setListCropImg(formattedList);
                    }
                    setShow(true)
                    console.log(listCropImg)

                }
            } catch (error) {
                setIsLoading(false);
                setModelFail(true);
            } finally {
                setIsLoading(false);
            }

            try {

            }
            catch (error) {

            }
        };
    }

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

    const saveResult = async () => {
        let token = localStorage.getItem('token');
        prepareSaveData()
        console.log(saveState)
        console.log(sid)
        try {
            const resp = await fetch("http://localhost:5000/v1/segmentation/" + sid, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(saveState)
            })
            const responseData = await resp.json();
            if (responseData.message == "Success") {
                alert("saved")
            }
        }
        catch (error) {

        }
    }

    return (

        <div className="sm:w-800 flex flex-row bg-indigo-600 rounded-lg shadow-md p-4 mt-24 h-full">
            <div className="m-2">
                {!showUpload && (
                    <div className="flex flex-row items-center justify-center text-white mb-4">
                        Patient:
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
                            max="2022-12-31"

                            required
                            onChange={(e) => setBirthOfDate(e.target.value)}
                        />
                        <button
                            className="px-6 py-2 mx-4 text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={upPatient}
                        >SAVE</button>

                    </div >)}

                <div>
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

                    {/* <Modal
                        isOpen={falseModal}
                        setIsOpen={setFalseModal}
                        title="Fail to predict"
                        message="Make sure you have selected a file."
                        onUnderstood={() => setFalseModal(false)}
                        status={"fail"}
                    /> */}

                    <Modal
                        isOpen={modelFail}
                        setIsOpen={setModelFail}
                        title="Fail to predict"
                        message="Can not connect to server. Please try again."
                        onUnderstood={() => setModelFail(false)}
                        status={"fail"}
                    />
                </div>

                {/* {showUpload && (
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="mb-4 block w-full px-4 py-2 text-sm text-gray-700 bg-indigo-300 0 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        accept="image/png, image/jpeg, image/tiff, application/pdf"
                    />

                )} */}

                {showUpload && !isFolderUpload && (
                    <div className="flex flex-col justify-center items-center w-full">
                        <div>
                            <h1 className="text-white text-center mb-2">Upload Single File</h1>
                        </div>
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e, false)}
                            className="mb-4 block w-full px-4 py-2 text-sm text-gray-700 bg-indigo-300 0 rounded-md focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            accept="image/png, image/jpeg, image/tiff, application/pdf"
                        />
                        {/* <button
                            onClick={() => {
                                setIsFolderUpload(true)
                                setPreviewUrl(null)
                                setListCropImg(null)
                            }}
                            className="mb-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md px-4 py-2 w-full"
                        >
                            Switch to Folder Upload
                        </button> */}
                    </div>
                )}

                {/* {listFullCropImg && (
                    <div className="flex flex-row">
                        {listFullCropImg.map((img, index) => (
                            <div key={index} className="p-2">
                                <img src={img.url} alt={`Cropped image ${index}`} className="w-40 h-40 object-cover" />
                            </div>
                        ))}
                    </div>
                )} */}

                {/* {isFolderUpload && (
                    <>
                        <div>
                            <h1 className="text-white text-center mb-2">Upload Folder</h1>
                        </div>
                        <FolderUploadComponent setPreviewUrls={setPreviewUrls} />
                        <button
                            onClick={() => setIsFolderUpload(false)}
                            className="mt-2 text-white bg-red-500 hover:bg-red-700 rounded-md px-4 py-2 mb-2 flex justify-center items-center"
                        >
                            Switch to Single File Upload
                        </button>
                    </>
                )} */}

                {previewUrl && (
                    <div className="preview-container" style={{ overflow: "auto" }}>
                        {selectedFile?.type === "application/pdf" ? (
                            <object
                                data={previewUrl}
                                type="application/pdf"
                                width="100%"
                                height="700px"
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
                                width={700}
                                height={700}
                                className="mb-4 max-w-xs rounded-md"
                            />
                        ) : (
                            <Image
                                src={previewUrl}
                                width={700}
                                height={700}
                                alt="Preview"
                                className="sm:w-300 sm:h-300 w-700 h-700 max-w-700 rounded-xl"
                            />
                        )}
                        {/* {
                            listFullCropImg.map((img, index) => (
                                <div key={index} className="p-2">
                                    <img src={img.url} alt={`Cropped image ${index}`} className="w-24 h-24 object-cover" />
                                </div>
                            ))
                        } */}
                    </div>
                )}
                {showUpload && (
                    <div className="justify-center content-center">
                        <button
                            onClick={() => {
                                setOpenModal(true)
                            }}
                            className="mx-8 px-6 py-2 text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            START PREDICT
                        </button>

                        {listCropImg && (
                            <button
                                onClick={downloadCroppedImage}
                                className="mt-5 px-6 py-2 text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                DOWNLOAD CROPPED IMAGE
                            </button>)}

                        {listCropImg && (
                            <button
                                onClick={() => saveResult()}
                                className="mt-5 mx-7 px-6 py-2 text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                SAVE CHANGE
                            </button>
                        )}

                    </div>
                )}



            </div>
            {show && (
                <div className="m-2">
                    <ImageTable
                        images={listCropImg ?? []}
                        setListCropImg={setListCropImg}
                    />
                </div>
            )}

        </div>



    );
};


export default UploadFile;
