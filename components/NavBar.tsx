import Image from 'next/image';
import homeIcon from '@/public/home.png';
import searchIcon from '@/public/search.png';
import notifIcon from '@/public/notification.png';
import DMIcon from '@/public/DMs.png'
import { useState } from 'react';

const NavBar = () => {

    const [focusHome, setFocusHome] = useState(true);
    const [focusSearch, setFocusSearch] = useState(false);
    const [focusNotif, setFocusNotif] = useState(false);
    const [focusDM, setFocusDM] = useState(false);

    const handleTap = () => {
        if(navigator.vibrate){
            navigator.vibrate(300)
            console.log('Haptic')
        }
    };

  return (
    <nav
        className='w-9/10 flex flex-row justify-between items-center'
    >
        <Image 
            alt='home icon'
            className={`w-11 h-11 ${focusHome? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                    hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-120 duration-300`}
            src={homeIcon}
            width={40}
            height={40}
            onClick={()=>{
                handleTap();
                setFocusHome(true);
                setFocusSearch(false);
                setFocusNotif(false);
                setFocusDM(false);
            }}
        />

        <Image 
            alt='search icon'
            className={`w-11 h-11 ${focusSearch? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                    hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-120 duration-300`}
            src={searchIcon}
            width={40}
            height={40}
            onClick={()=>{
                setFocusHome(false);
                setFocusSearch(true);
                setFocusNotif(false);
                setFocusDM(false);
            }}
        />

        <Image 
            alt='notification icon'
            className={`w-11 h-11 ${focusNotif? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                    hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-120 duration-300`}
            src={notifIcon}
            width={40}
            height={40}
            onClick={()=>{
                setFocusHome(false);
                setFocusSearch(false);
                setFocusNotif(true);
                setFocusDM(false);
            }}
        />

        <Image 
            alt='message icon'
            className={`w-11 h-11 ${focusDM? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                    hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-120 duration-300`}
            src={DMIcon}
            width={40}
            height={40}
            onClick={()=>{
                setFocusHome(false);
                setFocusSearch(false);
                setFocusNotif(false);
                setFocusDM(true);
            }}
        />
    </nav>
  )
}

export default NavBar;
