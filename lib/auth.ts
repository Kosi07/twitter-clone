import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from '@/lib/mongodb'; // your mongodb client

const auth = betterAuth({
    
    database: mongodbAdapter(client.db('twitter-clone')),
    
    emailAndPassword: { 
        enabled: true, 
    }, 

    socialProviders: { 
        github: { 
        clientId: process.env.GITHUB_CLIENT_ID as string, 
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
    }, 

});

export default auth;