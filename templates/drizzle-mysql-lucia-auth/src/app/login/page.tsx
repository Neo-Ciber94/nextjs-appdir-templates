import { getUserSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getUserSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <a
          href="/api/auth/google/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full block text-center"
        >
          Login with Google
        </a>
      </div>
    </div>
  );
}
