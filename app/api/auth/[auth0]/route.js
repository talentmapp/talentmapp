// import { handleAuth } from '@auth0/nextjs-auth0';

// export const GET = handleAuth();

import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';

export default handleAuth({
  async callback(req, res) {
    try {
      const session = await handleCallback(req, res);
      res.redirect('/search'); // Redirect to the /search route after login
    } catch (error) {
      console.error("Callback Error:", error);
      return new Response('Authentication callback failed', { status: 500 });
    }
  }
});
export const GET = handleAuth();