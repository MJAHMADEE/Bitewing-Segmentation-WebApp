import { useEffect, useState } from 'react';
import { SideBar } from '@/components/SideBar';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { fadeIn } from '@/variants';
import Transition from '@/components/Transitions';
import EditModal from '@/components/EditModal';
import router from 'next/router';
import Modal from '@/components/Modal';
import exp from 'constants';


export default function ProfileSetting() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [hostpital, setHospital] = useState('');
    // const [exp, setExp] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    const [openUpdate, setOpenUpdate] = useState(false);

    // Handle form submission


    // Handle profile image change
    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const updateDentist = async () => {
        const token = localStorage.getItem("token"); // สมมติว่าคุณเก็บ token ไว้ใน localStorage
        // const dentistId = "yourDentistId"; // ต้องเปลี่ยนเป็น ID ของ dentist ที่ต้องการอัปเดต

        const requestBody = {
            first_name: firstname,
            last_name: lastname,
            gender: "male", // หรือใช้ตัวแปรสำหรับเก็บเพศ ถ้ามี
            start_date: "2024-02-15", // สมมติว่าคุณใช้ค่าตายตัว หรือคุณสามารถใช้ตัวแปรได้
            year_ext: 8, // หรือตัวแปรสำหรับเก็บปีที่ขยาย
        };
        // http://localhost:5000/v1/dentist/${dentistId}
        try {
            const response = await fetch(`http://localhost:5000/v1/dentist/`, {
                method: 'PUT', // หรือ PATCH ขึ้นอยู่กับวิธีที่ backend รองรับ
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                // ถ้าอัปเดตสำเร็จ
                console.log('Dentist updated successfully:', data);
                setOpenUpdate(false); // ปิด modal หลังจากอัปเดตสำเร็จ
                // อาจจะมีการเปลี่ยนหน้าหรือแสดงข้อความสำเร็จที่นี่
            } else {
                // แสดงข้อผิดพลาดจากเซิร์ฟเวอร์
                console.error('Failed to update dentist:', data);
            }
        } catch (error) {
            console.error('Failed to send request:', error);
        }
    };

    // ใช้งาน function updateDentist ใน handleSubmit
    const handleSubmit = (e: any) => {
        e.preventDefault();
        updateDentist(); // อัปเดตข้อมูลของ dentist
    };

    const fetchDentistData = async () => {
        const token = localStorage.getItem("token"); // สมมติว่าคุณเก็บ token ไว้ใน localStorage

        // http://localhost:5000/v1/dentist/${dentistId}
        try {
            const response = await fetch(`http://localhost:5000/v1/dentist/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (response.ok) {
                // ถ้าการดึงข้อมูลสำเร็จ
                // console.log('Dentist data fetched successfully:', result.data);
                // อัปเดต state ด้วยข้อมูลที่ได้
                setFirstname(result.data.first_name);
                setLastname(result.data.last_name);
                // setEmail(result.data.username);
                setHospital(result.data.hospital_name || ''); // หรือการจัดการกับ null ต่างๆ
                // ตั้งค่าอื่นๆตามที่ต้องการ
            } else {
                // แสดงข้อผิดพลาดจากเซิร์ฟเวอร์
                console.error('Failed to fetch dentist data:', result.message);
            }
        } catch (error) {
            console.error('Failed to send request:', error);
        }
    };

    useEffect(() => {
        fetchDentistData();
    }, []); // ดึงข้อมูลเมื่อ component ถูก mount



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
            {/* <Modal
                isOpen={openUpdate}
                setIsOpen={setOpenUpdate}
                title="Log Out"
                message="Are you sure you want to log out?"
                onUnderstood={() => router.push('/dashboard')}
                status={"success"}
            /> */}

            <div className="bg-gradient-background h-full flex items-center justify-between">
                <SideBar />
                <motion.div
                    variants={fadeIn('right', 0.05)}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="w-[500px] h-[460px] bg-blue-900 p-8 rounded-xl">
                    {/* Profile setting page */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center">
                            <label htmlFor="profileImage" className="cursor-pointer">
                                {previewImage ? (
                                    <Image src={previewImage} alt="Profile preview" width={24} height={24} className="w-24 h-24 rounded-full object-cover" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                                        <span className="text-gray-200">Add Image</span>
                                    </div>
                                )}
                            </label>
                            <input id="profileImage" name="profileImage" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>

                        {/* Firstname Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-200">Firstname</label>
                            <input type="text" id="name" name="name" value={firstname} placeholder=" Your firstname" onChange={(e) => setFirstname(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black h-10" />
                        </div>

                        {/* Lastname Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-200">Lastname</label>
                            <input type="text" id="name" name="name" value={lastname} placeholder=" Your lastname" onChange={(e) => setLastname(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black h-10" />
                        </div>

                        {/* Hospital Field */}
                        <div>
                            <label htmlFor="hospital" className="block text-sm font-medium text-gray-200">Hospital</label>
                            <input type="text" id="hospital" name="hospital" value={hostpital} placeholder="Hospital" onChange={(e) => setHospital(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black h-10" />
                        </div>

                        {/* Email Field */}
                        {/* <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200">Username</label>
                            <input type="email" id="email" name="email" value={email} placeholder="Your username" onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black h-10" />
                        </div> */}
                        {/* Password Field */}
                        {/* <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                            <input type="password" id="password" name="password" value={password} placeholder="Your password" onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black h-10" />
                        </div> */}
                        {/* Submit Button */}
                        <div>
                            <button onClick={() => updateDentist()} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-7">
                                Update Profile
                            </button>
                        </div>
                    </form>
                </motion.div>
                <div></div>
            </div>
        </div>
    );
}
