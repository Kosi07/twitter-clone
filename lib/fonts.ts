import localFont from 'next/font/local';

export const sfpro = localFont({
    src:[
        {
            path: '../public/fonts/sfpro.woff2'
        }
    ],
    variable: '--sfpro',
    display: 'swap'
})