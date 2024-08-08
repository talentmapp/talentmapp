import NextAuth, {NextAuthOptions} from "next-auth/next";
import LinkedInProvider from "next-auth/providers/linkedin"

export const authOptions = {
    providers: [
        LinkedInProvider({
            clientId: String(process.env.LINKEDIN_CLIENT_ID),
            clientSecret: String(process.env.LINKEDIN_SECRET_ID),
            authorization: {
                params: {scope: "openid profile email"}
            },
            issuer: "https://www.linkedin.com",
            jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
            profile(profile, tokens) {
              const defaultImage =
                "https://cdn-icons-png.flaticon.com/512/174/174857.png";
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture ?? defaultImage,
              };
            },
        })
    ]
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };