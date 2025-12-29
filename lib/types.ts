import { StaticImageData } from 'next/image';

export interface tweetType {
    username: string
    handle: string
    profilePic: string | StaticImageData
    createdAt?: Date
    tweetText: string
    commentCounter: number
    likeCounter: number
    commentDetails?: commentDetailsType
    likeDetails?: likeDetailsType
    imgSrc?: string | StaticImageData
};

interface likeDetailsType {
  emails: string[]
}

interface commentDetailsType {
  emails: string[]
}

export interface userType {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string|null;
}