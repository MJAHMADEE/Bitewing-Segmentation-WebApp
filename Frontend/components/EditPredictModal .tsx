import React, { useState } from 'react';

const EditPredictModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [listTooth, setListTooth] = useState(initialData.list_tooth || []);

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedListTooth = listTooth.map((item, i) =>
            i === index ? { ...item, [name]: value } : item
        );
        setListTooth(updatedListTooth);
    };

    const handleSubmit = () => {
        onSave({ list_tooth: listTooth });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-semibold">Edit Tooth Details</h3>
                {listTooth.map((tooth, index) => (
                    <div key={index} className="mt-4">
                        <h4 className="font-semibold">Tooth ID: {tooth.tooth_id}</h4>
                        <div className="space-y-2">
                            <input
                                type="text"
                                name="name"
                                value={tooth.name || ''}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Name"
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                name="type_tooth"
                                value={tooth.type_tooth || ''}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Type of Tooth"
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                name="type_caries"
                                value={tooth.type_caries || ''}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Type of Caries"
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                name="filing"
                                value={tooth.filing || ''}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Filing"
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                name="description"
                                value={tooth.description || ''}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Description"
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                name="treatment"
                                value={tooth.treatment || ''}
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Treatment"
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                        </div>
                    </div>
                ))}

                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">Cancel</button>
                    <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditPredictModal;
