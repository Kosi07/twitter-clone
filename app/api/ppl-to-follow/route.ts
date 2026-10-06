import { auth } from "@/lib/auth"
import { MongoClient, ObjectId } from "mongodb"
import { headers } from "next/headers"

export const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string)


export async function GET() {
    const db = client.db(process.env.DB_NAME as string)

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if(!session){
        return Response.json({ error: 'Must be signed in to add tasks' }, { status: 401 })
    }

    const signedInUser = new ObjectId(session.user.id)

    const result = await db.collection('user').aggregate([
        {
            $match: {
            _id: { $ne: signedInUser }
            }
        },
        { $sample: { size: 5 } },
        { $project: {email: 0, emailVerified: 0}}
    ]).toArray()

    return Response.json(result)

}