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

        const {profile_id, action} = await req.json()

        const signedInUser = new ObjectId(session.user.id)
        const target = new ObjectId(profile_id as string)

        if (profile_id === session.user.id) {
            return Response.json({ error: "Can't follow yourself" }, { status: 400 })
        }

        const db = client.db(process.env.DB_NAME as string)

        const follows = db.collection('follows')
        const users = db.collection('user')

        // Make sure the same pair can only exist once
        await follows.createIndex({ follower: 1, following: 1 }, { unique: true })

        if(action==='follow'){
            const result = await follows.updateOne(
                { follower: signedInUser, following: target },
                { $setOnInsert: { createdAt: new Date() } },
                { upsert: true }
            )

            if (result.upsertedCount === 1) { //No duplicate action
                await users.updateOne(
                    { _id: target },
                    { $inc: { followerCount: 1 } }
                )
                await users.updateOne(
                    { _id: signedInUser },
                    { $inc: { followingCount: 1 } }
                )
            }
        }
        else if(action==='unfollow'){
            const result = await follows.deleteOne({ follower: signedInUser, following: target })

            if (result.deletedCount === 1) {
                await users.updateOne(
                    { _id: target },
                    { $inc: { followerCount: -1 } }
                )
                await users.updateOne(
                    { _id: signedInUser },
                    { $inc: { followingCount: -1 } }
                )
            }
        }

        return Response.json({success: true}, {status: 200})
    }
    catch(err){
        console.error('Error', err)
        return 
    }
}