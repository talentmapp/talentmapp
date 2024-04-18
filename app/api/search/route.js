import { NextResponse } from "next/server";
import axios from "axios";
import { MongoClient, ServerApiVersion } from "mongodb";

let client;
const uri =
  "mongodb+srv://sarvag:mUsgWnuspL5CghIv@talentmapp.iks0k0t.mongodb.net/?retryWrites=true&w=majority&appName=talentmapp";

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
  const token = "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";
  const model = "text-embedding-ada-002";
  try {
    const requestBody = {
      model: model,
      input: [text],
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
    if (!body.message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    const { message } = body;
    console.log("Message:", message);

    const queryEmbedding = await generateEmbeddings(message);
    const db = await connectToDatabase();
    const collection = db.collection("profile");
    const matchingProfiles = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 10,
            limit: 3,
          },
        },
      ])
      .toArray();
    return NextResponse.json(matchingProfiles);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to search profiles or interact with OpenAI" },
      { status: 500 }
    );
  }
}
