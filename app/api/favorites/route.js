import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  let client;
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
  return client.db("tm-mvp");
};

// Fetch user favorites based on their email
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to fetch favorites." },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const user = await db.collection("profile").findOne({ email });

    if (!user || !user.favorites) {
      return NextResponse.json({ favorites: [] }, { status: 200 });
    }

    return NextResponse.json({ favorites: user.favorites }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites." },
      { status: 500 },
    );
  }
}
