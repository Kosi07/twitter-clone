import { client } from "../tweets/route"

export async function POST(req:Request){
    try{
        const { email } = await req.json()

        const db = client.db(process.env.DB_NAME)

        const userDetailsDoc = await db.collection('user').findOne({email: email}, 
        {
          projection: {name: 1, image:1, _id: 0}
        })

       return Response.json(
        {username: userDetailsDoc?.name, profilePic: userDetailsDoc?.image}
       )
    }
    catch(err){
        console.error('Error', err)

        return Response.json(
            {error: 'Error fetching user details'},
            {status: 500}
        )
    }
}