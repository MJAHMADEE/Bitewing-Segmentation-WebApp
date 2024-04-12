import React, { useState, useEffect } from "react";
import Image from "next/image";
import DetailsModal from "./DetailsModal"; // Import the DetailsModal component

interface Tooth {
    tooth_id: number;
    severity: string;
    carie_type: string;
    detail: string;
    numbering: string;
    image_url: string;
    confidence: string;
}

interface ImageTableProps {
    images: Tooth[];
    setListCropImg: React.Dispatch<React.SetStateAction<Tooth[] | undefined>>;
    prepareSaveData: () => void;
}

interface ToothDetails {
    index: number | null;
    imageUrl?: string;
    details: string;
    tooth_id: number | null;
    numbering: string;
    confidence: string;
    carie_type: string;
    severity: string;
}

const ImageTable: React.FC<ImageTableProps> = ({ images, setListCropImg, prepareSaveData }) => {
    const [selectedImages, setSelectedImages] = useState<boolean[]>(Array(images.length).fill(false));
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [currentToothDetails, setCurrentToothDetails] = useState<ToothDetails>(
        {
            index: null,
            details: "",
            imageUrl: "",
            tooth_id: null,
            numbering: "",
            confidence: "",
            carie_type: "",
            severity: ""
        }
    );
    const [toothCariesType, setCariesToothType] = useState("NONE");
    const [toothCType, setToothCType] = useState("NONE");

    useEffect(() => {
        setSelectedImages(Array(images.length).fill(false));
    }, [images]);

    useEffect(() => {
        let indexStr = localStorage.getItem("index");
        let index: number | null = null;
        if (indexStr != null) {
            index = parseInt(indexStr, 10);
            console.log(index)
            setCurrentToothDetails({
                index: index,
                details: images[index].detail || '',
                imageUrl: images[index].image_url || '',
                tooth_id: images[index].tooth_id,
                numbering: images[index].numbering || '',
                confidence: images[index].confidence || '',
                carie_type: images[index].carie_type || '',
                severity: images[index].severity || ''
            });
            setCariesToothType(currentToothDetails.carie_type)
            setToothCType(currentToothDetails.severity)
        }

    }, [localStorage.getItem("index")])

    const onImageSelect = (index: number, checked: boolean) => {
        const newSelectedImages = [...selectedImages];
        newSelectedImages[index] = checked;
        setSelectedImages(newSelectedImages);
    };

    const openDetailsModal = (index: number) => {
        // setCariesToothType(currentToothDetails.carie_type)
        // setToothCType(currentToothDetails.severity)
        // setCurrentToothDetails({
        //     index: index,
        //     details: images[index].detail || '',
        //     imageUrl: images[index].image_file || '',
        //     tooth_id: images[index].tooth_id,
        //     numbering: images[index].numbering || '' ,
        //     confidence: images[index].confidence || '',
        //     carie_type: images[index].carie_type || '',
        //     severity: images[index].severity || ''
        // });
        localStorage.setItem("index", index.toString())
        localStorage.setItem("0temp", "0")
        console.log("curr", currentToothDetails)
        console.log("all", images)
        setDetailsModalOpen(true);
    };

    const saveToothDetails = async (details: string) => {
        setCurrentToothDetails({ ...currentToothDetails, details });
        setDetailsModalOpen(false);
        if (currentToothDetails.index != null) {
            const imagesCopy = [...images]
            imagesCopy[currentToothDetails.index] = {
                ...imagesCopy[currentToothDetails.index],
                carie_type: toothCariesType,
                detail: currentToothDetails.details,
                severity: toothCType,
            }
            setListCropImg(imagesCopy)
            localStorage.setItem("0temp", "1")
        }
        prepareSaveData()
        console.log("curr", currentToothDetails)
        console.log("all", images)
    };

    const handleOnCancel = () => {
        setDetailsModalOpen(false)
        localStorage.setItem("0temp", "1")
    }
    return (
        <div className="w-full h-[80vh] text-white pr-2 overflow-y-scroll">
            <div className="">
                <div className="flex flex-row">
                    <div>
                        {images.map((img, index) => (
                            <div key={index} className="flex mb-4 border border-white w-80 p-3 rounded-lg">
                                <input
                                    type="checkbox"
                                    checked={selectedImages[index] || false}
                                    onChange={(e) => onImageSelect(index, e.target.checked)}
                                    className="mr-2"
                                />
                                {/* <Image
                                    src={img.image_url}
                                    alt="Tooth Preview"
                                    width={100}
                                    height={100}
                                    className="max-w-xs rounded-md"
                                /> */}
                                <img src={img.image_url} className="w-[100px]" />
                                <div className="w-full ml-2">
                                    <h1 className="text-2xl font-bold mb-2">Class {img.numbering}</h1>
                                    <p>confidence: {img.confidence.substring(0, 5)}</p>
                                </div>
                                <button onClick={() => openDetailsModal(index)} className="flex justify-end items-end underline hover:font-bold">
                                    แก้ไข
                                </button>
                            </div>
                        ))}
                    </div>

                </div>

                {detailsModalOpen && (
                    <DetailsModal
                        isOpen={detailsModalOpen}
                        imageUrl={currentToothDetails.imageUrl} // Pass the imageUrl to the modal
                        data={currentToothDetails}
                        toothCariesType={toothCariesType}
                        setCariesToothType={setCariesToothType}
                        toothCType={toothCType}
                        setToothCType={setToothCType}
                        onSave={() => saveToothDetails(currentToothDetails.details)}
                        onCancel={() => handleOnCancel()}
                        onDetailsChange={(details) => setCurrentToothDetails({ ...currentToothDetails, details })}
                    />
                )}
            </div>
        </div>

    );
};

export default ImageTable;
