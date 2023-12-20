import { z } from "zod";
import { db } from "../db";
import bcrypt from "bcrypt";
import { user, userAccount, userSession } from "../db/schema";
import { and, eq, isNull, not, sql } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";

const SESSION_DURATION = 1000 * 60 * 60 * 24; // 24 hours

const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export async function createUser(input: CreateUserInput) {
  const { email, password, username } = createUserSchema.parse(input);
  const passwordHash = await bcrypt.hash(password, 10);

  const { userId } = await db.transaction(async (tx) => {
    const userId = crypto.randomUUID();
    await tx.insert(user).values({
      id: userId,
      username,
    });

    await tx.insert(userAccount).values({
      email,
      userId,
      passwordHash,
    });

    return { userId };
  });

  const newUser = await db.query.user.findFirst({ where: eq(user.id, userId) });

  if (!newUser) {
    throw new Error("Failed to find newly created user");
  }

  return newUser;
}

export type LoginUserInput = z.infer<typeof loginUserSchema>;

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function loginUser(input: LoginUserInput) {
  const { email, password } = loginUserSchema.parse(input);

  const resultUserAccount = await db.query.userAccount.findFirst({
    where: eq(userAccount.email, email),
    with: {
      user: true,
    },
  });

  if (resultUserAccount == null) {
    throw new Error("Invalid email or password");
  }

  if (!(await bcrypt.compare(password, resultUserAccount.passwordHash))) {
    throw new Error("Invalid email or password");
  }

  const { sessionExpiration, sessionToken } = await createSession(
    resultUserAccount.userId
  );

  await deleteUserExpiredSessions(resultUserAccount.userId);

  return {
    user: resultUserAccount.user,
    sessionExpiration,
    sessionToken,
  };
}

export async function getSession(token: string) {
  const session = await verifySessionToken(token);

  if (!session) {
    return null;
  }

  const result = await db.query.userSession.findFirst({
    where: eq(userSession.id, session.sessionId),
    with: {
      user: true,
    },
  });

  if (!result) {
    return null;
  }

  const { user, ...rest } = result;

  if (user == null) {
    return null;
  }

  return { user, ...rest };
}

export async function logoutUser(token: string) {
  const session = await getSession(token);

  if (!session) {
    return false;
  }

  await deleteUserExpiredSessions(session.userId);
  return true;
}

async function deleteUserExpiredSessions(userId: string) {
  await db
    .delete(userSession)
    .where(
      and(
        not(isNull(userSession.expiresAt)),
        eq(userSession.userId, userId),
        sql`${new Date()} > ${userSession.expiresAt}`
      )
    );
}

export async function createSession(userId: string) {
  const sessionExpiration = new Date(Date.now() + SESSION_DURATION);
  const sessionId = crypto.randomUUID();
  await db.insert(userSession).values({
    id: sessionId,
    userId,
    expiresAt: sessionExpiration,
  });

  const sessionToken = await createSessionToken(
    { sessionId },
    sessionExpiration
  );
  return { sessionId, sessionExpiration, sessionToken };
}

type SessionPayload = {
  sessionId: string;
};

async function createSessionToken(payload: SessionPayload, expiresAt?: Date) {
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
  let jwtEncrypt = new SignJWT(payload)
    .setIssuer("iss:my-app")
    .setAudience("aud:my-app")
    .setProtectedHeader({
      alg: "HS256",
    });

  if (expiresAt) {
    jwtEncrypt = jwtEncrypt.setExpirationTime(expiresAt);
  }

  const sessionToken = await jwtEncrypt.sign(secretKey);
  return sessionToken;
}

async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);

  try {
    const result = await jwtVerify<SessionPayload>(token, secretKey);
    return result.payload;
  } catch (err) {
    console.error(err);
    return null;
  }
}
