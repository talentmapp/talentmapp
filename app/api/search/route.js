// // lib/search.js
// "use server"
// import { MongoClient, ServerApiVersion } from 'mongodb';

// let client;
// const uri = "mongodb+srv://sarvag:mUsgWnuspL5CghIv@talentmapp.iks0k0t.mongodb.net/?retryWrites=true&w=majority&appName=talentmapp";

// const connectToDatabase = async () => {
//  if (client && client.isConnected()) {
//     return client.db("tm-mvp"); // Specify your database name here
//  }

//  client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//  });

//  await client.connect();
//  return client.db("tm-mvp"); // Specify your database name here
// };

// export async function searchProfiles(prompt) {
//  const db = await connectToDatabase();
//  const collection = db.collection('profile'); // Specify your collection name here

//  // Assuming you have a vector field named 'embeddings' for vector search
//  const matchingProfiles = await collection.aggregate([
//     {
//       $search: {
//         "vector": {
//           "query": prompt,
//           "path": "embeddings",
//           "score": {
//             "field": "score",
//             "multiplier": 1
//           }
//         }
//       }
//     }
//  ]).toArray();

//  return matchingProfiles;
// }


"use server"
import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB connection setup
let client;
const uri = process.env.MONGODB_URI;

const connectToDatabase = async () => {
 if (client && client.isConnected()) {
    return client.db("tm-mvp"); // Specify your database name here
 }

 client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
 });

 await client.connect();
 return client.db("tm-mvp"); // Specify your database name here
};

export default async function handler(req, res) {
 if (req.method === 'POST') {
    try {
      const { message } = req.body;
      const apiKey = process.env.OPENAI_API_KEY;
      const url = 'https://api.openai.com/v1/chat/completions';

      const body = JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message },
        ],
        model: 'gpt-3.5-turbo',
        stream: false,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const processedMessage = data.choices[0].message.content;

      // Connect to MongoDB and search for matching profiles
      const db = await connectToDatabase();
      const collection = db.collection('profile'); // Specify your collection name here

      // Assuming you have a vector field named 'embeddings' for vector search
      const matchingProfiles = await collection.aggregate([
        {
          $search: {
            "vector": {
              "query": processedMessage,
              "path": "embeddings",
              "score": {
                "field": "score",
                "multiplier": 1
              }
            }
          }
        }
      ]).toArray();

      // Return matching profiles
      res.status(200).json(matchingProfiles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search profiles or interact with OpenAI' });
    }
 } else {
    res.status(405).end(); // Method Not Allowed
 }
}


// import { getOpenAIResponse } from '../../lib/openai';
// export async function searchProfiles(prompt) {
//   try {
//      const response = await fetch('/api/search', {
//        method: 'POST',
//        headers: {
//          'Content-Type': 'application/json',
//        },
//        body: JSON.stringify({ prompt }),
//      });
 
//      if (!response.ok) {
//        throw new Error('Failed to search profiles');
//      }
 
//      const profiles = await response.json();
//      return profiles;
//   } catch (error) {
//      console.error('Failed to search profiles:', error);
//      throw error;
//   }
//  }
 
// export const searchProfiles = async (prompt) => {
//   // Step 3: Integrate OpenAI API
//   const openaiResponse = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
//     prompt,
//     max_tokens: 50,
//     n: 1,
//     stop: null,
//     temperature: 0.5,
//   }, {
//     headers: {
//       'Authorization': `Bearer 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`,
//       // 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//   });

//   // Step 4: Process the OpenAI response
//   const processedPrompt = openaiResponse.data.choices[0].text.trim();

//   // Step 5: Query MongoDB based on the OpenAI response
//   // Use the connectToDatabaseAndQuery function with the appropriate query
//   const query = { $text: { $search: processedPrompt } };
//   const profiles = await connectToDatabaseAndQuery(query);

//   return profiles;
// };