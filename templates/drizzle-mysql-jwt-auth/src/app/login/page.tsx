import { getUserSession } from "@/lib/server/actions/auth.actions";
import { redirect } from "next/navigation";
import LoginForm from "./loginForm";

export default async function LoginPage() {
  const session = await getUserSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  );
}
