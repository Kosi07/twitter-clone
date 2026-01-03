import { auth } from "@/lib/auth"
import { client } from "../../tweets/route"
import { headers } from "next/headers"
import { ObjectId } from "mongodb"

export async function GET(req: Request, {params}: {params: {id: string}}){
    try{
        const {id} = await params

        const session = await auth.api.getSession({
            headers: await headers()
        })

        if(!session){
            return Response.json(
                {error: 'Must be signed in to check liked status'},
                {status: 401},
            )
        }

        const db = client.db(process.env.DB_NAME as string)

        const tweet = await db.collection('tweets')
        .findOne(
            {_id: new ObjectId(id as string)},
            {projection: 
                {likedBy: 1, _id: 0}
            }
        )

        // Check if this user liked the tweet
        const email = session.user.email
        const isLiked = tweet?.likedBy?.includes(email) || false
        
        return Response.json({ isLiked })
    }
    catch(err){
        console.error(err)
        return Response.json(
            {error: 'Failed to check liked status'},
            {status: 500}
        )
    }
}