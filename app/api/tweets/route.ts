import { auth } from "@/lib/auth"
import { Document, MongoClient, ObjectId } from "mongodb"
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
          createdAt: new Date(),
          userId: new ObjectId(session.user.id),
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
    const db = client.db(process.env.DB_NAME as string)

    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    // Get all tweets, sorted by newest first
    const pipeline: Document[] = [
        //Find where commentOf is null
        { $match: {commentOf: {$eq: null}} },

        //sort by newest first
        { $sort: {createdAt: -1}},

        //limit to 55
        { $limit: 55},

        //lookup userdetails
        { 
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails',
          }
        },

        //Extract username and profilePic
        {
          $addFields: {
            username: { $arrayElemAt: ['$userDetails.name', 0] },
            profilePic: { $arrayElemAt: ['$userDetails.image', 0]},
            handle: { $arrayElemAt: ['$userDetails.handle', 0]},
          }
        },

        //Delete userDetails field
        { $project: { userDetails: 0, email: 0 } },

      ]

      if(session){
        const signedInUser = new ObjectId(session.user.id)

        //In the process of getting tweets, if lookup likesCollection for each tweet 
        // localField:_id  foreignField:  tweetId
        //If userId = signedInUser, isLiked = true for that specific tweet

        pipeline.push(
          // Step 1: search the likes collection
          {
            $lookup: {
              from: 'likes',
              let: { tweetId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$tweetId', '$$tweetId'] },
                    userId: signedInUser,
                  },
                },
              ],
              as: 'myLikes',
            },
          },

          // Step 2: true if we found at least one like
          { $addFields: { isLiked: { $gt: [{ $size: '$myLikes' }, 0] } } },

          // Step 3: remove the temporary list
          { $project: { myLikes: 0 } }
        )
      }

      const tweets = await db.collection('tweets')
      .aggregate(pipeline)
      .toArray()

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