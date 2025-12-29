import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient()

export const signOut = () => {
    authClient.signOut()
}