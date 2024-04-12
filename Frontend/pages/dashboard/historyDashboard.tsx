import { SideBar } from "@/components/SideBar";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    Tooltip,
} from "@material-tailwind/react";
import { motion } from 'framer-motion';
import { fadeIn } from '@/variants';
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import EditModal from '../../components/EditModal';
import router from "next/router";

interface UserDetails {

    age: string;
    birth_date: string;
    gender: string;
}

interface Patient {
    patient_id: string;
    email?: string;
    gender: string;
    age: number;
    birth_date: string;
    phone?: string;
}

interface Item {
    id: string;
    bitewing: {
        image?: string;
    };
    patient: Patient;
}

interface TableRow {
    id: string;
    img: string;
    name: string;
    email: string;
    gender: string;
    age: number;
    birthDate: string;
    phonenumber: string;
}


export default function HistoryDashboard() {

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedPatientIndex, setEditedPatientIndex] = useState<number>(-1);
    const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails>({

        age: '',
        birth_date: '',
        gender: '',
    });

    const [isEditPredictOpen, setEditPredictOpen] = useState(false);


    const handleModalPredictClick = async (patientIdc: any) => {
        // เปลี่ยนหน้าไปยัง predictResult พร้อม ID ที่ต้องการ
        router.push(`/predictResult/${patientIdc}`);
    };

    const handleEditClick = (index: number, userDetails: UserDetails) => {
        setCurrentUserDetails(userDetails);
        setEditedPatientIndex(index);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (newDetails: UserDetails) => {
        setCurrentUserDetails(newDetails);
        const patientIdc = patientId;
        // console.log('Patient ID:', patientIdc);

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/v1/patient/${patientIdc}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newDetails),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Patient updated successfully:', data);
                fetchAllData();
            } else {
                console.error('Failed to update patient:', data);
            }
        } catch (error) {
            console.error('Failed to send request:', error);
        }

        // Close the modal after saving
        setIsEditModalOpen(false);
    };;

    // handle delete
    const handleDelete = async () => {

        const patientIdc = patientId;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/v1/patient/${patientIdc}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Patient deleted successfully:', data);
                fetchAllData();
            } else {
                console.error('Failed to delete patient:', data);
            }
        } catch (error) {
            console.error('Failed to send request:', error);
        }

        setIsEditModalOpen(false);
    }



    const TABLE_HEAD = ["Patient ID", "Gender", "Age", "Birth Date", "Predict Image", "Edit"];

    const [TABLE_ROWS, setTABLE_ROWS] = useState<TableRow[]>([]);
    const [currentPage, setCurrentPage] = useState(0); // หน้าปัจจุบัน, เริ่มต้นที่ 0
    const [dataPerPage, setDataPerPage] = useState(5);
    const [totalData, setTotalData] = useState(0);
    const [patientId, setPatientId] = useState(0);


    const [allData, setAllData] = useState([]); // เก็บข้อมูลทั้งหมดที่ได้รับจาก API


    const fetchAllData = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/v1/segmentation/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { message, data } = await response.json();
            if (message === 'Success' && data.length > 0) {
                // ใช้เมธอด sort() เพื่อเรียงลำดับข้อมูลตาม patient_id จากใหญ่ไปเล็ก (ล่าสุดมาก่อน)
                const sortedData = data.sort((a: { patient: { patient_id: number; }; }, b: { patient: { patient_id: number; }; }) => b.patient.patient_id - a.patient.patient_id);
                setAllData(sortedData);
                setTotalData(sortedData.length);
                setPageData(sortedData.slice(0, dataPerPage)); // เริ่มต้นโหลดข้อมูลหน้าแรก
            } else {
                console.log('No data or request was unsuccessful');
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };


    const setPageData = (data: Item[]) => {
        const formattedData = data.map((item) => {
            return {
                id: item.id,
                img: item.bitewing.image ? `http://localhost:8000/images/${item.bitewing.image.split('/').pop()}` : "path/to/default/image",
                name: `${item.patient.patient_id}`,
                email: item.patient.email ? item.patient.email : "N/A",
                gender: item.patient.gender,
                age: item.patient.age,
                birthDate: item.patient.birth_date,
                phonenumber: item.patient.phone ? item.patient.phone : "N/A",
            };
        });
        setTABLE_ROWS(formattedData);
    };



    const handlePreviousPage = () => {
        // Set TABLE_ROWS เป็น array ว่างก่อนเพื่อ clear ข้อมูลเดิม
        setTABLE_ROWS([]);
        const newPage = Math.max(0, currentPage - 1);
        setCurrentPage(newPage);
        const offset = newPage * dataPerPage;
        // รอให้ React update หน้า UI ก่อนเพิ่มข้อมูลใหม่
        setTimeout(() => setPageData(allData.slice(offset, offset + dataPerPage)), 0);
    };

    const handleNextPage = () => {
        // Set TABLE_ROWS เป็น array ว่างก่อนเพื่อ clear ข้อมูลเดิม
        setTABLE_ROWS([]);
        const newPage = Math.min(Math.ceil(totalData / dataPerPage) - 1, currentPage + 1);
        setCurrentPage(newPage);
        const offset = newPage * dataPerPage;
        // รอให้ React update หน้า UI ก่อนเพิ่มข้อมูลใหม่
        setTimeout(() => setPageData(allData.slice(offset, offset + dataPerPage)), 0);
    };


    // useEffect(() => {
    //     getLastPatient()
    // }, [])

    useEffect(() => {
        fetchAllData();
        console.log(TABLE_ROWS);
    }, []);


    useEffect(() => {
        // ตรวจสอบ token ใน localStorage
        const token = localStorage.getItem("token");

        // หากไม่พบ token, เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบหรือหน้า "Page Not Found"
        if (!token) {
            // router.push('/login'); // สำหรับเปลี่ยนเส้นทางไปหน้าเข้าสู่ระบบ
            router.replace('/404'); // หรือใช้ router.replace('/404') สำหรับหน้า "Page Not Found"
        }
    }, []);


    return (
        <div className="w-full h-screen">
            <div
                className="bg-gradient-background h-full flex items-center justify-between ">

                <SideBar />

                <EditModal
                    isOpen={isEditModalOpen}
                    setIsOpen={setIsEditModalOpen}
                    initialUserDetails={{ ...currentUserDetails, age: Number(currentUserDetails.age) }}
                    // @ts-ignore
                    onSave={handleSaveEdit}
                    onDelete={handleDelete}
                />


                <motion.div
                    variants={fadeIn('right', 0.05)}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="h-full/8 w-full m-10 bg-blue-900 text-white p-3 rounded-xl">
                    <div className=" flex place-content-between">
                        <div className=" items-end">
                            <h1 className=" text-3xl mt-5 ml-5">Predict History</h1>
                        </div>
                        <div>
                            <Link href="../predictDentist">
                                <button className="bg-white text-black rounded-md p-2 mt-5 ml-5">Predict</button>
                            </Link>
                        </div>
                    </div>

                    <CardHeader floated={false} shadow={false} className="rounded-none">

                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row bg-blue-900">

                        </div>
                    </CardHeader>
                    <CardBody className="overflow-scroll px-0">
                        <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th
                                            key={head}
                                            className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {TABLE_ROWS.map(
                                    ({ id, img, name, email, gender, age, birthDate, phonenumber }, index) => {
                                        const isLast = index === 5;
                                        const classes = isLast
                                            ? "p-4"
                                            : "p-4 border-b border-purple-200";

                                        return (
                                            <tr key={name}>
                                                <td className={classes}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                Patient ID : {name}
                                                            </Typography>
                                                            {/* <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal opacity-70"
                                                            >
                                                                {email}
                                                            </Typography> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex flex-col">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {gender}
                                                        </Typography>

                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="w-max">
                                                        {age}
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {birthDate}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <button onClick={() => {
                                                        handleModalPredictClick(id);
                                                    }} className=" w-32 h-7 bg-white rounded-md text-black text-center">
                                                        <h1>Predict Image</h1>
                                                    </button>

                                                </td>
                                                <td className={classes}>
                                                    <Tooltip content="Edit User">
                                                        <button onClick={() => {
                                                            handleEditClick(index, { age: age.toString(), birth_date: birthDate, gender })
                                                            setPatientId(Number(id));
                                                        }
                                                        }>
                                                            <PencilIcon className="h-4 w-4 text-white" />
                                                        </button>

                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                    <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                            Page {currentPage + 1} of {Math.ceil(totalData / dataPerPage)}
                        </Typography>

                        <div className="flex gap-2 text-white">
                            <Button variant="outlined" size="sm" className="text-white" onClick={handlePreviousPage}>
                                Previous
                            </Button>
                            <Button variant="outlined" size="sm" className="text-white" onClick={handleNextPage}>
                                Next
                            </Button>
                        </div>
                    </CardFooter>
                </motion.div>
            </div>
            <div></div>
        </div>
    );
}
function setEditedPatientIndex(index: number) {
    throw new Error("Function not implemented.");
}

