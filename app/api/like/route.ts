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

        const email = session.user.email

        const {tweetId, action} = await req.json()

        const db = client.db(process.env.DB_NAME as string)

        if(action==='like'){
            const tweet = await db.collection('tweets').findOne(
                {_id: new ObjectId(tweetId as string)},
                {projection: {likedBy: 1, _id: 0}}
            )

            if(tweet?.likedBy?.includes(email) ){
                return Response.json(
                    {error: 'Tweet already liked'},
                    {status: 400}
                )
            }

            await db.collection('tweets').updateOne(
                {_id: new ObjectId(tweetId as string)},
                { 
                    $push: { likedBy: email } as PushOperator<Document>,  // Only adds if not already there
                    $inc: {likeCounter: 1}, 
                }
            )
        }
        else if(action==='dislike'){
            await db.collection('tweets').updateOne(
                {_id: new ObjectId(tweetId as string)},
                { 
                    $pull: { likedBy: email} as PullOperator<Document>, 
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