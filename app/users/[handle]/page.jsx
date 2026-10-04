export const dynamic = 'force-dynamic' //This page depends on request data — don’t try to statically render it.

import { client } from '@/app/api/tweets/route'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import ProfilePage from '@/components/ProfilePage'
import { ObjectId } from 'mongodb'

const Page = async({params}) => {
    const { handle } = await params //handle is correct

    let urProfilePic

    const likeSteps = []

    async function getUserDetails(email){
      const db = client.db(process.env.DB_NAME)

      const signedInUserDetails = await db.collection('user').findOne({email: email}, 
        {
          projection: {name: 1, image:1, handle:1, _id: 0}
        }
      )

      const {name, image:urProfilePic, handle} = signedInUserDetails

      return urProfilePic
    }

    let session

    try{
      session = await auth.api.getSession({
                        headers: await headers()
                      })
    }catch(err){
      console.error('Error checking sesssion: ', err)
    }

    if(session){
      urProfilePic = await getUserDetails((session.user.email))

      const signedInUser = new ObjectId(session.user.id)

      likeSteps.push(
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
        { $addFields: { isLiked: { $gt: [{ $size: '$myLikes' }, 0] } } },
        { $project: { myLikes: 0 } }
      )
    }

    const db = client.db(process.env.DB_NAME)

    const fetchUser = async() => {
      try{
        const pipeline = [
            //Get the specific user
            { $match: {handle: handle} },

            //Join with tweets collection to get what I assume is an array of all posts by a user
            { $lookup: {
               from: 'tweets',
               let: { userEmail: "$email" },
               pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$email", "$$userEmail"] }
                  }
                },
                { $sort: { createdAt: -1 } },   // newest first
                { $limit: 40 },
                ...likeSteps,
                {
                  $project: {
                    email: 0
                  }
                }
               ],
               as: 'userPosts'
            }},                  

            // Step 5: Clean up
            { $project: { email: 0 } },

          ]

          const response = await db.collection('user')
          .aggregate(pipeline)
          .toArray()

        let result = response[0]

        //Can't work with MongoDB's id
        result._id = result._id.toString()
        
        result.userPosts = result.userPosts.map((userPost) => ({
          ...userPost,
          _id: userPost._id.toString(),
          commentOf: userPost.commentOf && userPost.commentOf.toString(), //also an id
        }))
        
        return result
      }
      catch(err){
        console.error('Error fetching user: ',err)
      }
    }

    let userDetailsAndPosts = await fetchUser()

    const { _id:profile_id } = userDetailsAndPosts
    
    const checkIsFollowing = async () => {
      let follow_doc

      if(session){
        follow_doc = await db.collection('follows').findOne({
          follower: new ObjectId(session.user.id),
          following: new ObjectId(profile_id),
        })
      }

      return follow_doc
    }

    let follow_exists = await checkIsFollowing()
    
  return (
    <ProfilePage userDetailsAndPosts={userDetailsAndPosts} urProfilePic={urProfilePic} isFollowing={follow_exists?true:false} />
  )
}

export default Page