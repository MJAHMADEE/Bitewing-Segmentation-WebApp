import React, { useState } from "react";
import Transition from "@/components/Transitions";
import router from "next/router";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault(); // ป้องกันการเรียกใช้งานเหตุการณ์ default ของฟอร์ม

        // ตั้งค่าข้อมูลสำหรับส่งไปยังเซิร์ฟเวอร์
        const loginInfo = {
            username,
            password,
        };

        // ทำการร้องขอเข้าสู่ระบบ
        try {
            const response = await fetch('http://localhost:5000/v1/auth/login', { // เปลี่ยนเป็น URL ของเซิร์ฟเวอร์ที่ถูกต้อง
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginInfo),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                // จัดการกับค่า response เมื่อเข้าสู่ระบบสำเร็จ
                console.log('Login successful', data);
                // Redirect to the main page
                router.push('/main'); // เปลี่ยนเส้นทางไปยังหน้า main
            } else {
                // จัดการกับ error ต่างๆ
                console.error('Login failed', data);
                alert(data.message || 'Failed to login');
            }
        } catch (error) {
            // จัดการกับ error ในการส่งข้อมูลหรือรับข้อมูล
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="w-full h-screen">
            <Transition />
            <div className="bg-gradient-background h-full flex items-center justify-center">
                <div className="w-[500px] h-[600px] rounded-lg border-white">
                    <div className="flex justify-center items-center h-[100px]">
                        <h1 className="text-4xl font-bold text-white">Login</h1>
                    </div>
                    <form
                        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground border-white border p-14 rounded-xl"
                        onSubmit={handleSubmit}
                    >
                        <label className="text-md text-white" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="rounded-md px-4 py-2 bg-inherit border mb-6 text-white"
                            name="username"
                            placeholder="Your username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label className="text-md text-white" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="rounded-md px-4 py-2 bg-inherit border mb-6 text-white"
                            type="password"
                            name="password"
                            placeholder="Your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="bg-white text-black rounded-md px-4 py-2 text-foreground mb-2">
                            Login
                        </button>
                        <button
                            type="button"
                            className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
                            onClick={() => router.push('/register')}
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
