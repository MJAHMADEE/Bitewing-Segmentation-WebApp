import Transition from "@/components/Transitions";
import NavbarMobile from "@/components/NavbarMobile";
import NavbarDesktop from "@/components/NavbarDesktop";
import UploadFilePatient from "@/components/uploadFilePatient";


export default function Predict() {
    return (
        <div className="h-full">
            <Transition />
            <div className="block md:hidden">
                <NavbarMobile />
            </div>
            <div className="hidden md:block">
                <NavbarDesktop />
            </div>
            <div className="bg-gradient-background h-full flex flex-col  sm:flex-col  items-center justify-center min-h-screen">
                <div className="flex flex-col sm:flex-row space-x-2 mt-5 w-full items-center justify-center">

                    <input
                        className="rounded-md px-5 py-2 bg-inherit border mb-6 "
                        type="name"
                        name=""
                        placeholder="Name"
                        required
                    />

                    <input
                        className="rounded-md px-2 py-2 bg-inherit border mb-6"
                        type="date"
                        name=""
                        placeholder="ชื่อ"
                        required
                    />

                    {/* check box  */}
                    <div className="flex items-center justify-center flex-cols -translate-y-3">
                        {/* <input
                            type="checkbox"
                            className="mr-2"
                        /> */}
                        {/* <p className="">วันนี้</p> */}
                    </div>
                </div >
                <div className="flex w-full items-center justify-center ">
                    <UploadFilePatient />
                </div>

            </div>
        </div>
    );
}