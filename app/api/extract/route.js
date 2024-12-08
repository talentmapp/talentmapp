import axios from "axios";
import { MongoClient } from "mongodb";

async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return client.db("tm-mvp");
}

export async function POST(req) {
  try {
    const { query, limit = 12, offset = 0 } = await req.json();
    const OPENAI_API_KEY = process.env.NEW_OPENAI_API_KEY;

    // OpenAI API call to extract entities and understand user intent
    const entityExtractionPrompt = `Extract the following from the query and make sure the ressponse is only the below in a subheading, content format with space and formatting between each section: ${query}\n
    - Skill(s)
    - Requirement(s)
    - List of Priorities (skills, tasks, ect.) needed in most to least important
    - Purpose
    - Context
    - Urgency
    - Seriousness vs Sillyness of the prompt
    - Companies mentioned
    - Industry
    - Similar companies
    - Similar skills
    - Personality type matching the requirement
    - Experience needed
    - Insights on the person searching
    - Typos and their likely correction`;

    // OpenAI API call for entity extraction
    const entityResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert in understanding user queries for a professional networking platform. Your task is to extract key information such as skills, companies, roles, context, and other relevant attributes from user inputs.",
          },
          { role: "user", content: entityExtractionPrompt },
        ],
        max_tokens: 512,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    );

    const extractedEntities =
      entityResponse.data.choices[0].message.content.trim();
    const entityTokensUsed = entityResponse.data.usage.total_tokens; // Tokens for entity extraction

    // Step 2: Vector Search for Semantic Matching
    const db = await connectToDatabase();
    const collection = db.collection("profile");

    const queryEmbedding = await generateEmbeddings(query);
    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: offset + limit, // ensure enough candidates
          limit: offset + limit, // return a large enough subset
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          profilePicture: 1,
          experience: 1,
          skills: 1,
          strengths: 1,
          education: 1,
          interests: 1,
          socialMedia: 1,
          customSummary: 1,
          location: 1,
          relevancyScore: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const matchingProfiles = await collection.aggregate(pipeline).toArray();

    // Step 3: Scoring profiles based on entity matching
    const enrichedProfiles = matchingProfiles.map((profile) => {
      let entityScore = 0;
      const feedback = [];
      const strengths = [];
      const weaknesses = [];

      // Extracting the person's full name
      const fullName = `${profile.firstName} ${profile.lastName}`;

      // Extracted Entities broken down for checking specifics
      const requiredSkills = extractedEntities.skills || []; // Extracted required skills
      const requiredCompanies = extractedEntities.companies || []; // Extracted required companies
      const requiredEducation = extractedEntities.education || []; // Extracted required education

      // Skill Match - More specific checking for unmet skills
      const profileSkills = profile.skills || [];
      const missingSkills = requiredSkills.filter(
        (skill) => !profileSkills.includes(skill),
      );

      if (missingSkills.length === 0 && profileSkills.length > 0) {
        entityScore += 0.6;
        feedback.push(
          `Their skills in ${profile.skills.join(", ")} are directly relevant.`,
        );
        strengths.push("Skills");
      } else {
        weaknesses.push(
          `Lacks the required skills: ${missingSkills.join(", ") || "not specified"}`,
        );
      }

      // Company Match - More specific checking for unmet companies
      const profileCompanies =
        profile.experience?.map((exp) => exp.company) || [];
      const missingCompanies = requiredCompanies.filter(
        (company) => !profileCompanies.includes(company),
      );

      if (missingCompanies.length === 0 && profileCompanies.length > 0) {
        entityScore += 0.5;
        feedback.push(
          `Their experience at companies like ${profileCompanies
            .slice(0, 2) // Limit to 2 companies for brevity
            .join(", ")} strongly aligns with the requirements.`,
        );
        strengths.push("Company experience");
      } else {
        weaknesses.push(
          `No experience at required companies: ${missingCompanies.join(", ") || "not specified"}`,
        );
      }

      // Education Match - More specific checking for unmet education
      const profileEducation =
        profile.education?.map((edu) => edu.university) || [];
      const missingEducation = requiredEducation.filter(
        (edu) => !profileEducation.includes(edu),
      );

      if (missingEducation.length === 0 && profileEducation.length > 0) {
        entityScore += 0.4;
        feedback.push(
          `Their education at ${profileEducation.join(", ")} gives them a strong foundation.`,
        );
        strengths.push("Education");
      } else {
        weaknesses.push(
          `Education doesn't match the required background: ${missingEducation.join(", ") || "not specified"}`,
        );
      }

      // Custom Summary insights (removing first-person references)
      const summaryInsights = profile.customSummary
        ? `${fullName}'s background as ${profile.customSummary} demonstrates expertise in relevant areas.`
        : "No custom summary available.";

      // Normalize the profile's relevancy score and entity score
      const normalizedRelevancyScore = Math.min(profile.relevancyScore, 1);
      const normalizedEntityScore = Math.min(entityScore, 1);

      // Generating a shorter, engaging, and non-redundant reason
      const reason = `
        ${fullName} stands out due to their strong skill set in ${profile.skills?.join(", ") || "various areas"}.
        Their experience at top companies like ${profile.experience
          ?.map((exp) => exp.company)
          .slice(0, 2)
          .join(", ")} further highlights their fit for the role.
        ${summaryInsights}
        ${feedback.length > 0 ? feedback.join(" ") : `${fullName} brings a versatile and suitable background for this role.`}
      `;

      // Overall score combining normalized entity and vector search relevancy (both capped at 1)
      const combinedScore = Math.min(
        normalizedRelevancyScore * 0.5 + normalizedEntityScore * 0.5,
        1,
      );

      // Create final profile object with strongest matches highlighted and weaknesses shown
      return {
        ...profile,
        combinedScore,
        reason: reason.trim(), // More focused, concise reason
        strongestMatches:
          strengths.length > 0
            ? strengths.join(", ")
            : "No specific strong match",
        unmetRequirements:
          weaknesses.length > 0
            ? weaknesses.join(", ")
            : "No significant unmet requirements",
      };
    });

    // Step 4: Sorting by combined score
    const sortedProfiles = enrichedProfiles.sort(
      (a, b) => b.combinedScore - a.combinedScore,
    );

    // OpenAI API call to generate 3 additional query suggestions
    const suggestionPrompt = `Based on this query: "${query}", generate 3 follow-up queries that strictly focus on finding people or profiles. Ensure that the suggestions involve connecting with individuals, teams, or specific types of experts relevant to the original search query. Do not include queries that are about informational or non-person related resources.`;

    const suggestionResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert in understanding user queries for a professional networking platform. Your task is to generate people-centric follow-up queries. These should focus strictly on helping users find people, profiles, or teams relevant to their original query.",
          },
          { role: "user", content: suggestionPrompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    );

    const generatedSuggestions =
      suggestionResponse.data.choices[0].message.content
        .trim()
        .split("\n")
        .filter(Boolean); // Splitting into an array of people-focused queries

    const suggestionTokensUsed = suggestionResponse.data.usage.total_tokens; // Tokens for suggestions

    // Calculate total tokens used
    const totalTokensUsed = entityTokensUsed + suggestionTokensUsed;

    // Step 5: Return response with enriched profile data, extracted entities, suggestions, and token usage
    return new Response(
      JSON.stringify({
        entities: extractedEntities, // Return extracted entities
        suggestions: generatedSuggestions, // Return generated suggestions
        profiles: sortedProfiles, // Return enriched and sorted profiles
        totalTokensUsed, // Return the total tokens used
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error with OpenAI API or DB:", error);
    return new Response(
      JSON.stringify({ message: "Failed to process the query" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

// Helper function to generate embeddings for query
async function generateEmbeddings(text) {
  const token = process.env.NEW_OPENAI_API_KEY;
  const response = await axios.post(
    "https://api.openai.com/v1/embeddings",
    {
      model: "text-embedding-3-small",
      input: text,
      dimensions: 512,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data.data[0].embedding;
}
