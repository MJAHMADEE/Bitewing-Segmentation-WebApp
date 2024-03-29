import React, { useState } from 'react';
import Transition from '@/components/Transitions';
import router from 'next/router';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault(); // Prevents the default form submission event

        // Setup data for sending to the server
        const userInfo = {
            email,
        };

        // Attempt to request password reset
        try {
            const response = await fetch('http://localhost:5000/v1/auth/forgot-password', { // Replace with the correct server URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Password reset request successful', data);
                alert('Please check your email for password reset instructions.');
                router.push('/login');
            } else {
                console.error('Password reset request failed', data);
                alert(data.message || 'Failed to request password reset');
            }
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="w-full h-screen">
            <Transition />
            <div className="bg-gradient-background h-full flex items-center justify-center">
                <div className="w-[500px] h-[400px] rounded-lg border-white">
                    <div className="flex justify-center items-center h-[100px]">
                        <h1 className="text-4xl font-bold">Forget Password</h1>
                    </div>
                    <form
                        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground border-white border p-14 rounded-xl"
                        onSubmit={handleSubmit}
                    >
                        <label className="text-md" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="rounded-md px-4 py-2 bg-inherit border mb-6"
                            name="email"
                            placeholder="Your email address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" className="bg-white text-black rounded-md px-4 py-2 text-foreground mb-2">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
