import axios from "axios";
import NextAuth from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
  return client.db("tm-mvp");
};

// Fetch LinkedIn Profile using the access token
const fetchLinkedInProfile = async (accessToken) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await axios.get("https://api.linkedin.com/v2/me", {
      headers,
    });

    // Only return if vanityName is present
    if (!response.data.vanityName) {
      throw new Error("LinkedIn vanity name is missing.");
    }

    return {
      vanityName: response.data.vanityName,
      firstName: response.data.localizedFirstName,
      lastName: response.data.localizedLastName,
    };
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error);
    return null; // Return null in case of error
  }
};

const authOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      client: { token_endpoint_auth_method: "client_secret_post" },
      issuer: "https://www.linkedin.com",
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }),
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email r_basicprofile",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      const db = await connectToDatabase();
      const collection = db.collection("profile");

      // Fetch vanityName and profile details from LinkedIn
      const linkedinProfile = await fetchLinkedInProfile(account.access_token);

      // If vanityName is not present, halt the sign-in process
      if (!linkedinProfile || !linkedinProfile.vanityName) {
        console.error("Vanity name is missing for the user.");
        return false;
      }

      const existingUser = await collection.findOne({ email: profile.email });

      if (existingUser) {
        // Update LinkedIn vanityName in socialMedia if it's not present in the existing user's data
        if (!existingUser.socialMedia || !existingUser.socialMedia.LinkedIn) {
          await collection.updateOne(
            { email: profile.email },
            { $set: { "socialMedia.LinkedIn": linkedinProfile.vanityName } },
          );
        }
        return true;
      } else {
        const newUser = {
          firstName: linkedinProfile.firstName,
          lastName: linkedinProfile.lastName,
          email: profile.email,
          profilePicture: profile.picture,
          socialMedia: {
            LinkedIn: linkedinProfile.vanityName, // Store vanityName in socialMedia
          },
          customSummary: "",
          education: [],
          experience: [],
          interests: [],
          skills: [],
          location: "",
          visibility: { profile: true, email: false, phoneNumber: false },
        };

        await collection.insertOne(newUser);
        return true;
      }
    },
    async session({ session, token }) {
      session.user.id = token.id; // Store MongoDB user ID in the session
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.picture;
      session.user.vanityName = token.vanityName; // Store vanityName in session
      return session;
    },
    async jwt({ token, account, profile }) {
      const db = await connectToDatabase();
      const collection = db.collection("profile");

      const userFromDb = await collection.findOne({ email: token.email });

      if (userFromDb) {
        token.id = userFromDb._id; // Store MongoDB _id in token
        token.vanityName = userFromDb.socialMedia?.LinkedIn; // Store vanityName from DB in token
      }

      return token;
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
