'use client';
import { Dispatch, SetStateAction } from "react"

const Overlay = ({ statefulVar, func} : {statefulVar: boolean, func: Dispatch<SetStateAction<boolean>>}) => {
  return (
    <div className={`fixed inset-0 z-30 bg-gray-400/60 backdrop-blur-[2px] 
                ${statefulVar? '':'hidden'}`}
            onClick={()=>func(false)}
    >
   </div>
  )
}

export default Overlay;