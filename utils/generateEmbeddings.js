"use server";
const { MongoClient } = require("mongodb");
const axios = require("axios");
async function generateEmbeddings(text) {
  const token = "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"; // Replace with your actual OpenAI API key
  const model = "text-embedding-ada-002"; // The model to use for generating embeddings

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: text,
        model: model,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    return response.data; // This should be the embeddings array
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate embeddings");
  }
}

// Function to generate a new profile
function generateProfile() {
  return {
  };
}

// Function to insert a profile into the database and generate embeddings
async function insertProfileWithEmbeddings(profile) {
  const client = new MongoClient(
    "mongodb+srv://sarvag:mUsgWnuspL5CghIv@talentmapp.iks0k0t.mongodb.net/?retryWrites=true&w=majority&appName=talentmapp",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  try {
    await client.connect();
    const db = client.db("tm-mvp");
    const collection = db.collection("profile");

    // Generate embeddings for the profile
    const embeddings = await generateEmbeddings(profile.summary);

    // Insert the profile with embeddings into the database
    const result = await collection.insertOne({ ...profile, embeddings });
    console.log(`Inserted profile with ID: ${result.insertedId}`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

// Generate and insert multiple profiles
async function main() {
  const profiles = Array.from({ length: 1 }, generateProfile); // Generate 10 profiles
  for (const profile of profiles) {
    await insertProfileWithEmbeddings(profile);
  }
}

main().catch(console.error);
