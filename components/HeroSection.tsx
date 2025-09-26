import Image from 'next/image';
import twitt3rBird from '@/public/twitter-bird.png'

const HeroSection = () => {
  return (
    <section className='min-w-[350px] my-4 flex flex-col gap-4 items-center'>
        <Image 
            alt='twitt3r-bird-logo'
            className={``}
            width={50}
            height={50}
            src={twitt3rBird}
        />

        <div 
            id='container'
            className='w-9/10 flex flex-col gap-10 items-center text-center'
        >
            <h1 id='text-container' className={`text-4xl font-extrabold`}>
              Happening now
            </h1>

            <div >
              <div className='text-xl border mb-1'>
                SignUp
              </div>
             
              <p className='text-sm'>
                By signing up, you agree to the <a className='text-blue-400'>Terms of Service</a> and <a className='text-blue-400'>Privacy Policy</a>, including <a className='text-blue-400'>Cookie Use</a>.
              </p>
            </div>

            <div>
              <p className='text-lg font-bold'>
                Already have an account?
              </p>
              SignIn
            </div>

            <a 
              className='bg-gray-300 p-6 rounded-4xl flex flex-row gap-2 justify-center items-center'
              href='/home'>
              <p>Skip to app</p>
              <Image 
                src={twitt3rBird}
                className={``}
                alt='twitt3r app icon'
                width={30}
                height={30}
              />
            </a>
        </div>
    </section>
  )
}

export default HeroSection