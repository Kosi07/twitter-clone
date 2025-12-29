import { auth } from "@/lib/auth"
import { MongoClient } from "mongodb"
import { headers } from "next/headers"

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string)

export async function POST(req:Request){
    let session
    try{
      session = await auth.api.getSession({
        headers: await headers()
      })

      if(!session){
        return Response.json(
                { error: 'Must be signed in to add tasks' }, 
                { status: 401 }
            )
      }

      const { newTweet } = await req.json()

      const {
              username, 
              handle,
              profilePic,
              tweetText,
              commentCounter,
              likeCounter,
              imgSrc=null,
            } = newTweet

      //Connect to MongoDB
      const db = client.db(process.env.DB_NAME as string)

      const result = await db.collection('tweets').insertOne({
          username, 
          handle,
          profilePic,
          tweetText,
          commentCounter,
          likeCounter,
          imgSrc,
          email: session.user.email,
          createdAt: new Date(),
      })

      return Response.json(
            {
                success: true,
                id: result.insertedId,
            }
        )
    }
    catch(err){
      console.error('Error checking session',err)
      return Response.json({
        error: 'Error checking session'
      })
    }
}

export async function GET() {
  let session
  try{
    session = await auth.api.getSession({
      headers: await headers()
    })

    if(!session){
      return Response.json(
              { error: 'Must be signed in to add tasks' }, 
              { status: 401 }
      )
    }

    //Connect to MongoDB
    const db = client.db(process.env.DB_NAME as string);
    
    // Get all tweets, sorted by newest first
    const tweets = await db.collection('tweets')
      .find({}, { 
        projection: { 
          _id: 0,     
          email: 0     
        } 
      })
      .sort({ createdAt: -1 })
      .toArray();
    
    return Response.json(tweets);
    
  } 
  catch (err) {
    console.error('Error fetching tweets', err);
    return Response.json(
      { error: 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}