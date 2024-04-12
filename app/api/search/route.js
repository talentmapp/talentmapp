"use server";
import { MongoClient, ServerApiVersion } from "mongodb";
import { NextResponse } from "next/server";

let client;
const uri =
  "mongodb+srv://sarvag:mUsgWnuspL5CghIv@talentmapp.iks0k0t.mongodb.net/?retryWrites=true&w=majority&appName=talentmapp";

const connectToDatabase = async () => {
  if (client && client.isConnected()) {
    return client.db("tm-mvp"); // Specify your database name here
  }

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    },
  });

  await client.connect();
  return client.db("tm-mvp"); // Specify your database name here
};

// function adjustVectorDimensions(queryVector, targetDimensions) {
//   // Clean the vector by replacing NaN and Infinity values with a default value (e.g., 0)
//   const cleanedVector = queryVector.map((value) => {
//     if (isNaN(value) || !isFinite(value)) {
//       return 0; // Replace with a default value or remove the element
//     }
//     return value;
//   });

//   // Adjust the vector dimensions
//   if (cleanedVector.length < targetDimensions) {
//     return cleanedVector.concat(
//       Array(targetDimensions - cleanedVector.length).fill(0)
//     );
//   } else if (cleanedVector.length > targetDimensions) {
//     return cleanedVector.slice(0, targetDimensions);
//   }
//   // If the vector is already the correct length, return it as is
//   return cleanedVector;
// }

export async function POST(req, res) {
  if (req.method === "POST") {
    try {
      const { message } = req.body;
      const apiKey = "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";
      const url = "https://api.openai.com/v1/chat/completions";
      const body = JSON.stringify({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "javascript" },
        ],
        model: "gpt-3.5-turbo",
        stream: false,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error("OpenAI API request failed");
      }

      const data = await response.json();
      console.log("OpenAI API response:", data);

      const processedMessage = data.choices[0].message.content;

      // const queryVector = processedMessage.split(" ").map(Number);
      // const adjustedQueryVector = adjustVectorDimensions(queryVector, 1536);

      const db = await connectToDatabase();
      const collection = db.collection("profile");
      const matchingProfiles = await collection
        .aggregate([
          {
            $search: {
              index: "default",
              text: {
                query: processedMessage,
                path: {
                  wildcard: "*",
                },
              },
            },
          },
          {
            $limit: 1,
          },
        ])
        .toArray();

      console.log("Matching profiles:", matchingProfiles);

      return new NextResponse(JSON.stringify(matchingProfiles), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error:", error);
      // Return a 500 error response
      return new NextResponse(
        JSON.stringify({
          error: "Failed to search profiles or interact with OpenAI",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    // Return a 405 Method Not Allowed response
    return new NextResponse(null, {
      status: 405,
    });
  }
}
