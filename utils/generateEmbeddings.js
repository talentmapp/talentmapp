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
    firstName: "Akshay",
    lastName: "Kumar",
    email: "akshay.kumar@example.com",
    phoneNumber: "+911234567890",
    profilePicture: "https://example.com/akshay-kumar-picture.jpg",
    summary:
      "AI Engineer with expertise in machine learning and deep learning.",
    location: "Bengaluru, Karnataka",
    experience: [
      {
        title: "AI Engineer",
        company: "TechInnovate",
        startDate: "2016-07-01",
        endDate: "2023-01-01",
        description:
          "Developed AI models for predictive analytics and natural language processing.",
        current: false,
      },
    ],
    education: [
      {
        institution: "IIT Madras",
        degree: "Master of Technology in Artificial Intelligence",
        fieldOfStudy: "Computer Science",
        startDate: "2012-07-01",
        endDate: "2016-06-01",
        description: "Graduated with honors.",
      },
    ],
    skills: [
      { name: "Python", proficiency: "Expert" },
      { name: "TensorFlow", proficiency: "Expert" },
      { name: "PyTorch", proficiency: "Advanced" },
    ],
    certifications: [
      {
        name: "Google Cloud Certified - Professional Data Engineer",
        issuer: "Google Cloud",
        date: "2021-06-01",
      },
    ],
    projects: [
      {
        name: "AI Chatbot",
        description: "Developed a chatbot using NLP for customer service.",
        url: "https://ai-chatbot.com",
        startDate: "2019-01-01",
        endDate: "2019-12-31",
      },
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "Hindi", proficiency: "Native" },
    ],
    interests: ["Artificial Intelligence", "Machine Learning", "Data Science"],
    socialMedia: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/akshay-kumar" },
      { platform: "GitHub", url: "https://github.com/akshay-kumar" },
    ],
    visibility: { profile: true, email: false, phoneNumber: false },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
