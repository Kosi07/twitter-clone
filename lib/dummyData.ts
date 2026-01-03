//dummy data

import portugalTeam from '@/public/portugal-team2.jpeg';
import profilePic from '@/public/profile.png'


export const tweets = [
        {
            _id: '123',
            username: 'MrBeast',
            handle: 'mrbeast',
            profilePic: profilePic,
            createdAt: new Date(`${new Date().getFullYear()}-11-22`),
            tweetText: 'Hope you enjoy our new vid 🥰',
            commentCounter: 11000,
            likeCounter: 500000,
            commentDetails: { id:'id', emails:['email@email.com','me@gmail.com']},
            likeDetails: { id:'tweetId', emails:['email@email.com',]},
            imgSrc: '',
        },

        {
            _id: '12',
            username: 'Cristiano Ronaldo',
            handle: 'cr7',
            profilePic: profilePic,
            createdAt: new Date('2023-08-07'),
            tweetText: 'SUIIII!!!!⚽ We did it!!!!!! We won the world cup! Thank you all so much for the support 🥰',
            commentCounter: 900000,
            likeCounter: 5100000,
            commentDetails: { id:'id', emails:['email@email.com','me@gmail.com']},
            likeDetails: { id:'tweetId', emails:['email@email.com',]},
            imgSrc: portugalTeam,
        },

        {
            _id: '1',
            username: 'Elon Musk',
            handle: 'elonmusk',
            profilePic: profilePic,
            createdAt: new Date('2022-11-15'),
            tweetText: "Next I'm buying Coca-Cola ... to put the cocaine back in",
            commentCounter: 11000,
            likeCounter: 800000,
            commentDetails: { id:'id', emails:['email@email.com','me@gmail.com']},
            likeDetails: { id:'tweetId', emails:['email@email.com',]},
            imgSrc: '',
        },
]
