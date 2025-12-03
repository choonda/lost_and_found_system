import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  redirect("/home");
  return (
    <div>
      <h1>Welcome to 0nce Lost and Found</h1>
    </div>
  );
}
