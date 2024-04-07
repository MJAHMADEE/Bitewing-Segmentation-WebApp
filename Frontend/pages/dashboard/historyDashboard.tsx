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
    name: string;
    email: string;
    gender: string;
    phonenumber: string;
}

export default function HistoryDashboard() {

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedPatientIndex, setEditedPatientIndex] = useState<number>(-1);
    const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails>({
        name: '',
        email: '',
        gender: '',
        phonenumber: '',
    });

    const [isEditPredictOpen, setEditPredictOpen] = useState(false);


    const handleModalPredictClick = (index: number, userDetails: any) => {
        setEditPredictOpen(true);
    };

    const handleEditClick = (index: number, userDetails: any) => {
        setCurrentUserDetails(userDetails); // Set current user details to edit
        // Open the modal
        setEditedPatientIndex(index); // Set the index of the edited patient
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (newDetails: UserDetails) => {
        console.log("Updated Details:", newDetails); // Log the new details
        // Implement state update logic
        const updatedRows = [...TABLE_ROWS]; // Create a copy of the TABLE_ROWS array
        updatedRows[editedPatientIndex] = { ...updatedRows[editedPatientIndex], ...newDetails }; // Update the patient's details
        setTABLE_ROWS(updatedRows); // Update the state with the updated data
        setIsEditModalOpen(false); // Close the modal after saving
    };


    const TABLE_HEAD = ["Patient ID", "Gender", "Age", "Birth Date", "Predict Image", "Edit"];

    const [TABLE_ROWS, setTABLE_ROWS] = useState<Array<any>>([
        {
            img: "https://scontent.fbkk5-4.fna.fbcdn.net/v/t1.6435-9/86263526_2565482020399840_7973518111129206784_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=be3454&_nc_eui2=AeGteQNRBY3cll7biRo3CVIUwibETxdg7HHCJsRPF2DscSeSXHvDnbQihINj0OpCu4I4Ix4DnCLZhnIUMyGjVcJS&_nc_ohc=1GrZLN6aR3QAX_HHZcX&_nc_oc=AQn9YHotEmC3qt623G6lYmhXn1FJmttafoJ81Cs--XDRZqUEwMizZ2_XlbYBogbP_Ss&_nc_ht=scontent.fbkk5-4.fna&oh=00_AfCBy42us10tXn4pYhGN9f4xHKZB9EtwnFQNEbrQ3OTeMA&oe=65E9A183",
            name: "John Michael",
            email: "john@creative-tim.com",
            gender: "Male",
            org: "Organization",
            online: true,
            phonenumber: "0930000000",
        },
        {
            img: "https://scontent.fbkk5-4.fna.fbcdn.net/v/t1.6435-9/86263526_2565482020399840_7973518111129206784_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=be3454&_nc_eui2=AeGteQNRBY3cll7biRo3CVIUwibETxdg7HHCJsRPF2DscSeSXHvDnbQihINj0OpCu4I4Ix4DnCLZhnIUMyGjVcJS&_nc_ohc=1GrZLN6aR3QAX_HHZcX&_nc_oc=AQn9YHotEmC3qt623G6lYmhXn1FJmttafoJ81Cs--XDRZqUEwMizZ2_XlbYBogbP_Ss&_nc_ht=scontent.fbkk5-4.fna&oh=00_AfCBy42us10tXn4pYhGN9f4xHKZB9EtwnFQNEbrQ3OTeMA&oe=65E9A183",
            name: "Alexa Liras",
            email: "alexa@creative-tim.com",
            gender: "Female",
            org: "Developer",
            online: false,
            phonenumber: "0930000000",
        },
        {
            img: "https://scontent.fbkk5-4.fna.fbcdn.net/v/t1.6435-9/86263526_2565482020399840_7973518111129206784_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=be3454&_nc_eui2=AeGteQNRBY3cll7biRo3CVIUwibETxdg7HHCJsRPF2DscSeSXHvDnbQihINj0OpCu4I4Ix4DnCLZhnIUMyGjVcJS&_nc_ohc=1GrZLN6aR3QAX_HHZcX&_nc_oc=AQn9YHotEmC3qt623G6lYmhXn1FJmttafoJ81Cs--XDRZqUEwMizZ2_XlbYBogbP_Ss&_nc_ht=scontent.fbkk5-4.fna&oh=00_AfCBy42us10tXn4pYhGN9f4xHKZB9EtwnFQNEbrQ3OTeMA&oe=65E9A183",
            name: "Laurent Perrier",
            email: "laurent@creative-tim.com",
            gender: "Male",
            org: "Projects",
            online: false,
            phonenumber: "0930000000",
        },
        {
            img: "https://scontent.fbkk5-4.fna.fbcdn.net/v/t1.6435-9/86263526_2565482020399840_7973518111129206784_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=be3454&_nc_eui2=AeGteQNRBY3cll7biRo3CVIUwibETxdg7HHCJsRPF2DscSeSXHvDnbQihINj0OpCu4I4Ix4DnCLZhnIUMyGjVcJS&_nc_ohc=1GrZLN6aR3QAX_HHZcX&_nc_oc=AQn9YHotEmC3qt623G6lYmhXn1FJmttafoJ81Cs--XDRZqUEwMizZ2_XlbYBogbP_Ss&_nc_ht=scontent.fbkk5-4.fna&oh=00_AfCBy42us10tXn4pYhGN9f4xHKZB9EtwnFQNEbrQ3OTeMA&oe=65E9A183",
            name: "Michael Levi",
            email: "michael@creative-tim.com",
            gender: "Male",
            org: "Developer",
            online: true,
            phonenumber: "0930000000",
        },
        {
            img: "https://scontent.fbkk5-4.fna.fbcdn.net/v/t1.6435-9/86263526_2565482020399840_7973518111129206784_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=be3454&_nc_eui2=AeGteQNRBY3cll7biRo3CVIUwibETxdg7HHCJsRPF2DscSeSXHvDnbQihINj0OpCu4I4Ix4DnCLZhnIUMyGjVcJS&_nc_ohc=1GrZLN6aR3QAX_HHZcX&_nc_oc=AQn9YHotEmC3qt623G6lYmhXn1FJmttafoJ81Cs--XDRZqUEwMizZ2_XlbYBogbP_Ss&_nc_ht=scontent.fbkk5-4.fna&oh=00_AfCBy42us10tXn4pYhGN9f4xHKZB9EtwnFQNEbrQ3OTeMA&oe=65E9A183",
            name: "Richard Gran",
            email: "richard@creative-tim.com",
            gender: "Female",
            org: "Executive",
            online: false,
            phonenumber: "0930000000",
        },
    ]);

    const [patientId, setPatientId] = useState('');

    const getLastPatient = async () => {
        let token = localStorage.getItem('token');
        try {
            const res = await fetch("http://localhost:5000/v1/segmentation/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const resData = await res.json();
            if (resData.message === 'Success' && resData.data.length > 0) {
                const lastPatientId = resData.data[resData.data.length - 1].patient.patient_id;
                setPatientId(lastPatientId.toString()); // แปลงเป็น string หากจำเป็น
                console.log(resData);
            } else {
                // กรณีไม่มีข้อมูลหรือไม่สำเร็จ
                console.log('No data or request was unsuccessful');
            }
        } catch (error) {
            console.error(error);
        }

    }


    useEffect(() => {
        getLastPatient()
    }, [])

    useEffect(() => {
        if (TABLE_ROWS.length > 0) {
            setCurrentUserDetails({
                name: TABLE_ROWS[0].name,
                email: TABLE_ROWS[0].email,
                gender: TABLE_ROWS[0].gender,
                phonenumber: TABLE_ROWS[0].phonenumber,
            });
        }
    }, [TABLE_ROWS]);

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
            {/* <Transition /> */}

            <div
                className="bg-gradient-background h-full flex items-center justify-between ">

                <SideBar />

                <EditModal
                    isOpen={isEditModalOpen}
                    setIsOpen={setIsEditModalOpen}
                    initialUserDetails={currentUserDetails} // Pass initial user details to the modal
                    onSave={handleSaveEdit} // Pass onSave function to the modal
                />

                <EditPredict
                    isOpen={isEditPredictOpen}
                    setIsOpen={setEditPredictOpen}
                    initialUserDetails={currentUserDetails} // Pass initial user details to the modal
                    onSave={handleSaveEdit} // Pass onSave function to the modal  
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
                                    ({ img, name, email, gender, org, online, phonenumber }, index) => {
                                        const isLast = index === TABLE_ROWS.length - 1;
                                        const classes = isLast
                                            ? "p-4"
                                            : "p-4 border-b border-purple-200";

                                        return (
                                            <tr key={name}>
                                                <td className={classes}>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar src={img} alt={name} size="sm" className="w-10 h-10"
                                                        />
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {name}
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
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal opacity-70"
                                                        >
                                                            {org}
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="w-max">
                                                        31
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {phonenumber}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <button onClick={() => handleModalPredictClick(index, { img, name, email, gender, phonenumber })} className=" w-32 h-7 bg-white rounded-md text-black text-center">
                                                        <h1>Predict Image</h1>
                                                    </button>

                                                </td>
                                                <td className={classes}>
                                                    <Tooltip content="Edit User">
                                                        <IconButton variant="text" onClick={() => handleEditClick(index, { img, name, email, gender, phonenumber })}>
                                                            <PencilIcon className="h-4 w-4  text-white" />
                                                        </IconButton>

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
                            Page 1 of 10
                        </Typography>
                        <div className="flex gap-2 text-white">
                            <Button variant="outlined" size="sm" className="text-white">
                                Previous
                            </Button>
                            <Button variant="outlined" size="sm" className="text-white">
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

