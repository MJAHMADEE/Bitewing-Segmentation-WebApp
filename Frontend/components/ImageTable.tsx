import React, { useState, useEffect } from "react";
import Image from "next/image";
import DetailsModal from "./DetailsModal"; // Import the DetailsModal component

interface ImageTableProps {
    images: string[];

}

interface ToothDetails {
    index: number | null;
    imageUrl?: string; // Include an imageUrl property
    details: string;
}

const ImageTable: React.FC<ImageTableProps> = ({ images }) => {
    const [selectedImages, setSelectedImages] = useState<boolean[]>(Array(images.length).fill(false));
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [currentToothDetails, setCurrentToothDetails] = useState<ToothDetails>({ index: null, details: "", imageUrl: undefined });

    useEffect(() => {
        setSelectedImages(Array(images.length).fill(false));
    }, [images]);

    const onImageSelect = (index: number, checked: boolean) => {
        const newSelectedImages = [...selectedImages];
        newSelectedImages[index] = checked;
        setSelectedImages(newSelectedImages);
    };

    const openDetailsModal = (index: number) => {
        setCurrentToothDetails({ index, details: "", imageUrl: images[index] }); // Set the imageUrl here
        setDetailsModalOpen(true);
    };

    const saveToothDetails = (details: string) => {
        setCurrentToothDetails({ ...currentToothDetails, details });
        setDetailsModalOpen(false);
    };

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
                                <Image
                                    src={img}
                                    alt="Tooth Preview"
                                    width={100}
                                    height={100}
                                    className="max-w-xs rounded-md"
                                />
                                <div className="w-full ml-2">
                                    <h1>Class 31</h1>
                                    <p>confidence: 0.99</p>
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
                        details={currentToothDetails.details}
                        onSave={() => saveToothDetails(currentToothDetails.details)}
                        onCancel={() => setDetailsModalOpen(false)}
                        onDetailsChange={(details) => setCurrentToothDetails({ ...currentToothDetails, details })}
                    />
                )}
            </div>
        </div>

    );
};

export default ImageTable;
