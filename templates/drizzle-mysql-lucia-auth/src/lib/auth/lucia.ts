import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { mysql2 } from "@lucia-auth/adapter-mysql";
import { pool } from "../db";
import { google } from "@lucia-auth/oauth/providers";

export const auth = lucia({
  adapter: mysql2(pool, {
    user: "user",
    key: "user_key",
    session: "user_session",
  }),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes(databaseUser) {
    return {
      username: databaseUser.username,
      imageUrl: databaseUser.image_url
    };
  },
});

export const googleAuth = google(auth, {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.REDIRECT_URL
    ? process.env.REDIRECT_URL
    : "http://localhost:3000/api/auth/google/callback",
});

export type Auth = typeof auth;
