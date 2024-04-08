// utils/openai.js
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

export async function getOpenAIResponse(message) {
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
  
 try {
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
    return matchingProfiles;
 } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error; // Rethrow the error to be handled by the caller
 }
}
