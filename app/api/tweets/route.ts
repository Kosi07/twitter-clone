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
  const emails:string[] = []
  const userDetails: object[] = []


  try{
    //Connect to MongoDB
    const db = client.db(process.env.DB_NAME as string);
    
    // Get all tweets, sorted by newest first
    const tweets = await db.collection('tweets')
      .find({commentOf: {$eq: null}}, { 
        projection: { username:0, profilePic: 0} 
      })
      .sort({ createdAt: -1 })
      .limit(25)
      .toArray();

    const getUserDetails = async(email:string, index:number) => {
      const userDetailsDoc = await db.collection('user').findOne({email: email}, 
        {
          projection: {name: 1, image:1, _id: 0}
        })

      userDetails[index] = {username: userDetailsDoc?.name, profilePic: userDetailsDoc?.image}
    }

    //Get all emails, arrange into an array
    tweets.forEach((tweet)=> emails.push(tweet.email))

    //Go to the user collection get their profile pic url, name and handle and return it
    await Promise.all( emails.map((email, index)=> getUserDetails(email, index)) )

    for(let i=0; i<tweets.length; i++){
      
      tweets[i] = {...tweets[i], ...userDetails[i]}

    }
    
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