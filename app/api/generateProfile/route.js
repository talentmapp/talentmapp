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
       }
       
      // Generate embeddings for the profile
      const embeddings = await generateEmbeddings(profile.summary);

      // Extract the embedding vector from the embeddings object
      const embeddingVector = embeddings.data[0].embedding;

      // Insert the profile with the embedding vector into the database
      const result = await collection.insertOne({ ...profile, embedding: embeddingVector });
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

// {"_id":{"$oid":"661926b17c7ed26289a39684"},"firstName":"Priya","lastName":"Sharma","email":"priya.sharma@example.com","phoneNumber":"+919876543210","profilePicture":"https://example.com/priya-sharma-picture.jpg","summary":"Full-Stack Web Developer with expertise in JavaScript and React.","location":"Mumbai, Maharashtra","experience":[{"title":"Full-Stack Developer","company":"WebTech Solutions","startDate":"2015-07-01","endDate":"2023-01-01","description":"Developed and maintained web applications using React and Node.js.","current":false}],"education":[{"institution":"VIT University","degree":"Bachelor of Technology in Computer Science","fieldOfStudy":"Software Engineering","startDate":"2011-07-01","endDate":"2015-06-01","description":"Graduated with honors."}],"skills":[{"name":"JavaScript","proficiency":"Expert"},{"name":"React","proficiency":"Expert"},{"name":"Node.js","proficiency":"Advanced"}],"certifications":[{"name":"MongoDB Certified Developer","issuer":"MongoDB University","date":"2020-06-01"}],"projects":[{"name":"E-commerce Platform","description":"Developed an e-commerce platform using React and Node.js.","url":"https://ecommerce-platform.com","startDate":"2018-01-01","endDate":"2018-12-31"}],"languages":[{"name":"English","proficiency":"Native"},{"name":"Hindi","proficiency":"Native"}],"interests":["Web Development","JavaScript","React"],"socialMedia":[{"platform":"LinkedIn","url":"https://www.linkedin.com/in/priya-sharma"},{"platform":"GitHub","url":"https://github.com/priya-sharma"}],"visibility":{"profile":true,"email":false,"phoneNumber":false},"createdAt":"2024-04-07T11:45:26.884Z","updatedAt":"2024-04-07T11:45:26.885Z"}}
