'use client'

import { useRouter } from "next/navigation"

const BackButton = () => {
    const router = useRouter()
  return (
    <div
        className='w-2/10 text-start font-bold
          hover:cursor-pointer'
        onClick={()=> router.back()}
    >
        {'<'}
    </div>
  )
}

export default BackButton