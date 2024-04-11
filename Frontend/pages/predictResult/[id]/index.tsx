import React, { useEffect, useState } from 'react';
import Transition from '@/components/Transitions';
import NavbarMobile from '@/components/NavbarMobile';
import NavbarDesktop from '@/components/NavbarDesktop';
import { useRouter } from 'next/router';
import EditPredictModal from '@/components/EditPredictModal ';


interface MainImage {
    id: string;
    imageUrl: string;
}

interface ToothImageData {
    id: string;
    imageUrl: string;
    toothData: {
        toothId: string;
        name: string;
        typeTooth: string;
        typeCaries: string;
        numbering: string;
        filing: string;
        position: string;
        description: string;
        treatment: string;
    };
}


export default function PredictResult() {
    const router = useRouter();
    const { id } = router.query;

    const [selectedMainImage, setSelectedMainImage] = useState('');
    const [selectedThumbDetail, setSelectedThumbDetail] = useState('');
    const [mainImages, setMainImages] = useState<MainImage[]>([]);
    const [thumbnailImages, setThumbnailImages] = useState<ToothImageData[]>([]);
    const [selectedToothId, setSelectedToothId] = useState<string | null>(null);
    const [toothId, setToothId] = useState('');
    const [toothName, setToothName] = useState('');
    const [toothType, setToothType] = useState('');
    const [toothCariesType, setToothCariesType] = useState('');
    const [toothNumbering, setToothNumbering] = useState('');
    const [toothFiling, setToothFiling] = useState('');
    const [toothPosition, setToothPosition] = useState('');
    const [toothDescription, setToothDescription] = useState('');
    const [toothTreatment, setToothTreatment] = useState('');


    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Function to fetch data for a specific tooth
    const fetchToothData = async () => {
        const token = localStorage.getItem('token');
        if (id && token) {
            try {
                const response = await fetch(`http://localhost:5000/v1/segmentation/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();



                // Set the main image from the bitewing data
                setMainImages([{ id: 'main', imageUrl: `http://localhost:8000/images/${data.data.bitewing.image.split('/').pop()}` }]);
                console.log(mainImages);

                const thumbnails = data.data.list_tooth.map((tooth: { image: string; id: any; name: any; type_tooth: any; type_caries: any; numbering: any; filing: any; position: any; description: any; treatment: any; }, index: number) => ({
                    id: `thumb${index + 1}`,
                    relatedTo: 'main',
                    imageUrl: `http://localhost:8000/images/${tooth.image.split('/').pop()}`,
                    toothData: {
                        toothId: tooth.id,
                        name: tooth.name,
                        typeTooth: tooth.type_tooth,
                        typeCaries: tooth.type_caries,
                        numbering: tooth.numbering,
                        filing: tooth.filing,
                        position: tooth.position,
                        description: tooth.description,
                        treatment: tooth.treatment,
                    },
                }));

                setThumbnailImages(thumbnails);

                setThumbnailImages(thumbnails);
                console.log(thumbnails);
                setSelectedThumbDetail('Select a tooth to see more details.');

            } catch (error) {
                console.error("There was an error fetching the tooth data:", error);
            }
        }
    };

    const handleSaveEdit = async (toothData: { toothId: any; toothName: any; toothType: any; toothCariesType: any; toothNumbering: any; toothFiling: any; toothPosition: any; toothDescription: any; toothTreatment: any; }) => {
        console.log("Saving data", toothData);
        const token = localStorage.getItem('token');

        // สร้าง body ข้อมูลที่ต้องการส่ง
        const updatedData = {
            description: "des1", // หรือข้อมูลที่ต้องการจาก state หรือ context
            treatment: "treat", // หรือข้อมูลที่ต้องการจาก state หรือ context
            list_tooth: [
                {
                    tooth_id: toothData.toothId,
                    name: toothData.toothName,
                    type_tooth: toothData.toothType,
                    type_caries: toothData.toothCariesType,
                    numbering: toothData.toothNumbering,
                    filing: toothData.toothFiling,
                    position: toothData.toothPosition,
                    description: toothData.toothDescription,
                    treatment: toothData.toothTreatment
                }
                // เพิ่มเติม object อื่นๆ หากมีการแก้ไขข้อมูลหลายฟันในครั้งเดียว
            ]
        };

        try {
            const response = await fetch(`http://localhost:5000/v1/segmentation/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("Update successful");
            fetchToothData(); // Fetch data again to refresh the UI
        } catch (error) {
            console.error("There was an error updating the data:", error);
        }
    };


    // This function will be called with the selected tooth ID
    const openEditModal = (toothId: string | null) => {
        const toothData = thumbnailImages.find(image => image.toothData.toothId === toothId);
        if (toothData) {
            setToothId(toothData.toothData.toothId);
            setToothName(toothData.toothData.name);
            setToothType(toothData.toothData.typeTooth);
            setToothCariesType(toothData.toothData.typeCaries);
            setToothNumbering(toothData.toothData.numbering);
            setToothFiling(toothData.toothData.filing);
            setToothPosition(toothData.toothData.position);
            setToothDescription(toothData.toothData.description);
            setToothTreatment(toothData.toothData.treatment);
            setIsEditModalOpen(true);
        }
    };


    useEffect(() => {
        fetchToothData();
    }, [id]);

    return (
        <div className="h-full">
            <EditPredictModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEdit}
                toothData={{
                    toothId,
                    toothName,
                    toothType,
                    toothCariesType,
                    toothNumbering,
                    toothFiling,
                    toothPosition,
                    toothDescription,
                    toothTreatment
                }}
            />
            <Transition />
            <div className="block md:hidden"><NavbarMobile /></div>
            <div className="hidden md:block"><NavbarDesktop /></div>
            <div className="bg-gradient-background flex flex-row items-start justify-start min-h-screen p-5">
                <div className="flex flex-col space-y-5 overflow-auto max-h-screen">
                    {mainImages.map(image => (
                        <img
                            key={image.id}
                            src={image.imageUrl}
                            alt="Main Image"
                            className="cursor-pointer rounded-md"
                            onClick={() => setSelectedMainImage(image.id)}
                        />
                    ))}
                </div>
                <div className="flex flex-col ml-5">
                    <div className="flex flex-wrap">
                        {thumbnailImages.map(image => (
                            <img
                                key={image.id}
                                src={image.imageUrl}
                                // src={"http://localhost:8000/images/20240401-122453-15.jpg"}
                                alt="Thumbnail"
                                className="m-1 rounded-md cursor-pointer"
                                onClick={() => {
                                    setToothId(image.toothData.toothId);
                                    setToothName(image.toothData.name || 'N/A');
                                    setToothType(image.toothData.typeTooth || 'N/A');
                                    setToothCariesType(image.toothData.typeCaries || 'N/A');
                                    setToothNumbering(image.toothData.numbering || 'N/A');
                                    setToothFiling(image.toothData.filing || 'N/A');
                                    setToothPosition(image.toothData.position || 'N/A');
                                    setToothDescription(image.toothData.description || 'N/A');
                                    setToothTreatment(image.toothData.treatment || 'N/A');
                                    setSelectedToothId(image.toothData.toothId)
                                    console.log(image.toothData.toothId);
                                }}
                                style={{ width: '100px', height: '100px' }}

                            />
                        ))}
                    </div>
                    <div className="mt-5 bg-white text-black p-4 rounded-md shadow-md">
                        <h3 className="font-bold">Details:</h3>
                        <div>
                            <p>ID: {toothId}</p>
                            <p>Name: {toothName}</p>
                            <p>Type of Tooth: {toothType}</p>
                            <p>Type of Caries: {toothCariesType}</p>
                            <p>Numbering: {toothNumbering}</p>
                            <p>Filing: {toothFiling}</p>
                            <p>Position: {toothPosition}</p>
                            <p>Description: {toothDescription}</p>
                            <p>Treatment: {toothTreatment}</p>
                        </div>
                    </div>
                    <div>
                        <button
                            className="mt-4 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => openEditModal(selectedToothId)}
                        >
                            Update predict result
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
