import Link from "next/link";
import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          danylevskii<span className="navbar-logo-dot">.space</span>
        </Link>
        <UserMenu
          user={
            session?.user
              ? {
                  name: session.user.name,
                  role: (session.user as { role?: string }).role,
                }
              : null
          }
        />
      </div>
    </nav>
  );
}
