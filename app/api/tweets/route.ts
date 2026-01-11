import { auth } from "@/lib/auth"
import { MongoClient, ObjectId } from "mongodb"
import { headers } from "next/headers"

export const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string)

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
              commentOf=null,
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
          ...(commentOf && {commentOf: new ObjectId(commentOf as string)}),
          email: session.user.email,
          createdAt: new Date(),
      })

      if(commentOf){
        await db.collection('tweets')
          .updateOne(
            { _id: new ObjectId(commentOf as string) },
            { $inc: { commentCounter: 1 } }  // $inc means "increment by 1"
          )
      }

      return Response.json(
            {
                success: true,
                id: result.insertedId,
            }
        )
    }
    catch(err){
      console.error('Error',err)
      return Response.json({
        error: 'Error'
      })
    }
}

export async function GET() {
  try{
    //Connect to MongoDB
    const db = client.db(process.env.DB_NAME as string);

    //Get all emails, arrange into an array
    //Go to the user collection get their profile pic url, name and handle and return it
    
    // Get all tweets, sorted by newest first
    const tweets = await db.collection('tweets')
      .find({commentOf: {$eq: null}}, { 
        projection: {    
          email: 0     
        } 
      })
      .sort({ createdAt: -1 })
      .limit(25)
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