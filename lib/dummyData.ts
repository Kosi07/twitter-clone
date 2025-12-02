//dummy data

import portugalTeam from '@/public/portugal-team2.jpeg';
import profilePic from '@/public/profile.png'
import { StaticImageData } from 'next/image';

export interface tweetType {
    username: string;
    handle: string;
    profilePic: string | StaticImageData;
    time: number;
    timeDetails: string;
    tweetText: string;
    commentCounter: number;
    likeCounter: number;
    imgSrcs: (string | null | StaticImageData)[]
};


export const tweets = [
        {
            username: 'Elon Musk',
            handle: 'elonmusk',
            profilePic: profilePic,
            time: 30,
            timeDetails: Date(),
            tweetText: "Next I'm buying Coca-Cola ... to put the cocaine back in",
            commentCounter: 11000,
            likeCounter: 800000,
            imgSrcs: []
        },

        {
            username: 'Cristiano Ronaldo',
            handle: 'cr7',
            profilePic: profilePic,
            time: 7,
            timeDetails: Date(),
            tweetText: 'SUIIII!!!!⚽ We did it!!!!!! We won the world cup! Thank you all so much for the support 🥰',
            commentCounter: 900000,
            likeCounter: 5100000,
            imgSrcs: [portugalTeam],
        },

        {
            username: 'MrBeast',
            handle: 'mrbeast',
            profilePic: profilePic,
            time: 45,
            timeDetails: Date(),
            tweetText: 'Hope you enjoy our new vid 🥰',
            commentCounter: 11000,
            likeCounter: 500000,
            imgSrcs: [],
        },
]
