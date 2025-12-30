import Image, { StaticImageData } from "next/image"
import { Dispatch, SetStateAction } from "react"

const ImgViewer = ({ imgSrc, viewImg, setViewImg } : 
  {
    imgSrc: StaticImageData|string, 
    viewImg: boolean, 
    setViewImg: Dispatch<SetStateAction<boolean>> 
  }) => {
  return (
    <div className={`fixed z-30 inset-0 bg-gray-900 text-white flex flex-row justify-center
                    ${viewImg? '' : 'opacity-0 pointer-events-none'} duration-200 ease-out`}>
        <div className='h-screen'>
            <div className='p-4 text-3xl mb-15 text-bold cursor-pointer'
                onClick={()=>setViewImg(false)}
                title='Close?'
            >
                X
            </div>

            <Image
            src={imgSrc}
            width={500}
            height={500}
            alt=''
            className='w-full h-6/10 max-w-[700px] object-contain rounded-lg shadow-lg' 
            />
        </div>
    </div>
  )
}

export default ImgViewer