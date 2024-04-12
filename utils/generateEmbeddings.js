"use server";
const { MongoClient } = require("mongodb");
const axios = require("axios");
export async function generateEmbeddings(text) {
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
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@example.com",
    phoneNumber: "+919876543219",
    profilePicture: "https://example.com/rajesh-kumar-picture.jpg",
    summary: "DevOps Engineer with expertise in Docker and Kubernetes.",
    location: "Hyderabad, Telangana",
    experience: [
      {
        title: "DevOps Engineer",
        company: "DevOps Solutions",
        startDate: "2014-01-01",
        endDate: "2023-01-01",
        description:
          "Managed CI/CD pipelines and containerized applications using Docker and Kubernetes.",
        current: false,
      },
    ],
    education: [
      {
        institution: "NIT Warangal",
        degree: "Bachelor of Technology in Computer Science",
        fieldOfStudy: "Software Engineering",
        startDate: "2009-01-01",
        endDate: "2013-01-01",
        description: "Graduated with honors.",
      },
    ],
    skills: [
      {
        name: "Docker",
        proficiency: "Expert",
      },
      {
        name: "Kubernetes",
        proficiency: "Expert",
      },
      {
        name: "Ansible",
        proficiency: "Advanced",
      },
    ],
    certifications: [
      {
        name: "Certified Kubernetes Administrator",
        issuer: "CNCF",
        date: "2019-06-01",
      },
    ],
    projects: [
      {
        name: "Microservices Deployment",
        description:
          "Deployed microservices architecture using Docker and Kubernetes.",
        url: "https://microservices-deployment.com",
        startDate: "2019-01-01",
        endDate: "2019-12-31",
      },
    ],
    languages: [
      {
        name: "English",
        proficiency: "Native",
      },
      {
        name: "Hindi",
        proficiency: "Native",
      },
    ],
    interests: ["DevOps", "Docker", "Kubernetes"],
    socialMedia: [
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/rajesh-kumar",
      },
      {
        platform: "GitHub",
        url: "https://github.com/rajesh-kumar",
      },
    ],
    visibility: {
      profile: true,
      email: false,
      phoneNumber: false,
    },
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

    // Extract the embedding vector from the embeddings object
    const embeddingVector = embeddings.data[0].embedding;

    // Insert the profile with the embedding vector into the database
    const result = await collection.insertOne({
      ...profile,
      embedding: embeddingVector,
    });
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
