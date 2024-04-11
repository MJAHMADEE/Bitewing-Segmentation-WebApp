import { SideBar } from "@/components/SideBar";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    CardFooter,
    Avatar,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { motion } from 'framer-motion';
import { fadeIn } from '@/variants';
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import EditModal from '../../components/EditModal';
import EditPredict from "@/components/EditPredict";
import router from "next/router";

interface UserDetails {

    age: string;
    birth_date: string;
    gender: string;
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
        setCurrentUserDetails(userDetails); // ตั้งค่าข้อมูลผู้ใช้ที่จะแก้ไข
        setEditedPatientIndex(index); // ตั้งค่าดัชนีของผู้ใช้ที่จะแก้ไข
        setIsEditModalOpen(true); // แสดง modal
    };

    const handleSaveEdit = async (newDetails: UserDetails) => {
        // Update currentUserDetails state with the new details
        setCurrentUserDetails(newDetails);

        const patientIdc = patientId; // Use the correct way to get the patient ID
        console.log('Patient ID:', patientIdc);

        // Now call your API to update the patient data
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
                // Optionally, you might want to refetch the patient list here
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
        // Assuming you have the patient ID in the editedPatientIndex
        const patientIdc = patientId; // Use the correct way to get the patient ID

        // Now call your API to delete the patient data
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
                // Optionally, you might want to refetch the patient list here
                fetchAllData();
            } else {
                console.error('Failed to delete patient:', data);
            }
        } catch (error) {
            console.error('Failed to send request:', error);
        }

        // Close the modal after deleting
        setIsEditModalOpen(false);
    }



    const TABLE_HEAD = ["Patient ID", "Gender", "Age", "Birth Date", "Predict Image", "Edit"];

    const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // หน้าปัจจุบัน, เริ่มต้นที่ 0
    const [dataPerPage, setDataPerPage] = useState(5);
    const [totalData, setTotalData] = useState(0);
    const [patientId, setPatientId] = useState(0);


    const [allData, setAllData] = useState([]); // เก็บข้อมูลทั้งหมดที่ได้รับจาก API

    const fetchAllData = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/v1/patient/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.message === 'Patients found' && data.data.length > 0) {
                // ใช้เมธอด sort() เพื่อเรียงลำดับข้อมูลตาม patient_id จากใหญ่ไปเล็ก (ล่าสุดมาก่อน)
                const sortedData = data.data.sort((a, b) => b.patient_id - a.patient_id);
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

    const setPageData = (data: any) => {
        const formattedData = data.map(item => ({
            // สมมติว่าคุณไม่มีข้อมูลรูปภาพใน API นี้, หรือถ้ามีก็ต้องใช้ลิงก์ที่ถูกต้อง
            // สมมติให้ img เป็นตัวอย่าง URL ที่คุณอาจจะมีหรือต้องการเพิ่มเข้าไป
            img: `https://example.com/images/${item.patient_id}.jpg`,
            name: `${item.patient_id}`,
            gender: item.gender,
            birthDate: item.birth_date,
            age: item.age,
            phone: item.phone ? item.phone : "N/A", // ถ้าไม่มีข้อมูล phone ก็ให้แสดง "N/A"
        }));
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
    }, []);




    // useEffect(() => {
    //     if (TABLE_ROWS.length > 0) {
    //         setCurrentUserDetails({
    //             name: TABLE_ROWS[0].name,
    //             email: TABLE_ROWS[0].email,
    //             gender: TABLE_ROWS[0].gender,
    //             phonenumber: TABLE_ROWS[0].phonenumber,
    //         });
    //     }
    // }, [TABLE_ROWS]);

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
                    initialUserDetails={currentUserDetails} // ส่งข้อมูลผู้ใช้เริ่มต้นไปยัง modal
                    onSave={handleSaveEdit} // ส่งฟังก์ชันสำหรับอัพเดทข้อมูลผู้ใช้
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
                                    ({ img, name, email, gender, age, birthDate, phonenumber }, index) => {
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
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal opacity-70"
                                                            >
                                                                {email}
                                                            </Typography>
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
                                                        handleModalPredictClick(name);
                                                    }} className=" w-32 h-7 bg-white rounded-md text-black text-center">
                                                        <h1>Predict Image</h1>
                                                    </button>

                                                </td>
                                                <td className={classes}>
                                                    <Tooltip content="Edit User">
                                                        <button onClick={() => {
                                                            handleEditClick(index, { age, birth_date: birthDate, gender })
                                                            setPatientId(name);
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

