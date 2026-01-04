export const dynamic = 'force-dynamic' //This page depends on request data — don’t try to statically render it.

import { client } from '@/app/api/tweets/route'
import BackButton from '@/components/BackButton'
import Comments from '@/components/Comments'
import PostComment from '@/components/PostComment'
import Tweet from '@/components/Tweet'
import { auth } from '@/lib/auth'
import { tweetType } from '@/lib/types'
import { ObjectId } from 'mongodb'
import { headers } from 'next/headers'
import Link from 'next/link'

const Page = async({params}:{params: {id: string}}) => {
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
        const db = client.db(process.env.DB_NAME as string)

        const result = await db.collection('tweets')
          .findOne(
            {_id: new ObjectId(id)}
            ,
            {
              projection: {email: 0}
            }
          )
        
        return result as unknown as tweetType
      }
      catch(err){
        console.error('Error fetching tweet', err)
      }
    }

    async function fetchComments(){
      try{
        const db = client.db(process.env.DB_NAME as string)

        const result = await db.collection('tweets')
                        .find({commentOf: new ObjectId(id)}, 
                          {projection: {email: 0} }
                        )
                        .sort({createdAt: -1})
                        .toArray()

        return result as unknown as tweetType[]
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
      <div className='sticky top-0 bg-gray-50/30 backdrop-blur-xl rounded-lg w-full flex flex-row px-2 text-2xl'>
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