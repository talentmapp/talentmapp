import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();

// import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';

// export async function GET(req) {
//   try {
//     // Handle the Auth0 callback
//     const response = await handleCallback(req, res);
    
//     // Redirect to the desired path after successful login
//     return new Response(null, {
//       status: 302,
//       headers: {
//         Location: '/search',
//       },
//     });
//   } catch (error) {
//     console.error('Callback handler failed:', error);
//     return new Response(error.message, { status: 500 });
//   }
// }



