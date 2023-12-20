"use server";

import { ZodError } from "zod";
import {
  CreateUserInput,
  LoginUserInput,
  createSession,
  createUser,
  getSession,
  loginUser,
  logoutUser,
} from "../services/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";

const COOKIE_SESSION = "session-id";

export async function register(formData: FormData) {
  try {
    const input = Object.fromEntries(formData) as CreateUserInput;
    const result = await createUser(input);
    const session = await createSession(result.id);

    cookies().set(COOKIE_SESSION, session.sessionToken, {
      maxAge: session.sessionExpiration.getTime(),
      httpOnly: true,
    });

    redirect("/");
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }

    console.error(err);

    if (err instanceof ZodError) {
      const message = err.issues[0]?.message || "Failed to create user";
      return { error: message };
    }

    return { error: "Something went wrong" };
  }
}

export async function login(formData: FormData) {
  try {
    const input = Object.fromEntries(formData) as LoginUserInput;
    const session = await loginUser(input);

    cookies().set(COOKIE_SESSION, session.sessionToken, {
      maxAge: session.sessionExpiration.getTime(),
      httpOnly: true,
    });

    redirect("/");
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }

    console.error(err);
    return { error: "Something went wrong" };
  }
}

export async function logout() {
  try {
    const sessionToken = cookies().get(COOKIE_SESSION)?.value;

    if (!sessionToken) {
      return;
    }

    const success = await logoutUser(sessionToken);
    cookies().delete(COOKIE_SESSION);

    if (success) {
      redirect("/login");
    } else {
      redirect("/");
    }
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }

    console.error(err);
    return { error: "Something went wrong" };
  }
}

export async function getUserSession() {
  const sessionToken = cookies().get(COOKIE_SESSION)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await getSession(sessionToken);
  return session;
}
