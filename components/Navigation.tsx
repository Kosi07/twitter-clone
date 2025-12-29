'use client'

import { useState } from "react";

import { authClient } from "@/lib/client-side-auth-client";

import Aside from "./Aside"
import Header from "./Header"

import { StaticImageData } from "next/image";
import profileIcon from '@/public/profile.png';
import Overlay from "./Overlay";

const Navigation = () => {
    const [openAside, setOpenAside] = useState(false);

    const [profilePic] = useState<StaticImageData|string>(profileIcon);

    const session = authClient.useSession()
    const user = session?.data?.user

  return (
    <>
        <Header profilePic={profilePic} setOpenAside={setOpenAside} user={user} />

        <Aside profilePic={profilePic} openAside={openAside} user={user} />
        <Overlay statefulVar={openAside} func={setOpenAside} />
    </>
  )
}

export default Navigation