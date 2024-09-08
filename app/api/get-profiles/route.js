import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB connection setup
let client;
const uri = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  if (client && client.isConnected) {
    return client.db("tm-mvp");
  }
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client.db("tm-mvp");
};

// API route to get full profiles based on profile IDs
export async function POST(request) {
  try {
    const { profileIds } = await request.json();
    console.log(profileIds);

    // Check if profileIds were provided
    if (!profileIds || profileIds.length === 0) {
      return NextResponse.json(
        { error: "No profile IDs provided" },
        { status: 400 },
      );
    }

    // Connect to the database
    const db = await connectToDatabase();
    const collection = db.collection("profile");

    // Convert the array of string IDs into MongoDB ObjectId format
    const objectIds = profileIds.map((id) => new ObjectId(id));

    // Fetch the profiles from the database
    const profiles = await collection
      .find({ _id: { $in: objectIds } })
      .toArray();

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 },
    );
  }
}
