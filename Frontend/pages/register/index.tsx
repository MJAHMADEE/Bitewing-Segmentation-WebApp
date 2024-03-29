import Modal from "@/components/Modal";
import Transition from "@/components/Transitions";
import router from "next/router";
import React, { useState } from "react";

export default function Register() {
    const [openComplete, setOpenComplete] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const userData = {
            username,
            password,
            first_name: firstName,
            last_name: lastName,
        };

        try {
            const response = await fetch('http://localhost:5005/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            setOpenComplete(true);
        } catch (error) {
            console.error("Registration failed: ", error);
            alert("Registration failed.");
        }
    };

    return (
        <div className="w-full h-screen">

            {/* Modal */}
            <Modal
                isOpen={openComplete}
                setIsOpen={setOpenComplete}
                title="Log In"
                message="Registration successful! Please log in."
                onUnderstood={() => router.push('/login')}
                status={"success"}
            />

            <Transition />
            <div className="bg-gradient-background h-full flex items-center justify-center">
                <div className="w-[500px] h-[600px] rounded-lg">
                    <div className="flex justify-center items-center h-[100px]">
                        <h1 className="text-4xl font-bold">Register</h1>
                    </div>
                    <form
                        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
                        onSubmit={handleSubmit}
                    >
                        <label className="text-md" htmlFor="email">Username</label>
                        <input
                            className="rounded-md px-4 py-2 bg-inherit border mb-6"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=""
                            required
                        />
                        <label className="text-md" htmlFor="password">Password</label>
                        <input
                            className="rounded-md px-4 py-2 bg-inherit border mb-6"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=""
                            required
                        />
                        {/* <label className="text-md" htmlFor="confirmPassword">Confirm Password</label> */}
                        {/* <input
                            className="rounded-md px-4 py-2 bg-inherit border mb-6"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder=""
                            required
                        /> */}
                        <label className="text-md" htmlFor="first_name">First Name</label>
                        <input
                            className="rounded-md px-4 py-2 bg-inherit border mb-6"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder=""
                            required
                        />
                        <label className="text-md" htmlFor="last_name">Last Name</label>
                        <input
                            className="rounded-md px-4 py-2 bg-inherit border mb-6"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder=""
                            required
                        />
                        <button type="submit" className="bg-white text-black rounded-md px-4 py-2 text-foreground mb-2">
                            Register
                        </button>
                        <button onClick={() => router.push('../login')}
                            type="button"
                            className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
