import React, { useState } from "react";
import Image from "next/image";
import Dropdown from "./Dropdown";

interface DetailsModalProps {
    isOpen: boolean;
    imageUrl?: string; // Optional prop for image URL
    data: object;
    onSave: () => void;
    onCancel: () => void;
    onDetailsChange: (details: string) => void;
    toothCariesType: string;
    setCariesToothType: React.Dispatch<React.SetStateAction<string[] | null>>
    toothCType: string;
    setToothCType: React.Dispatch<React.SetStateAction<string[] | null>>
}

const DetailsModal: React.FC<DetailsModalProps> = ({
    isOpen,
    imageUrl,
    data,
    onSave,
    onCancel,
    onDetailsChange,
    toothCariesType,
    setCariesToothType,
    toothCType,
    setToothCType
}) => {

    if (!isOpen) return null; // Do not render the modal if it is not open

    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 w-[110%] -translate-x-5">
            <div className="modal fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-6 text-black max-w-lg w-11/12 md:w-1/2 ">
                <div className="flex flex-row">
                    {imageUrl && (
                        <div className="mb-4">
                            <Image
                                src={imageUrl}
                                width={200}
                                height={300}
                                alt="Preview"
                                className="max-h-60 rounded-md object-cover"
                            />
                        </div>
                    )}
                    <div className="flex flex-col ml-5 mb-5">
                        <div className="font-bold text-3xl">
                            CLASS {data.numbering}
                        </div>
                        <div>
                            <h1 className="text-md font-bold text-gray-800 mb-4 mt-6 ">Caries type</h1>
                            <Dropdown options={["NONE", "R0", "RA1-2", "RA3", "RB", "RC"]} selectedOption={toothCariesType} onOptionChange={setCariesToothType} />
                        </div>
                        <div>
                            <h1 className="text-md font-bold text-gray-800 mb-4 mt-6 ">Severity Levels of Dental Caries</h1>
                            <Dropdown options={["NONE", "CSound", "CInitial", "CModerate", "CExtensive"]} selectedOption={toothCType} onOptionChange={setToothCType} />
                        </div>
                    </div>
                </div>

                <textarea
                    className="w-full p-3 border border-gray-300 rounded mb-4"
                    value={data.details}
                    onChange={(e) => onDetailsChange(e.target.value)}
                    rows={5}
                    placeholder="Enter details here..."
                />
                <div className="flex justify-end gap-4">
                    <button
                        className="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-150"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-150"
                        onClick={onSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailsModal;

