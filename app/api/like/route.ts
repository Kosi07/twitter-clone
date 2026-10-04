import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { client } from "../tweets/route"
import { ObjectId } from "mongodb"

export async function POST(req:Request){
    try{
        const session = await auth.api.getSession({
                            headers: await headers()
                        })
        
        if(!session){
            return Response.json({ error: 'Must be signed in' }, { status: 401 })
        }

        const signedInUser = session.user.id

        const {tweetId, action} = await req.json()

        const db = client.db(process.env.DB_NAME as string)
        const likesCollection = db.collection('likes')
        const tweetsCollection = db.collection('tweets')

        // Make sure the same pair can only exist once
        await likesCollection.createIndex({ tweetId: 1, userId: 1 }, { unique: true })

        if(action==='like'){
            const result = await likesCollection.updateOne(
                {tweetId: new ObjectId(tweetId as string), userId: new ObjectId(signedInUser)},
                { $setOnInsert: { createdAt: new Date() } },
                { upsert: true }
            )

            if(result.upsertedCount === 1){
                await tweetsCollection.updateOne(
                    { _id: new ObjectId(tweetId) },
                    { $inc: { likeCounter : 1 } }
                )
            }

        }
        else if(action==='dislike'){
            const result = await likesCollection.deleteOne({tweetId: new ObjectId(tweetId), userId: new ObjectId(signedInUser)})

            if (result.deletedCount === 1) {
                await tweetsCollection.updateOne(
                    { _id: new ObjectId(tweetId) },
                    { $inc: { likeCounter: -1 } }
                )
            }
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