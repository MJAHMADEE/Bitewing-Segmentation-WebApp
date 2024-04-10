import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeIn } from '@/variants';
import Transition from '@/components/Transitions';
import NavbarMobile from '@/components/NavbarMobile';
import NavbarDesktop from '@/components/NavbarDesktop';
import { useEffect, useState } from 'react';

// import HoverCard from "@/components/HoverCard";
// import Modal from "@/components/Modal";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่า token มีอยู่ใน localStorage หรือไม่เมื่อแอปพลิเคชันเริ่มทำงาน
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // ลบ token ออกจาก localStorage และอัปเดต state
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  return (
    // Full screen background
    <div className="h-full min=h=screen">
      <Transition />
      <div className="block md:hidden">
        <NavbarMobile />
        {/* {isLoggedIn && (
          <div className="flex justify-end p-4">
            <button
              className="text-white bg-red-500 hover:bg-red-700 rounded px-4 py-2"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )} */}
      </div>
      <div className="hidden md:block absolute w-full">
        <NavbarDesktop />
        {/* {isLoggedIn && (
          <div className="flex justify-end p-4">
            <button
              className="text-white bg-red-500 hover:bg-red-700 rounded px-4 py-2"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )} */}
      </div>

      <div className="min-h-screen h-full bg-gradient-background">
        <div className='pt-24'>
          <div className="lg:grid lg:grid-cols-2">
            <div className=" ml-20 lg:mr-0 mr-20 flex flex-col">
              <motion.h1
                variants={fadeIn('right', 0.5)}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="text-5xl font-thin leading-normal text-white "
              >
                Segmentation bitewing radiograph using <span className=' font-normal text-red-600'> YOLOv8 </span>
              </motion.h1>
              {/* and numbering bitewing radiograph */}
              <motion.div
                variants={fadeIn('right', 0.5)}
                initial="hidden"
                animate="show"
                exit="hidden"
                className=""
              >
                <div className="text-xl font-thin leading-normal text-white">
                  Discover our innovative solution for automating dental bitewing radiograph analysis using YOLOv8 technology.
                  Our project focuses on effortlessly segmenting and numbering teeth in radiographs,
                  streamlining dental diagnostics and enhancing accuracy. With our user-friendly interface and state-of-the-art deep learning model,
                  dental professionals can save time and reduce human error in tooth identification.
                  Explore our deployable solution today to revolutionize dental radiograph analysis!
                </div>

                <div className=" translate-x-5 mt-5 flex flex-col justify-center items-center space-y-5 sm:space-y-0 sm:flex sm:flex-row  space-x-10 ">
                  <Link href="/predict/">
                    <button className=" w-[300px] sm:w-[250px] lg:w-[250px] h-[51px] xl:w-[300px] rounded-full bg-white shadow-sm shadow-white transform motion-safe:hover:scale-110 duration-500">
                      <div className="text-custom text-shadow font-bold leading-normal text-black">
                        START PREDICT
                      </div>
                    </button>
                  </Link>

                  <Link href="/tutorial/tutorial1">
                    <button className=" -translate-x-5 sm:translate-x-0 w-[300px] sm:w-[250px] lg:w-[250px] h-[51px] xl:w-[300px] rounded-full bg-white shadow-sm shadow-white transform motion-safe:hover:scale-110 duration-500">
                      <div className="text-custom text-shadow font-bold leading-normal text-black">
                        TUTORIAL
                      </div>
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={fadeIn('left', 0.5)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="flex items-center justify-center">
              <Image
                className=" hidden items-center justify-center rounded-2xl lg:flex "
                src="/image/dentistDoJob.png"
                alt="Picture of the author"
                width={500}
                height={500}
              />
            </motion.div>
          </div>
          <div className="grid-cols-10 flex justify-center ">
            <motion.div
              variants={fadeIn('up', 0.5)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className=" xl:flex-rows col-span-9  mr-20  justify-center space-x-28 md:grid md:grid-cols-2 xl:flex mb-14 mt-14"
            >
              {/* box1 */}
              <div className="ml-28 h-[320px] w-[350px] rounded-3xl bg-white bg-opacity-70 shadow-lg shadow-white transform motion-safe:hover:scale-110 duration-500 mb-10 xl:ml-64 ">
                <h1 className="mt-5 text-center text-2xl text-black opacity-100">
                  Privacy-Centric
                </h1>
                <p className="text-shadow m-5 text-base font-light leading-normal text-black">
                  Your privacy is paramount. All uploads are handled with the
                  highest level of security and confidentiality.
                </p>
                <div className="flex items-center justify-center">
                  <Image
                    className=" items-center justify-center rounded-2xl"
                    src="/image/cyberImage.png"
                    alt="Picture of the author"
                    width={130}
                    height={130}
                  />
                </div>
              </div>
              {/* box2 */}
              <div className="h-[320px] w-[350px] rounded-3xl bg-white bg-opacity-70 shadow-lg shadow-white transform motion-safe:hover:scale-110 duration-500  lg:mr-0 sm:mr-20 mb-10">
                <h1 className="mt-5 text-center text-2xl text-black">
                  Easy Accessibility
                </h1>
                <p className="text-shadow m-5 text-base font-light leading-normal text-black">
                  Access our services from anywhere, anytime, with just an internet
                  connection.
                </p>
                <div className="flex items-center justify-center">
                  <Image
                    className=" mt-5 items-center justify-center rounded-2xl"
                    src="/image/easyUse.png"
                    alt="Picture of the author"
                    width={90}
                    height={90}
                  />
                </div>
              </div>
              {/* box3 */}
              <div className="h-[320px] w-[350px] rounded-3xl bg-white bg-opacity-70 shadow-lg shadow-white transform motion-safe:hover:scale-110 duration-500 mb-10">
                <h1 className="mt-5 text-center text-2xl text-black">
                  Support for Dental
                </h1>
                <p className="text-shadow mb-7 ml-5 mr-5 mt-5 text-base font-light leading-normal text-black">
                  This website can serve as an adjunct tool for dentists, aiding in
                  their diagnostic processes and ensuring a comprehensive approach
                  to oral health care.
                </p>
                <div className="flex items-center justify-center">
                  <Image
                    className=" -mt-6 items-center justify-center rounded-2xl"
                    src="/image/dentistImage.png"
                    alt="Picture of the author"
                    width={90}
                    height={90}
                  />
                </div>
              </div>

              <div className=" hidden right-24 lg:flex items-end justify-end p-10  xl:-translate-x-20 ">
                <Image
                  className=" "
                  src="/image/tooth.png"
                  alt="Picture of the author"
                  width={150}
                  height={150}
                />
              </div>
            </motion.div>
            {/* <div>
          <HoverCard
            title={"Support for Dental Professionals"}
            message={
              "This website can serve as an adjunct tool for dentists, aiding in their diagnostic processes and ensuring a comprehensive approach to oral health care."
            }
          />
        </div> */}
            {/* <Modal /> */}
          </div>

        </div>

      </div>

    </div>

  );
}
