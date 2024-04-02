import { useState } from 'react';
import router from 'next/router';
import Transition from "@/components/Transitions";
import NavbarMobile from "@/components/NavbarMobile";
import NavbarDesktop from "@/components/NavbarDesktop";
import { motion } from "framer-motion";
import Image from 'next/image';
import { fadeIn } from "@/variants";
import Modal from "@/components/Modal";
import Link from 'next/link';
import UploadFilePatient from "@/components/uploadFilePatient";


export default function Predict() {
    const [openConfirm, setOpenConfirm] = useState(false)
    const [openPredict, setOpenPredict] = useState(false)

    return (
        <div className="h-full">
            <Modal
                isOpen={openConfirm}
                setIsOpen={setOpenConfirm}
                title="Add patient detail"
                message="Are you sure you want to add patient detail?"
                onUnderstood={() => setOpenPredict(true)}
                status={"info"}
            />

            <Modal
                isOpen={openPredict}
                setIsOpen={setOpenPredict}
                title="Predict now"
                message="Are you want to predict now"
                onUnderstood={() => router.push('/predictDentist/predict')}
                status={"info"}
            />
            <Transition />
            <div className="block md:hidden">
                <NavbarMobile />
            </div>
            <div className="hidden md:block">
                <NavbarDesktop />
            </div>


            <div className="bg-gradient-background min-h-screen h-full flex flex-col  sm:flex-col  items-center justify-center">
                <div className="flex w-full items-center justify-center ">
                    <UploadFilePatient />
                </div>
            </div>
        </div>
    );
}
