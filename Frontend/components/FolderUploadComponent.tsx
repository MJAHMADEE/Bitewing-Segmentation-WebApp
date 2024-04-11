import React from 'react';

interface FolderUploadProps {
    setPreviewUrls: React.Dispatch<React.SetStateAction<Array<{ file: File, url: string }>>>;
}

const FolderUploadComponent: React.FC<FolderUploadProps> = ({ setPreviewUrls }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        const imageFiles = files.map(file => {
            // For non-TIFF images, generate a preview URL
            if (file.type !== "image/tiff") {
                const url = URL.createObjectURL(file);
                return { file, url, isTiff: false };
            } else {
                // TIFF files need to be handled differently as most browsers can't preview them
                return { file, url: '', isTiff: true };
            }
        });

        setPreviewUrls(imageFiles); // Update state with the new images and their URLs
    };

    return (
        <input
            type="file"
            onChange={handleFileChange}
            className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            accept="image/png, image/jpeg, image/tiff, application/pdf"
            multiple
        />
    );
};

export default FolderUploadComponent;
