import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db("tm-mvp");
};

export async function POST(request) {
  try {
    const { userEmail, profileId } = await request.json();

    if (!userEmail || !profileId) {
      return NextResponse.json(
        { error: "Missing userEmail or profileId" },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("profile");

    // Find the user by email
    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the profile is already in the user's favorites
    const isFavorite = user.favorites?.includes(profileId);

    if (isFavorite) {
      // Remove the profile from the favorites list
      await usersCollection.updateOne(
        { email: userEmail },
        { $pull: { favorites: profileId } },
      );
      return NextResponse.json({ success: true, action: "removed" });
    } else {
      // Add the profile to the favorites list
      await usersCollection.updateOne(
        { email: userEmail },
        { $addToSet: { favorites: profileId } },
      );
      return NextResponse.json({ success: true, action: "added" });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 },
    );
  }
}
