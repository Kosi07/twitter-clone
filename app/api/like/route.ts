import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { client } from "../tweets/route"
import { ObjectId, PullOperator, PushOperator } from "mongodb"

export async function POST(req:Request){
    try{
        const session = await auth.api.getSession({
                            headers: await headers()
                        })
        
        if(!session){
            return Response.json(
                    { error: 'Must be signed in to add tasks' }, 
                    { status: 401 }
                )
        }

        const {tweetId, action} = await req.json()

        const db = client.db(process.env.DB_NAME as string)

        if(action==='like'){
            await db.collection('tweets').updateOne(
                {_id: new ObjectId(tweetId as string)},
                { 
                    $push: { likedBy: session.user.email } as PushOperator<Document>,  // Only adds if not already there
                    $inc: {likeCounter: 1}, 
                }
            )
        }
        else if(action==='dislike'){
            await db.collection('tweets').updateOne(
                {_id: new ObjectId(tweetId as string)},
                { 
                    $pull: { likedBy: session.user.email} as PullOperator<Document>, 
                    $inc: { likeCounter: -1 },
                }
            )
        }

        return Response.json(
            {success: true},
            {status: 200}
        )
    }
    catch(err){
        console.error('Error', err)
        return 
    }
}