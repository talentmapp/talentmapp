import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;

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

export async function POST(req) {
  try {
    const { email, profileId } = await req.json();

    if (!email || !profileId) {
      return new Response(
        JSON.stringify({ error: "Missing email or profileId" }),
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("profile");

    // Remove profileId from the user's favorites array
    await usersCollection.updateOne(
      { email },
      { $pull: { favorites: profileId } }, // $pull removes the profileId from the array
    );

    return new Response(
      JSON.stringify({ message: "Profile removed from favorites" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return new Response(
      JSON.stringify({ error: "Error removing from favorites" }),
      { status: 500 },
    );
  }
}
