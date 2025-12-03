import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";


const AdminPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/auth");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    // not allowed to access admin route
    return redirect("/");
  }

  // server checks completed, render client-side UI

  // render client-side admin UI component (it will fetch the users itself)
  return <AdminClient />;
};

export default AdminPage;
