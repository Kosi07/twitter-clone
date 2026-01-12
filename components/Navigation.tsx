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
    const user = session?.data?.user

    const email = user?.email

    

    useEffect(()=>{

      async function getUserDetails(){
        let userDetails

        if(email){ 
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
      
    }, [session, email])

  return (
    <>
        <Header profilePic={profilePic} setOpenAside={setOpenAside} user={user} />

        <Aside profilePic={profilePic} openAside={openAside} user={user} />
        <Overlay statefulVar={openAside} func={setOpenAside} />
    </>
  )
}

export default Navigation