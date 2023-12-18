import { getUserSession } from "@/lib/auth/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getUserSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white p-8 rounded shadow-md">
        <div className="flex flex-row gap-2 items-center">
          <div className="relative w-16 h-16">
            <Image
              src={session.user.imageUrl}
              alt={session.user.username}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold">Hello</h1>
          <h1 className="text-2xl font-bold text-blue-800">
            {session.user.username}
          </h1>
        </div>

        <a
          href="/api/auth/google/logout"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full block text-center mt-4"
        >
          Logout
        </a>
      </div>
    </div>
  );
}
