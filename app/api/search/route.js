"use server";
import { MongoClient, ServerApiVersion } from "mongodb";
import { NextResponse } from "next/server";
import axios from "axios";

let client;
const uri =
 "mongodb+srv://sarvag:mUsgWnuspL5CghIv@talentmapp.iks0k0t.mongodb.net/?retryWrites=true&w=majority&appName=talentmapp";

const connectToDatabase = async () => {
 if (client && client.isConnected()) {
    return client.db("tm-mvp"); // Specify your database name here
 }

 client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    },
 });

 await client.connect();
 return client.db("tm-mvp"); // Specify your database name here
};

async function generateEmbeddings(text) {
 const token = "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"; // Replace with your actual OpenAI API key
 const model = "text-embedding-ada-002"; // The model to use for generating embeddings
 
 try {
     // Prepare the request body
     const requestBody = {
       model: model,
       input: [text], // Ensure the input is an array as per the API requirements
     };
 
     const response = await axios.post(
       "https://api.openai.com/v1/embeddings",
       requestBody,
       {
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
       }
     );
 
     // Extract the embedding from the response
     const embedding = response.data.data[0].embedding;
     console.log(embedding)
     return embedding;
 } catch (error) {
     console.error(error);
     throw new Error("Failed to generate embeddings");
 }
 }

export async function POST(req, res) {
 if (req.method === "POST") {
    try {
      // Hardcoded query
      // const queryText = "someone who could help me develop an e-commerce platform";
      const queryText = "someone named kashyap";

      // Generate an embedding for the hardcoded query
      const queryEmbedding = await generateEmbeddings(queryText);

      const db = await connectToDatabase();
      const collection = db.collection("profile");

      // Perform a vector search query using the query embedding
      const matchingProfiles = await collection.aggregate([
        {
          $vectorSearch: {
            index: "vector_index", // Replace with your actual index name
            path: "embedding", // The field that contains the vector embeddings
            queryVector: queryEmbedding,
            numCandidates: 10, // Number of nearest neighbors to use during the search
            limit: 2,
          }
        }
        // {
        //   $vectorSearch: {
        //     index: "vector_index", // Replace with your actual index name
        //     path: "embedding", // The field that contains the vector embeddings
        //     queryVector: queryEmbedding,
        //     numCandidates: 10, // Number of nearest neighbors to use during the search
        //     limit: 2,
        //   }
        // }
      ]).toArray();

      console.log("Matching profiles:", matchingProfiles);

      return new NextResponse(JSON.stringify(matchingProfiles), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error:", error);
      // Return a 500 error response
      return new NextResponse(
        JSON.stringify({
          error: "Failed to search profiles or interact with OpenAI",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
 } else {
    // Return a 405 Method Not Allowed response
    return new NextResponse(null, {
      status: 405,
    });
 }
}
