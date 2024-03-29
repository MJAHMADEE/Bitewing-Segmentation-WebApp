import React from 'react';
import { SideBar } from "@/components/SideBar";
import Transition from "@/components/Transitions";
import ReactECharts from 'echarts-for-react';
import Image from 'next/image';

interface SettingCardProps {
    title: string;
    description: string;
}

// Line Chart Component
// const LineChart = () => {
//     const option = {
//         title: {
//             text: 'Predict Rate',
//             textStyle: {
//                 color: '#fff', // Set title text color to white
//             }
//         },
//         xAxis: {
//             type: 'category',
//             data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//         },
//         yAxis: {
//             type: 'value',
//         },
//         series: [
//             {
//                 data: [820, 932, 901, 934, 1290, 1330, 1320],
//                 type: 'line',
//             },
//         ],
//     };

//     return <ReactECharts option={option} />;
// };

// Bar Chart Component
const BarChart = () => {
    const option = {
        title: {
            text: 'Radiographic Catagories',
            textStyle: {
                color: '#fff', // Set title text color to white
            }
        },
        xAxis: {
            type: 'category',
            data: ['R0', 'RA1-2', 'RA3', 'RB', 'RC'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: [2, 4, 3, 2, 1],
                type: 'bar',
            },
        ],
    };

    return <ReactECharts option={option} />;
};

const BarChartI = () => {
    const option = {
        title: {
            text: 'ICCMS Catagories',
            textStyle: {
                color: '#fff', // Set title text color to white
            }
        },
        xAxis: {
            type: 'category',
            data: ['CSound', 'CInitial', 'CModerate', 'CExtensive'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: [5, 2, 4, 3],
                type: 'bar',
            },
        ],
    };

    return <ReactECharts option={option} />;
};

// Pie Chart Component
const PieChart = () => {
    const option = {
        title: {
            text: 'Gender',
            left: 'center',
            textStyle: {
                color: '#fff', // Set title text color to white
            }
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: 'Female' },
                    { value: 735, name: 'Male' },
                    // { value: 580, name: 'Email' },
                    // { value: 484, name: 'Union Ads' },
                    // { value: 300, name: 'Video Ads' },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    };

    return <ReactECharts option={option} />;
};

export default function DashboardMain() {
    return (
        <div className="w-full h-screen flex bg-gradient-background items-center ">
            {/* Sidebar */}
            <SideBar />

            {/* Main Content */}
            <div className="flex-grow p-8 overflow-auto ">
                <Transition />

                {/* User Profile Area */}
                <div className='bg-gray-700 rounded-xl shadow-lg text-white p-6 mb-8 '>
                    <div className='flex items-center space-x-4 mb-4'>
                        <div className='w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center text-2xl'>
                            <Image
                                src="/image/1686616127235.jpeg"
                                width={100}
                                height={100}
                                alt="Preview"
                                className="w-20 h-20 rounded-full"

                            />
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold'>John Doe</h2>
                            <p className='text-gray-300'>johndoe@example.com</p>
                        </div>
                    </div>
                    <div>
                        <h3 className='text-xl font-semibold mb-2'>Account Details</h3>
                        <p className='text-gray-300'>Manage your personal information</p>
                    </div>
                </div>

                {/* Additional Settings */}
                {/* <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                    <SettingCard title="Setting 1" description="Adjust your preferences" />
                    <SettingCard title="Setting 2" description="Notification settings" />
                    <SettingCard title="Setting 3" description="Privacy options" />
                </div> */}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-gray-700 rounded-xl shadow-lg p-4 text-white flex flex-col h-full'>
                        <BarChart />
                    </div>
                    <div className='bg-gray-700 rounded-xl shadow-lg p-4 text-white flex flex-col h-full'>
                        <BarChartI />
                    </div>
                    {/* <div className='bg-gray-700 rounded-xl shadow-lg p-4 text-white flex flex-col h-full'>
                        <PieChart />
                    </div> */}
                </div>
            </div>
        </div>
    );
}

// Additional functional component for settings cards
function SettingCard({ title, description }: SettingCardProps) {
    return (
        <div className='bg-gray-700 rounded-xl shadow-lg p-4 text-white flex flex-col'>
            <h4 className='text-lg font-semibold mb-2'>{title}</h4>
            <p className='flex-1 text-gray-300'>{description}</p>
            <button className='mt-4 py-2 px-4 bg-violet-600 hover:bg-violet-500 rounded transition duration-200'>
                Edit
            </button>
        </div>
    );
}

