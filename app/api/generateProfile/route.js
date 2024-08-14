"use server";
import { MongoClient } from "mongodb";
import { generateEmbeddings } from "../../../utils/generateEmbeddings"; // Adjust the import path as necessary

export async function POST(req, res) {
  if (req.method === "POST") {
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      await client.connect();
      const db = client.db("tm-mvp");
      const collection = db.collection("profile");

      const profiles = [];

      const results = await Promise.all(
        profiles.map(async (profile) => {
          const textToEmbed = [
            profile.firstName,
            profile.lastName,
            ...profile.skills
              .map((skill) => `${skill.name} (${skill.proficiency})`)
              .join(", "),
            profile.summary,
            profile.interests.join(", "),
            profile.experience
              .map(
                (exp) =>
                  exp.title +
                  " at " +
                  exp.company +
                  " from " +
                  exp.startDate +
                  " to " +
                  exp.endDate,
              )
              .join(", "),
            profile.education
              .map(
                (edu) =>
                  edu.degree + " in " + edu.major + " from " + edu.university,
              )
              .join(", "),
          ].join(" ");

          const embeddings = await generateEmbeddings(textToEmbed);

          const embeddingVector = embeddings.data[0].embedding;

          return collection.insertOne({
            ...profile,
            embedding: embeddingVector,
          });
        }),
      );

      res.status(200).json({ message: `Inserted ${results.length} profiles` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
