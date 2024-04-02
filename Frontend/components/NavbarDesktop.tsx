import React, { useState, useEffect } from "react";
import Link from "next/link";
import router from "next/router";

const NavbarDesktop = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // ตรวจสอบ token ใน localStorage เมื่อ component ถูก mount
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        // ลบ token จาก localStorage และอัปเดตสถานะ
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        // อาจจะเปลี่ยนเส้นทางผู้ใช้กลับไปยังหน้า login หรือหน้าหลัก
        router.push('/login'); // หรือ router.push('/'); ตามที่คุณต้องการ
    };

    return (
        <nav className="bg-navbar-purple p-4 z-20">
            <div className="container mx-auto flex items-center justify-between flex-wrap">
                <div className="text-white flex-1">
                    <Link href="https://sites.google.com/view/sf341smokybite/home">
                        <h1 className="text-lg font-semibold lg:text-xl cursor-pointer">SMOKYBIKE</h1>
                    </Link>
                </div>
                <div>
                    <ul className="flex space-x-2 md:space-x-4">
                        <li>
                            <Link href="../main">
                                <h1 className="text-gray-300 hover:text-white text-sm md:text-base lg:text-lg cursor-pointer">HOME</h1>
                            </Link>
                        </li>
                        <li>
                            <Link href="../tutorial/tutorial1">
                                <h1 className="text-gray-300 hover:text-white text-sm md:text-base lg:text-lg cursor-pointer">TUTORIAL</h1>
                            </Link>
                        </li>
                        <li>
                            <Link href="../predict/">
                                <h1 className="text-gray-300 hover:text-white text-sm md:text-base lg:text-lg cursor-pointer">PREDICT</h1>
                            </Link>
                        </li>
                        {/* Conditionally render Login or Logout button */}
                        {isLoggedIn ? (
                            <div className="flex flex-row space-x-2">
                                <li>
                                    <Link href="../dashboard/">
                                        <h1 className="text-gray-300 hover:text-white text-sm md:text-base lg:text-lg cursor-pointer">DASHBOARD</h1>
                                    </Link>
                                </li>

                                <li>
                                    <h1
                                        className="text-gray-300 hover:text-white text-sm md:text-base lg:text-lg cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        LOGOUT
                                    </h1>
                                </li>
                            </div>
                        ) : (
                            <li>
                                <Link href="/login">
                                    <h1 className="text-gray-300 hover:text-white text-sm md:text-base lg:text-lg cursor-pointer">LOGIN</h1>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarDesktop;
