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
              tweetText,
              commentCounter,
              likeCounter,
              imgSrc=null,
              commentOf=null,
            } = newTweet

      //Connect to MongoDB
      const db = client.db(process.env.DB_NAME as string)

      const result = await db.collection('tweets').insertOne({
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
            { $inc: { commentCounter: 1 } }  
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
    
    // Get all tweets, sorted by newest first
    const tweets = await db.collection('tweets')
      .aggregate([
        //Find where commentOf is null
        { $match: {commentOf: {$eq: null}} },

        //sort by newest first
        { $sort: {createdAt: -1}},

        //limit to 35
        { $limit: 35},

        //lookup userdetails
        { 
          $lookup: {
            from: 'user',
            localField: 'email',
            foreignField: 'email',
            as: 'userDetails',
          }
        },

        //Extract username and profilePic
        {
          $addFields: {
            username: { $arrayElemAt: ['$userDetails.name', 0] },
            profilePic: { $arrayElemAt: ['$userDetails.image', 0]},
          }
        },

        //Delete userDetails field
        { $project: { userDetails: 0 } },

      ])
      .toArray()

    // const usersWithoutHandles = await db.collection('user')
    //   .find(
    //     {handle: {$exists: false}}
    //   )
    // .toArray()

    // //generate unique handle func
    // async function generateUniqueHandle(name:string){
      
    // }
    
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