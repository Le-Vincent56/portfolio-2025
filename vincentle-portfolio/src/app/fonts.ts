import localFont from 'next/font/local';

export const generalSans = localFont({
    src: [{ 
        path: '../../public/fonts/GeneralSans-Variable.ttf', 
        weight: '100 900', 
        style: 'normal'
    }],
    variable: '--font-sans',
    display: 'swap',
})