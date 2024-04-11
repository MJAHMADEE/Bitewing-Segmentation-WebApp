import React, { useState, useEffect } from 'react';



const EditPredictModal = ({ isOpen, onClose, onSave, toothData }: { isOpen: boolean, onClose: () => void, onSave: (data: any) => void, toothData: any }) => {

    const [localToothData, setLocalToothData] = useState({
        toothId: '',
        toothName: '',
        toothType: '',
        toothCariesType: '',
        toothNumbering: '',
        toothFiling: '',
        toothPosition: '',
        toothDescription: '',
        toothTreatment: '',
    });

    useEffect(() => {
        if (toothData) {
            setLocalToothData(toothData);
        }
    }, [toothData]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setLocalToothData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSave(localToothData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full text-black" onClick={onClose}>
            <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold ">Edit Tooth Details</h3>
                <form onSubmit={handleSubmit} className='grid grid-cols-2'>
                    <div className="mt-4 mr-4">
                        <label>Tooth ID:</label>
                        <input
                            type="text"
                            name="toothId"
                            value={localToothData.toothId || ''}
                            onChange={handleInputChange}
                            placeholder="Tooth ID"
                            className="w-full mt-1 p-2 border rounded-md"
                            readOnly
                        />
                    </div>
                    <div className="mt-4">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="toothName"
                            value={localToothData.toothName || ''}
                            onChange={handleInputChange}
                            placeholder="Name"
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4 mr-4">
                        <label>Type of Tooth:</label>
                        <input
                            type="text"
                            name="toothType"
                            value={localToothData.toothType || ''}
                            onChange={handleInputChange}
                            placeholder="Type of Tooth"
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4">
                        <label>Type of Caries:</label>
                        <input
                            type="text"
                            name="toothCariesType"
                            value={localToothData.toothCariesType || ''}
                            onChange={handleInputChange}
                            placeholder="Type of Caries"
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4 mr-4">
                        <label>Numbering:</label>
                        <input
                            type="text"
                            name="toothNumbering"
                            value={localToothData.toothNumbering || ''}
                            onChange={handleInputChange}
                            placeholder="Numbering"
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4">
                        <label>Filing:</label>
                        <input
                            type="text"
                            name="toothFiling"
                            value={localToothData.toothFiling || ''}
                            onChange={handleInputChange}
                            placeholder="Filing"
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4 mr-4">
                        <label>Position:</label>
                        <input
                            type="text"
                            name="toothPosition"
                            value={localToothData.toothPosition || ''}
                            onChange={handleInputChange}
                            placeholder="Position"
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4">
                        <label>Description:</label>
                        <input
                            type="text"
                            name="toothDescription"
                            value={localToothData.toothDescription || ''}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4 mr-4">
                        <label>Treatment:</label>
                        <input
                            type="text"
                            name="toothTreatment"
                            value={localToothData.toothTreatment || ''}
                            onChange={handleInputChange}
                            placeholder="Treatment"
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>

                    <div className="flex justify-end mt-4">
                        <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPredictModal;
