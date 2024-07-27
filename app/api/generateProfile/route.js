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
                  exp.endDate
              )
              .join(", "),
            profile.education
              .map(
                (edu) =>
                  edu.degree + " in " + edu.major + " from " + edu.university
              )
              .join(", "),
            profile.languages.map((lang) => "can speak" + lang.name).join(", "),
          ].join(" ");

          const embeddings = await generateEmbeddings(textToEmbed);

          const embeddingVector = embeddings.data[0].embedding;

          return collection.insertOne({
            ...profile,
            embedding: embeddingVector,
          });
        })
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

// {"_id":{"$oid":"661926b17c7ed26289a39684"},"firstName":"Priya","lastName":"Sharma","email":"priya.sharma@example.com","phoneNumber":"+919876543210","profilePicture":"https://example.com/priya-sharma-picture.jpg","summary":"Full-Stack Web Developer with expertise in JavaScript and React.","location":"Mumbai, Maharashtra","experience":[{"title":"Full-Stack Developer","company":"WebTech Solutions","startDate":"2015-07-01","endDate":"2023-01-01","description":"Developed and maintained web applications using React and Node.js.","current":false}],"education":[{"institution":"VIT University","degree":"Bachelor of Technology in Computer Science","fieldOfStudy":"Software Engineering","startDate":"2011-07-01","endDate":"2015-06-01","description":"Graduated with honors."}],"skills":[{"name":"JavaScript","proficiency":"Expert"},{"name":"React","proficiency":"Expert"},{"name":"Node.js","proficiency":"Advanced"}],"certifications":[{"name":"MongoDB Certified Developer","issuer":"MongoDB University","date":"2020-06-01"}],"projects":[{"name":"E-commerce Platform","description":"Developed an e-commerce platform using React and Node.js.","url":"https://ecommerce-platform.com","startDate":"2018-01-01","endDate":"2018-12-31"}],"languages":[{"name":"English","proficiency":"Native"},{"name":"Hindi","proficiency":"Native"}],"interests":["Web Development","JavaScript","React"],"socialMedia":[{"platform":"LinkedIn","url":"https://www.linkedin.com/in/priya-sharma"},{"platform":"GitHub","url":"https://github.com/priya-sharma"}],"visibility":{"profile":true,"email":false,"phoneNumber":false},"createdAt":"2024-04-07T11:45:26.884Z","updatedAt":"2024-04-07T11:45:26.885Z"}}
