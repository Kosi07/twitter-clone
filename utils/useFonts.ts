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

export const luxury = localFont(
    {
        src:[
            {
                path: '../public/fonts/luxury.woff2',
            }
        ],
        variable: '--luxury',
        display: 'swap'
    }
)

export const sfpro = localFont({
    src:[
        {
            path: '../public/fonts/sfpro.woff2'
        }
    ],
    variable: '--sfpro',
    display: 'swap'
})