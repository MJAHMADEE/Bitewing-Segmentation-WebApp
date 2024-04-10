import React from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Alert,
} from "@material-tailwind/react";
import {
    UserCircleIcon,
    Cog6ToothIcon,
    PowerIcon,
    HomeIcon,
} from "@heroicons/react/24/solid";
import {
    CubeTransparentIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Modal from "./Modal";
import router from 'next/router';

export function SideBar() {
    // logout popup state
    const [openLogout, setOpenLogout] = React.useState(false);

    return (
        <Card className="h-full w-full bg-violet-800 max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 rounded-l-none border-white">
            <div className="mb-2 p-4">
                <Typography variant="h5" color="blue-gray" className=" text-gray-200 ">
                    Dashboard
                </Typography>
            </div>
            <List className=" space-y-3">
                {/* Home */}
                <Link href="../dashboard">
                    <ListItem className="text-gray-100 bg-blue-900">
                        <ListItemPrefix className=" mr-2">
                            <HomeIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Home
                    </ListItem>
                </Link>
                {/* Profile Setting */}
                <Link href="../dashboard/profileSetting">
                    <ListItem className="text-gray-100 bg-blue-900 ">
                        <ListItemPrefix className=" mr-2">
                            <UserCircleIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Profile Setting
                    </ListItem>
                </Link>

                {/* Pateint History */}
                <Link href="../dashboard/historyDashboard">
                    <ListItem className="text-gray-100 bg-blue-900 ">
                        <ListItemPrefix className=" mr-2">
                            <Cog6ToothIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Pateint History
                    </ListItem>
                </Link>

                <button onClick={() => setOpenLogout(true)}>
                    <ListItem className="text-gray-100 bg-blue-900 ">
                        <ListItemPrefix className=" mr-2">
                            <PowerIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Log Out
                    </ListItem>
                </button>

                <Modal
                    isOpen={openLogout}
                    setIsOpen={setOpenLogout}
                    title="Log Out"
                    message="Are you sure you want to log out?"
                    onUnderstood={() => {
                        localStorage.removeItem("token");
                        router.push('/main')
                    }}
                    status={"success"}
                />

            </List>
        </Card>
    );
}
