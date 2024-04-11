import React, { useEffect, useState } from 'react';

// Adjusted to match the required body structure
interface UserDetails {
    age: number;
    birth_date: string;
    gender: string;
}

interface EditModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    initialUserDetails: UserDetails;
    onSave: (newDetails: UserDetails) => Promise<void>; // Updated to expect a Promise<void>
    onDelete: () => void;
}


const EditModal: React.FC<EditModalProps> = ({ isOpen, setIsOpen, initialUserDetails, onSave, onDelete }) => {
    const [editedUser, setEditedUser] = useState<UserDetails>(initialUserDetails);

    useEffect(() => {
        if (isOpen) {
            setEditedUser(initialUserDetails);
        }
    }, [initialUserDetails, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-2xl">
                <div className="flex flex-col gap-4">
                    {/* Adjust form fields to match the UserDetails interface */}
                    <label className="block mb-2 text-sm font-medium text-gray-900">Age</label>
                    <input
                        type="number"
                        value={editedUser.age}
                        onChange={e => setEditedUser(prev => ({ ...prev, age: parseInt(e.target.value, 10) }))}
                        className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900">Birth Date (DD/MM/YYYY)</label>
                    <input
                        type="text"
                        value={editedUser.birth_date}
                        onChange={e => setEditedUser(prev => ({ ...prev, birth_date: e.target.value }))}
                        className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-900">Gender</label>
                    <select
                        value={editedUser.gender}
                        onChange={e => setEditedUser(prev => ({ ...prev, gender: e.target.value }))}
                        className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-5 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onDelete()}
                        className="px-5 py-2 text-sm font-medium text-white bg-red-600 border border-red-700 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Delete
                    </button>

                    <button
                        onClick={() => {
                            onSave(editedUser);
                        }}
                        className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
