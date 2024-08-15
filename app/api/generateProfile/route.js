import axios from "axios";
import { MongoClient } from "mongodb";

const apiKey = process.env.NEW_OPENAI_API_KEY;

// Initialize MongoDB Client
let mongoClient;
const connectToDatabase = async () => {
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoClient.connect();
  }
  return mongoClient.db("tm-mvp");
};

// Step 1: Fetch Data from ProxyCurl
const fetchDataFromProxyCurl = async (linkedinUrl) => {
  const url = `https://nubela.co/proxycurl/api/v2/linkedin?url=${linkedinUrl}`;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.PROXYCURL_API_KEY}`,
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error fetching data from ProxyCurl:", error.response.data);
      return { error: error.response.data };
    } else {
      console.error("Error fetching data from ProxyCurl:", error.message);
      return { error: { code: 500, description: "Internal Server Error" } };
    }
  }
};

// Step 2: Data Cleaning and Conversion
const convertData = (inputData, userEmail) => {
  const outputData = {
    firstName: inputData.first_name || "",
    lastName: inputData.last_name || "",
    email: userEmail || "",
    phoneNumber: inputData.phone || "",
    profilePicture: inputData.profile_pic_url || "",
    summary: inputData.summary || "",
    location: inputData.city || "",
    experience: [],
    education: [],
    skills: inputData.skills || [],
    interests: inputData.interests || [],
    languages: [],
    socialMedia: [
      {
        LinkedIn: inputData.public_identifier || "",
      },
    ],
    visibility: {
      profile: true,
      email: false,
      phoneNumber: false,
    },
  };

  // Process experience
  if (inputData.experiences) {
    inputData.experiences.forEach((exp) => {
      outputData.experience.push({
        title: exp.title || "",
        company: exp.company || "",
        startDate: exp.starts_at
          ? `${exp.starts_at.year}-${exp.starts_at.month || "01"}-${exp.starts_at.day || "01"}`
          : "",
        endDate: exp.ends_at
          ? `${exp.ends_at.year}-${exp.ends_at.month || "01"}-${exp.ends_at.day || "01"}`
          : "",
        description: exp.description || "",
      });
    });
  }

  // Process education
  if (inputData.education) {
    inputData.education.forEach((edu) => {
      outputData.education.push({
        degree: edu.degree_name || "",
        major: edu.field_of_study || "",
        university: edu.school || "",
      });
    });
  }

  // Process languages
  if (inputData.languages) {
    inputData.languages.forEach((lang) => {
      outputData.languages.push({
        name: lang || "",
        proficiency: "Native or bilingual proficiency", // Default value
      });
    });
  }

  return outputData;
};

// Step 3: Create OpenAI Embedding
const createOpenAIEmbedding = async (profileData) => {
  const apiUrl = "https://api.openai.com/v1/embeddings";
  const model = "text-embedding-3-small";

  const fieldsToInclude = [
    "summary",
    "experience",
    "education",
    "skills",
    "interests",
  ];
  const selectedFields = fieldsToInclude.reduce((acc, field) => {
    acc[field] = profileData[field] || "";
    return acc;
  }, {});

  const textToEmbed = JSON.stringify(selectedFields);

  const requestBody = {
    model,
    input: [textToEmbed],
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    return response.data.data[0].embedding;
  } catch (error) {
    console.error("Error creating OpenAI embedding:", error.message);
    return null;
  }
};

// Step 4: Call OpenAI API for Summary
const callOpenAIForSummary = async (profile) => {
  const prompt = `
Generate a summary for this user profile. The summary should highlight the user's key achievements and skills and be limited to 100 words. Additionally, provide the 5 top strengths of the user profile. Each strength should be a maximum of 2 words, emphasizing the user's strengths based on the profile. The output should be in JSON format with two keys: customSummary and strengths. Strengths should be an array of strings ordered from top to low importance. Strengths can be a mix of soft and hard skills, with a higher emphasis on hard skills. Here is the profile data:
Summary: ${profile.summary}
Experience: ${JSON.stringify(profile.experience)}
Education: ${JSON.stringify(profile.education)}
Skills: ${JSON.stringify(profile.skills)}
Interests: ${JSON.stringify(profile.interests)}
`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful career coach that analyses profiles.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const aiContent = response.data.choices[0].message.content.trim();
    const jsonStart = aiContent.indexOf("{");
    const jsonEnd = aiContent.lastIndexOf("}") + 1;
    const jsonString = aiContent.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    return { error: "Failed to generate summary." };
  }
};

// Step 5: Update MongoDB
const insertOrUpdateProfileInMongoDB = async (updatedData) => {
  const db = await connectToDatabase();
  const collection = db.collection("profile");

  try {
    const existingProfile = await collection.findOne({
      email: updatedData.email,
    });

    if (existingProfile) {
      const lastGenerated = existingProfile.lastGenerated;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      if (lastGenerated && lastGenerated > oneWeekAgo) {
        return { error: "You can only generate your profile once a week." };
      }

      await collection.updateOne(
        { email: updatedData.email },
        { $set: { ...updatedData, lastGenerated: new Date() } },
      );
      console.log("Profile updated successfully.");
    } else {
      updatedData.lastGenerated = new Date();
      await collection.insertOne(updatedData);
      console.log("Profile inserted successfully.");
    }
    return { success: true };
  } catch (error) {
    console.error(
      "Error inserting/updating profile in MongoDB:",
      error.message,
    );
    return { error: "Database operation failed." };
  }
};

// Main Function: Integrate All Steps
const processLinkedInProfile = async (linkedinUrl, userEmail) => {
  // Step 1: Fetch Data
  const proxyCurlData = await fetchDataFromProxyCurl(linkedinUrl);
  if (proxyCurlData.error) {
    return { error: proxyCurlData.error.description };
  }

  // Step 2: Convert Data
  const profileData = convertData(proxyCurlData, userEmail);

  // Step 3: Create OpenAI Embedding
  const embedding = await createOpenAIEmbedding(profileData);
  if (!embedding) {
    return { error: "Failed to create embedding." };
  }
  profileData.embedding = embedding;

  // Step 4: Call OpenAI
  const openAIResponse = await callOpenAIForSummary(profileData);
  if (openAIResponse.error) {
    return { error: openAIResponse.error };
  }

  // Merge OpenAI response into profile data
  profileData.customSummary = openAIResponse.customSummary || "";
  profileData.strengths = openAIResponse.strengths || [];

  // Step 5: Update MongoDB
  const dbOperation = await insertOrUpdateProfileInMongoDB(profileData);
  if (dbOperation.error) {
    return { error: dbOperation.error };
  }

  return { success: true };
};

export async function POST(request) {
  try {
    const { linkedinUrl, userEmail } = await request.json();

    if (!linkedinUrl || !userEmail) {
      return new Response(
        JSON.stringify({ error: "LinkedIn URL and user email are required." }),
        { status: 400 },
      );
    }

    const result = await processLinkedInProfile(linkedinUrl, userEmail);

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error processing LinkedIn profile:", error.message);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }
}
