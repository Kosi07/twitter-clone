export const dynamic = 'force-dynamic' //This page depends on request data — don’t try to statically render it.

import { client } from '@/app/api/tweets/route'

import Comments from '@/components/Comments'
import PostComment from '@/components/PostComment'
import Tweet from '@/components/Tweet'
import { auth } from '@/lib/auth'
import { ArrowLeft } from 'lucide-react'
import { ObjectId } from 'mongodb'
import { headers } from 'next/headers'
import Link from 'next/link'

const Page = async({params}) => {
    const { id } = await params //id is correct

    const session = await auth.api.getSession({
                        headers: await headers()
                      })

    const getUser = async() => {
      return session?.user
    }

    const fetchTweetById = async() => {
      try{ 
        const db = client.db(process.env.DB_NAME)

        const pipeline = [
            // Step 1: Find the specific tweet we want
            { $match: { _id: new ObjectId(id) } },
            
            // Step 2: Join with the user collection to get author details
            { 
              $lookup: {
                from: 'user',              // The collection we're joining with
                localField: 'userId',       // Field in tweets collection
                foreignField: '_id',     // Matching field in user collection
                as: 'userDetails'          // Put the result here
              }
            },
            
            // Step 3: Clean up the data - extract user info from array
            {
              $addFields: {
                username: { $arrayElemAt: ['$userDetails.name', 0] },
                profilePic: { $arrayElemAt: ['$userDetails.image', 0] },
                handle: { $arrayElemAt: ['$userDetails.handle', 0]},
              }
            },
            
            // Step 4: Remove the temporary userDetails array
            { $project: { userDetails: 0 } }
          ]

          if(session){
            const signedInUser = new ObjectId(session.user.id)

            pipeline.push(
              // Step 1: search the likes collection
              {
                $lookup: {
                  from: 'likes',
                  let: { tweetId: new ObjectId(id) },
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

          let result = await db.collection('tweets')
          .aggregate(pipeline)
          .toArray()

          console.log(result)

        return result[0]
      }
      catch(err){
        console.error('Error fetching tweet', err)
      }
    }

    async function fetchComments(){
      try{
        const db = client.db(process.env.DB_NAME)

        const pipeline = [
              // Step 1: Find all comments for this tweet
              { $match: { commentOf: new ObjectId(id) } },
            
              // Step 2: Sort newest first
              { $sort: { createdAt: -1 } },
            
              // Step 3: Join with user collection to get commenter details
              { 
                $lookup: {
                  from: 'user',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'userDetails'
                }
              },
            
              // Step 4: Extract user info
              {
                $addFields: {
                  username: { $arrayElemAt: ['$userDetails.name', 0] },
                  profilePic: { $arrayElemAt: ['$userDetails.image', 0] },
                  handle: { $arrayElemAt: ['$userDetails.handle', 0]},
                }
              },
            
              // Step 5: Clean up
              { $project: { userDetails: 0, email: 0 } }
          ]

          const result = await db.collection('tweets')
            .aggregate(pipeline)
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
    <main className='min-h-screen bg-background'>
      <div className="mx-auto w-full max-w-[720px] px-4 py-5 sm:px-8 sm:py-8">
        <header className="flex items-center gap-3 border-b border-border/70 pb-5 sticky top-0 z-2 bg-background backdrop-blur-xl">
          <Link href="/" aria-label="Back to feed" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><ArrowLeft className="size-5" /></Link>

          <Link href='/home' className="flex items-center gap-2.5" aria-label="Twitt3r home">
            <span className="grid size-8 place-items-center rounded-[10px] bg-[#242321] text-sm font-semibold tracking-tight text-white">t</span>
            <span className="text-[15px] font-semibold tracking-[-0.03em]">twitt3r</span>
          </Link>
        </header>

        <div className="py-8">
          <div className="mt-4 rounded-2xl border border-border/80 border-l-2 border-l-[#a9c7b9] bg-card p-5 shadow-[0_6px_24px_rgba(47,43,36,0.035)] sm:p-7">
            {tweet && 
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
                isLiked={tweet.isLiked}
              />
            }
          </div>

          <section id="comments" className="mt-8 scroll-mt-6">
            <h2 className="text-sm font-semibold">Comments <span className="font-normal text-muted-foreground">{comments.length}</span></h2>
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
              <div className='mt-4 flex flex-col gap-3'>
                <Comments comments={comments} />
              </div>
            :
              <div className='w-full p-4 text-center text-gray-400'>No convo yet? Start one</div>
            }

          </section>
        </div>

      </div>
    </main>
  )
}

export default Page