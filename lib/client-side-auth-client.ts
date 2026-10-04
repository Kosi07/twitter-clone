import { createAuthClient } from "better-auth/react";
import { redirect } from "next/navigation";

export const authClient = createAuthClient()

export const signOut = () => {
    authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
            redirect("/sign-in")
            },
        },
    })
}