import { betterAuth} from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string)
const db = client.db(process.env.DB_NAME as string)

// Helper function to clean a name into a handle format
function cleanName(name: string): string {
  return name
    .toLowerCase()              // Make lowercase
    .replace(/[^a-z0-9]/g, '')  // Remove spaces and special characters
}

// Function to generate a unique handle
async function generateUniqueHandle(name: string): Promise<string> {
  const baseHandle = cleanName(name)
  let handle = baseHandle
  let counter = 1
  
  // Keep trying until we find an available handle
  while (true) {
    const exists = await db.collection('user').findOne({ handle })
    
    if (!exists) {
      return handle  // This handle is free!
    }
    
    // Handle taken, add a number and try again
    handle = baseHandle + (counter+1)
    counter++
  }
}

export const auth = betterAuth({
    database: mongodbAdapter(db),

    socialProviders:{ 
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },

        twitter: {
            clientId: process.env.TWITTER_CLIENT_ID as string,
            clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
        }
    },

    user: {
        additionalFields: {
            handle: { type: "string", required: false },
        },
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const handle = await generateUniqueHandle(user.name)
                    console.log(`New user: ${user.name} → @${handle}`)
                    return { data: { ...user, handle } }
                },
            },
        },
    },

});