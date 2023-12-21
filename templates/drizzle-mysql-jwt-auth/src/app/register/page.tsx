import { getUserSession } from "@/lib/server/actions/auth.actions";
import { redirect } from "next/navigation";
import RegisterForm from "./registerForm";

export default async function RegisterPage() {
  const session = await getUserSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <RegisterForm />
    </div>
  );
}
