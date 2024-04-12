import { useState } from "react";
import Modal from "@/components/Modal";
import Transition from "@/components/Transitions";
import router from "next/router";

export default function Register() {
    const [openComplete, setOpenComplete] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [successModal, setSuccessModal] = useState(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const userData = {
            username,
            password,
            first_name: firstName,
            last_name: lastName,
        };

        try {
            const response = await fetch('http://localhost:5000/v1/auth/register', {
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

    // Function to toggle password visibility
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    return (
        <div className="w-full h-screen">
            {/* Modals */}
            <Modal
                isOpen={openComplete}
                setIsOpen={setOpenComplete}
                title="Log In"
                message="Registration successful! Please log in."
                onUnderstood={() => router.push('/login')}
                status={"success"}
            />
            <Modal
                isOpen={successModal}
                setIsOpen={setSuccessModal}
                title="Register"
                message="Registration successful! Please log in."
                onUnderstood={() => router.push('/login')}
                status={"success"}
            />

            <Transition />
            <div className="bg-gradient-background h-full flex items-center justify-center">
                <div className="w-[500px] h-[600px] rounded-lg">
                    <div className="flex justify-center items-center h-[100px] ">
                        <h1 className="text-4xl text-white font-thin">REGISTER</h1>
                    </div>
                    <form
                        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
                        onSubmit={handleSubmit}
                    >
                        {/* Username and Password Fields */}
                        <label className="text-lg font-thin text-white" htmlFor="email">Username</label>
                        <input
                            className="rounded-md px-4 py-2 bg-inherit border mb-4 text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=""
                            required
                        />
                        <div className="space-y-1 relative mb-4">
                            <label htmlFor="password" className="block text-lg font-thin text-white">Password</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 translate-y-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        <div className="space-y-1 relative mb-4">
                            <label htmlFor="confirmPassword" className="block text-lg font-thin text-white">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 translate-y-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {/* Personal Information */}
                        <label className="text-lg font-thin text-white" htmlFor="first_name">Firstname</label>
                        <input
                            className="rounded-md px-4 py-2 bg-inherit border mb-4 text-white"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder=""
                            required
                        />
                        <label className="text-lg font-thin text-white" htmlFor="last_name">Lastname</label>
                        <input
                            className="rounded-md px-4 py-2 bg-inherit border mb-4 text-white"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder=""
                            required
                        />
                        <button onClick={() => setSuccessModal(true)} type="submit" className="bg-white text-lg font-thin text-black rounded-md px-4 py-2 text-foreground mb-2">
                            Register
                        </button>
                        <button onClick={() => router.push('../login')}
                            type="button"
                            className="border border-foreground/20 rounded-md px-4 py-2 mb-2 text-lg font-thin text-white"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
