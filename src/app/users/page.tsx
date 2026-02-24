import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllUsers } from "@/lib/actions";
import SectionTitle from "@/components/ui/SectionTitle";
import UsersClient from "@/components/UsersClient";

export default async function UsersPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  // Only superadmin can access — otherwise redirect silently
  if (!session?.user || role !== "SUPERADMIN") {
    redirect("/");
  }

  const users = await getAllUsers();

  if (!users) {
    redirect("/");
  }

  return (
    <>
      <SectionTitle text="Users" />
      <UsersClient users={users} currentUserId={session.user.id} />
    </>
  );
}
