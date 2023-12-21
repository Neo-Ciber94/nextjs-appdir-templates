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
import { AppError } from "@/lib/common/error";

const COOKIE_SESSION = "session-id";

type ActionResult = { error: string } | null;

export async function register(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
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

    if (err instanceof ZodError) {
      const error = err.issues[0]?.message || "Failed to create user";
      return { error };
    }

    if (err instanceof AppError) {
      return { error: err.message };
    }

    
    console.error(err);
    return { error: "Something went wrong" };
  }
}

export async function login(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
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

    if (err instanceof AppError) {
      return { error: err.message };
    }
    
    console.error(err);
    return { error: "Something went wrong" };
  }
}

export async function logout() {
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
}

export async function getUserSession() {
  const sessionToken = cookies().get(COOKIE_SESSION)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await getSession(sessionToken);
  return session;
}
