'use client'

import { useEffect, useState } from "react";

import { authClient } from "@/lib/client-side-auth-client";

import Aside from "./Aside"
import Header from "./Header"

import { StaticImageData } from "next/image";
import profileIcon from '@/public/profile.png';
import Overlay from "./Overlay";

const Navigation = () => {
    const [openAside, setOpenAside] = useState(false);

    const [profilePic, setProfilePic] = useState<StaticImageData|string>(profileIcon);

    const session = authClient.useSession()  

    useEffect(()=>{

      async function getUserDetails(){
        let userDetails

        if(session && session?.data?.user?.email){ 
          const email = session?.data?.user?.email
          const response = await fetch('/api/userdetails', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              email
            })
          })

          if(response.ok){
            userDetails = await response.json()
          }
        }

        return userDetails
      }

      if(session){
        getUserDetails().then((userDetails)=>{
          if(userDetails?.profilePic){
            setProfilePic(userDetails.profilePic)
          }
        })
      }
      
    }, [session])

  return (
    <>
        <Header profilePic={profilePic} setOpenAside={setOpenAside} />

        <Aside profilePic={profilePic} openAside={openAside} user={session?.data?.user} />
        <Overlay statefulVar={openAside} func={setOpenAside} />
    </>
  )
}

export default Navigation