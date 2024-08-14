import { NextResponse } from "next/server";
import axios from "axios";
import { MongoClient, ServerApiVersion } from "mongodb";

let client;
const uri = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  if (client && client.isConnected) {
    return client.db("tm-mvp");
  }
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    },
  });
  await client.connect();
  return client.db("tm-mvp");
};

async function generateEmbeddings(text) {
  const token = process.env.NEW_OPENAI_API_KEY;
  const model = "text-embedding-3-small";
  try {
    const requestBody = {
      model: model,
      input: [text],
      dimensions: 512,
    };
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const embedding = response.data.data[0].embedding;
    return embedding;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate embeddings");
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, location } = body;
    console.log(body);

    if (!message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 },
      );
    }

    const queryEmbedding = await generateEmbeddings(message);
    const db = await connectToDatabase();
    const collection = db.collection("profile");

    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 90,
          limit: 3,
        },
      },
    ];

    // Add location filtering if location is provided and not "Anywhere"
    if (location) {
      pipeline.push({
        $match: {
          location: location,
        },
      });
    }

    console.log(pipeline);

    const matchingProfiles = await collection.aggregate(pipeline).toArray();
    return NextResponse.json(matchingProfiles);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to search profiles or interact with OpenAI" },
      { status: 500 },
    );
  }
}
