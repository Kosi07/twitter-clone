import { MongoClient, ServerApiVersion } from 'mongodb';


const uri = process.env.MONGODB_CONNECTION_STRING as string;

if(!uri){
    throw new Error('MongoDB URI not found!')
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = await (new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})).connect();

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("twitter-clone").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);