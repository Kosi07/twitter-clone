'use client'

import { useState } from "react"

const HeaderNav = () => {
    const feeds = ['For you', 'Following']

    const [chosenFeed, setChosenFeed] = useState('For you')

  return (
    <nav className='w-full px-2 flex flex-row justify-evenly'>

        {feeds.map(feed => 
            <div 
                key={feed} 
                className={`
                    p-2
                    ${chosenFeed===feed? 'font-bold border-b-2 border-blue-600' : ''}
                `}
                onClick={() => {
                    setChosenFeed(feed)
                }}
            >
                {feed}
            </div>
        )}
    </nav>
  )
}

export default HeaderNav