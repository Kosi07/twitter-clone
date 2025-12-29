import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient()

export const signInWithGoogle = async() => {
    try{
        await authClient.signIn.social({
            provider: 'google',
        })
    }
    catch(err){
        console.error('Error signing in with Google', err)
    }
}

export const signInWithTwitter = async() => {
    try{
        await authClient.signIn.social({
            provider: 'twitter',
        })
    }
    catch(err){
        console.error('Error signing in with Twitter', err)
    }
}

