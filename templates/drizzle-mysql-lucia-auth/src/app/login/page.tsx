import { getUserSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getUserSession();

  if (session) {
    redirect("/");
  }

  return (
    <div>
      <a href="/api/auth/google/login">Login with Google</a>
    </div>
  );
}
