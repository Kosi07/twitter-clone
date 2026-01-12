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
      let userDetails

      try{
        let email 

        const db = client.db(process.env.DB_NAME)

        let result = await db.collection('tweets')
          .findOne(
            {_id: new ObjectId(id)}
          )

          email = result?.email

        const getUserDetails = async(email) => {
          const userDetailsDoc = await db.collection('user').findOne({email: email}, 
            {
              projection: {name: 1, image:1, _id: 0}
            })

          userDetails = {username: userDetailsDoc?.name, profilePic: userDetailsDoc?.image}
        }

        if(email){
          await getUserDetails(email)

          result = {...result, ...userDetails}
        }
        
        return result
      }
      catch(err){
        console.error('Error fetching tweet', err)
      }
    }

    async function fetchComments(){
      let userDetails = []
      let emails = []

      try{
        const db = client.db(process.env.DB_NAME)

        const result = await db.collection('tweets')
                        .find({commentOf: new ObjectId(id)}
                        )
                        .sort({createdAt: -1})
                        .toArray()

        const getUserDetails = async(email, index) => {
          const userDetailsDoc = await db.collection('user').findOne({email: email}, 
            {
              projection: {name: 1, image:1, _id: 0}
            })

          userDetails[index] = {username: userDetailsDoc?.name, profilePic: userDetailsDoc?.image}
        }

        //Get all emails, arrange into an array
        result.forEach((comment)=> emails.push(comment.email))

        //Go to the user collection get their profile pic url, name and handle and return it
        await Promise.all( emails.map((email, index)=> getUserDetails(email, index)) )

        for(let i=0; i<result.length; i++){
          
          result[i] = {...result[i], ...userDetails[i]}

        }
        console.log(result)

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