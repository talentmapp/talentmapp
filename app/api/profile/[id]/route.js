import { MongoClient, ObjectId } from "mongodb";

async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return client.db("tm-mvp");
}

export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Connect to the database
    const db = await connectToDatabase();
    const collection = db.collection("profile");

    // Fetch the user's data by ID
    const user = await collection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the user data
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
