import React, { useEffect, useState } from 'react';
import Transition from '@/components/Transitions';
import NavbarMobile from '@/components/NavbarMobile';
import NavbarDesktop from '@/components/NavbarDesktop';
import { useRouter } from 'next/router';

export default function PredictResult() {
    const router = useRouter();
    const { id } = router.query;

    const [selectedMainImage, setSelectedMainImage] = useState('');
    const [selectedThumbDetail, setSelectedThumbDetail] = useState('');
    const [mainImages, setMainImages] = useState([]);
    const [thumbnailImages, setThumbnailImages] = useState([]);

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
                setMainImages([{ id: 'main', imageUrl: `${process.env.REACT_APP_BASE_URL}${data.data.bitewing.image}` }]);

                // Map each list_tooth item to a thumbnail image
                // Set thumbnail images
                const thumbnails = data.data.list_tooth.map((tooth, index) => ({
                    id: `thumb${index + 1}`,
                    relatedTo: 'main',
                    imageUrl: `${process.env.REACT_APP_BASE_URL}${tooth.image}`,
                    details: `
                        ID: ${tooth.id}
                        Name: ${tooth.name || 'N/A'}
                        Type of Tooth: ${tooth.type_tooth || 'N/A'}
                        Type of Caries: ${tooth.type_caries || 'N/A'}
                        Numbering: ${tooth.numbering || 'N/A'}
                        Filling: ${tooth.filing || 'N/A'}
                        Position: ${tooth.position || 'N/A'}
                        Description: ${tooth.description || 'N/A'}
                        Treatment: ${tooth.treatment || 'N/A'}
                            `.trim()
                }));
                setThumbnailImages(thumbnails);

                setThumbnailImages(thumbnails);
                setSelectedThumbDetail('Select a thumbnail to see more details.');

            } catch (error) {
                console.error("There was an error fetching the tooth data:", error);
            }
        }
    };

    useEffect(() => {
        fetchToothData();
    }, [id]);

    return (
        <div className="h-full">
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
                                alt="Thumbnail"
                                className="m-1 rounded-md cursor-pointer"
                                onClick={() => setSelectedThumbDetail(image.details)}
                                style={{ width: '100px', height: '100px' }}
                            />
                        ))}
                    </div>
                    <div className="mt-5 bg-white text-black p-4 rounded-md shadow-md">
                        <h3 className="font-bold">Details:</h3>
                        <pre>{selectedThumbDetail}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}