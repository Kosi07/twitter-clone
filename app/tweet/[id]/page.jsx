export const dynamic = 'force-dynamic' //This page depends on request data — don’t try to statically render it.

import { client } from '@/app/api/tweets/route'
import BackButton from '@/components/BackButton'
import Comments from '@/components/Comments'
import PostComment from '@/components/PostComment'
import Tweet from '@/components/Tweet'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { headers } from 'next/headers'
import Link from 'next/link'

const Page = async({params}) => {
    const { id } = await params //id is correct

    const getUser = async() => {
      try{
        const session = await auth.api.getSession({
                        headers: await headers()
                      })
        return session?.user
      }
      catch(err){
        console.error('Error checking session', err)
      }
    }

    const fetchTweetById = async() => {
      try{ 
        const db = client.db(process.env.DB_NAME)

        let result = await db.collection('tweets')
          .aggregate([
            // Step 1: Find the specific tweet we want
            { $match: { _id: new ObjectId(id) } },
            
            // Step 2: Join with the user collection to get author details
            { 
              $lookup: {
                from: 'user',              // The collection we're joining with
                localField: 'email',       // Field in tweets collection
                foreignField: 'email',     // Matching field in user collection
                as: 'userDetails'          // Put the result here
              }
            },
            
            // Step 3: Clean up the data - extract user info from array
            {
              $addFields: {
                username: { $arrayElemAt: ['$userDetails.name', 0] },
                profilePic: { $arrayElemAt: ['$userDetails.image', 0] }
              }
            },
            
            // Step 4: Remove the temporary userDetails array
            { $project: { userDetails: 0 } }
          ])
          .toArray()

        return result[0]
      }
      catch(err){
        console.error('Error fetching tweet', err)
      }
    }

    async function fetchComments(){
      try{
        const db = client.db(process.env.DB_NAME)

        const result = await db.collection('tweets')
            .aggregate([
              // Step 1: Find all comments for this tweet
              { $match: { commentOf: new ObjectId(id) } },
            
              // Step 2: Sort newest first
              { $sort: { createdAt: -1 } },
            
              // Step 3: Join with user collection to get commenter details
              { 
                $lookup: {
                  from: 'user',
                  localField: 'email',
                  foreignField: 'email',
                  as: 'userDetails'
                }
              },
            
              // Step 4: Extract user info
              {
                $addFields: {
                  username: { $arrayElemAt: ['$userDetails.name', 0] },
                  profilePic: { $arrayElemAt: ['$userDetails.image', 0] }
                }
              },
            
              // Step 5: Clean up
              { $project: { userDetails: 0 } }
          ])
          .toArray()

        return result
      }
      catch(err){
        console.error('Error fetching comments', err)
      }
    }

    const [user, tweet, comments] = await Promise.all([
      getUser(),
      fetchTweetById(),
      fetchComments()
    ])

  return (
    <div className='w-full max-w-[700px] min-w-[280px] min-h-screen'>
      <div className='sticky top-0 bg-gray-50/30 backdrop-blur-xl rounded-lg w-full flex flex-row p-2 text-2xl'>
        <BackButton />
        
        <span className='w-7/10 text-center font-bold'>Tweet</span>
      </div>

      {tweet && 
        <>
          <Tweet 
            id={`${tweet._id}`} 
            username={tweet.username} 
            handle={tweet.handle} 
            profilePic={tweet.profilePic} 
            createdAt={tweet.createdAt}
            tweetText={tweet.tweetText}
            commentCounter={tweet.commentCounter}
            likeCounter={tweet.likeCounter}
            imgSrc={tweet.imgSrc}
          />

          {user?
            <PostComment user={user} idOfOriginalTweet={id} />
          :
          <Link
            href='/sign-in'
          >
            <div
              className='w-full p-2 mt-4 mb-7 text-xl text-center font-bold
                      hover:cursor-pointer hover:text-gray-700'
            >
              Sign In to join the conversation
            </div>
          </Link>
          }

          {comments &&  comments.length>0?
            <Comments comments={comments} />
          :
            <div className='w-full p-4 text-center text-gray-400'>No convo yet? Start one</div>
          }

        </>
      }
    </div>
  )
}

export default Page