import { auth, googleAuth } from "@/lib/auth/lucia";
import { OAuthRequestError } from "@lucia-auth/oauth";
import * as context from "next/headers";
import { cookies, headers } from "next/headers";

export const GET = (req: Request) => {
  const url = new URL(req.url);

  switch (url.pathname) {
    case "/api/auth/google/login":
      return handleSignup();
    case "/api/auth/google/logout":
      return handleLogout(req);
    case "/api/auth/google/callback":
      return handleCallback(req);
    default:
      return new Response(null, { status: 404 });
  }
};

async function handleSignup() {
  const [authUrl, state] = await googleAuth.getAuthorizationUrl();

  // store state
  context.cookies().set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 3600, // 1 hour
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
    },
  });
}

async function handleLogout(req: Request) {
  const authRequest = auth.handleRequest(req.method, context);
  // check if user is authenticated
  const session = await authRequest.validate();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);

  // delete session cookie
  authRequest.setSession(null);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login", // redirect to login page
    },
  });
}

async function handleCallback(req: Request) {
  const storedState = cookies().get("google_oauth_state")?.value;
  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const { getExistingUser, googleUser, createUser } =
      await googleAuth.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: {
          username: googleUser.name,
          image_url: googleUser.picture,
        },
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(req.method, {
      cookies,
      headers,
    });
    authRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (err) {
    console.error(err);

    if (err instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
