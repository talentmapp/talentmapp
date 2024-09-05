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
    const { message, location, userId } = body;

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
          limit: 9,
          filter: location ? { location: location } : {},
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          profilePicture: 1,
          location: 1,
          country: 1,
          experience: 1,
          education: 1,
          skills: 1,
          strengths: 1,
          customSummary: 1,
          interests: 1,
          languages: 1,
          socialMedia: 1,
          visibility: 1,
          relevancyScore: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const matchingProfiles = await collection.aggregate(pipeline).toArray();

    // Collect profile IDs
    const profileIds = matchingProfiles.map((profile) => profile._id);

    // Insert the search into the "searches" collection with userId
    const searchesCollection = db.collection("searches");
    await searchesCollection.insertOne({
      userId, // Use user ID instead of email
      message,
      location,
      profileIds,
      timestamp: new Date(),
    });

    return NextResponse.json(matchingProfiles);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to search profiles or interact with OpenAI" },
      { status: 500 },
    );
  }
}
