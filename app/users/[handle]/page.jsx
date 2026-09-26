export const dynamic = 'force-dynamic' //This page depends on request data — don’t try to statically render it.

import { client } from '@/app/api/tweets/route'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import ProfilePage from '@/components/ProfilePage'

const Page = async({params}) => {
    const { handle } = await params //handle is correct

    let urProfilePic

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

    const session = await auth.api.getSession({
                      headers: await headers()
                    })
    if(session){
      urProfilePic = await getUserDetails((session.user.email))
    }

    const fetchUser = async() => {
      try{
        const db = client.db(process.env.DB_NAME)

        let response = await db.collection('user')
          .aggregate([
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
                { $limit: 20 },
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

          ])
          .toArray()

        let result = response[0]

        result._id = result._id.toString()
        //Can't work with MongoDB's id
        result.userPosts = result.userPosts.map((userPost) => ({
          ...userPost,
          _id: userPost._id.toString(),
          commentOf: userPost.commentOf && userPost.commentOf.toString(),
        }))
        
        return result
      }
      catch(err){
        console.error('Error fetching user: ',err)
      }
    }

    let userDetailsAndPosts = await fetchUser()

    
  return (
    <ProfilePage userDetailsAndPosts={userDetailsAndPosts} urProfilePic={urProfilePic}/>
  )
}

export default Page