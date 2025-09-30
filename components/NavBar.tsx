import Image from 'next/image';
import homeIcon from '@/public/home.png';
import searchIcon from '@/public/search.png';
import notifIcon from '@/public/notification.png';
import DMIcon from '@/public/DMs.png'

const NavBar = () => {
  return (
    <nav
        className='w-9/10 flex flex-row justify-between items-center'
    >
        <Image 
            alt='home icon'
            className='w-13 h-13'
            src={homeIcon}
            width={40}
            height={40}
        />

        <Image 
            alt='search icon'
            className='w-13 h-13'
            src={searchIcon}
            width={40}
            height={40}
        />

        <Image 
            alt='notification icon'
            className='w-13 h-13'
            src={notifIcon}
            width={40}
            height={40}
        />

        <Image 
            alt='message icon'
            className='w-13 h-14'
            src={DMIcon}
            width={40}
            height={40}
        />
    </nav>
  )
}

export default NavBar;
