import SectionTitle from "@/components/ui/SectionTitle";
import HomeClient from "@/components/HomeClient";
import { getStudios } from "@/lib/actions";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const studios = await getStudios();
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role ?? null;

  return (
    <>
      <SectionTitle text="Choose a Studio" />
      <HomeClient studios={studios} role={role} />
    </>
  );
}
