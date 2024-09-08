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

    // Add profileId to the user's favorites array
    await usersCollection.updateOne(
      { email },
      { $addToSet: { favorites: profileId } }, // $addToSet ensures the profileId is only added once
    );

    return new Response(
      JSON.stringify({ message: "Profile added to favorites" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return new Response(
      JSON.stringify({ error: "Error adding to favorites" }),
      { status: 500 },
    );
  }
}
