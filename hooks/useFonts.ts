import localFont from 'next/font/local';

export const inter = localFont(
    {
        src:[
            {
                path: '../public/fonts/inter.woff2',
                weight: '400',
                style: 'normal'
            }
        ],
        variable: '--inter',
        display: 'swap'
    }
)