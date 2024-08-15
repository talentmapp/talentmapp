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
          scope: "openid profile email",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const db = await connectToDatabase();
      const collection = db.collection("profile");

      const existingUser = await collection.findOne({ email: profile.email });

      if (existingUser) {
        return true;
      } else {
        const newUser = {
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          profilePicture: profile.picture,
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
    async redirect({ url, baseUrl }) {
      // console.log("Redirect Callback:", { url, baseUrl });
      return baseUrl;
    },
    async session({ session, token }) {
      // console.log("Session Callback:", { session, token });
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.picture,
      };
      return session;
    },
    async jwt({ token, account, profile }) {
      // console.log("JWT Callback:", { token, account, profile });
      if (account) {
        token.id = profile.sub;
        token.name = profile.name;
        token.email = profile.email;
        token.picture = profile.picture;
      }
      return token;
    },
  },
  debug: true, // Enable debug mode
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
