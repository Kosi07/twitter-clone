import { StaticImageData } from 'next/image';

export interface tweetType {
    _id: string,
    username: string
    handle: string
    profilePic: string | StaticImageData
    createdAt?: Date
    tweetText: string
    commentCounter: number
    likeCounter: number
    commentOf?: string
    likedBy?: string[]
    imgSrc?: string | StaticImageData
};

export interface userType {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string|null;
}