import { getUserSession } from "@/lib/auth/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getUserSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <Image
          src={session.user.imageUrl}
          alt={session.user.username}
          width={64}
          height={64}
        />
        <h1>Hello {session.user.username}</h1>
      </div>

      <a href="/api/auth/google/logout">Logout</a>
    </div>
  );
}
