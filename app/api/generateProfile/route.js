// app/api/generateProfiles.js
"use server";
import { MongoClient } from "mongodb";
import { generateEmbeddings } from "../../../utils/generateEmbeddings"; // Adjust the import path as necessary

export async function POST(req, res) {
  if (req.method === "POST") {
    const client = new MongoClient(
      "mongodb+srv://sarvag:mUsgWnuspL5CghIv@talentmapp.iks0k0t.mongodb.net/?retryWrites=true&w=majority&appName=talentmapp",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    try {
      await client.connect();
      const db = client.db("tm-mvp");
      const collection = db.collection("profile");

      // Example: Generate a single profile
      const profile = {
      };

      // Generate embeddings for the profile
      const embeddings = await generateEmbeddings(profile.summary);

      // Insert the profile with embeddings into the database
      const result = await collection.insertOne({ ...profile, embeddings });
      res
        .status(200)
        .json({ message: `Inserted profile with ID: ${result.insertedId}` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
