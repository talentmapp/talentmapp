import { MongoClient, ObjectId } from "mongodb";

let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedDb = client.db("tm-mvp");
  return cachedDb;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Missing 'id' parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection("profile");

    // Fetch the requested profile to get its embedding
    const currentProfile = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: { embedding: 1 } },
    );

    if (!currentProfile) {
      return new Response(JSON.stringify({ message: "Profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const queryEmbedding = currentProfile.embedding;
    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
      return new Response(
        JSON.stringify({ message: "Profile embedding not found or invalid" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Vector search pipeline to find similar profiles
    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 15,
          limit: 9,
        },
      },
      {
        $match: { _id: { $ne: new ObjectId(id) } },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          profilePicture: 1,
          location: 1,
          customSummary: 1,
          strengths: 1,
          relevancyScore: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const similarProfiles = await collection.aggregate(pipeline).toArray();

    return new Response(JSON.stringify({ similarProfiles }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching similar profiles:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to process the request for similar profiles",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
