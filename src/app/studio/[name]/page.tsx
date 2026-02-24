import { notFound } from "next/navigation";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import StudioClient from "@/components/StudioClient";
import { getStudioByName } from "@/lib/actions";
import { auth } from "@/lib/auth";

interface StudioPageProps {
  params: Promise<{ name: string }>;
}

export default async function StudioPage({ params }: StudioPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const studio = await getStudioByName(decodedName);

  if (!studio) {
    notFound();
  }

  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role ?? null;
  const userId = session?.user?.id ?? null;

  return (
    <>
      <Link href="/" className="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Studios
      </Link>

      <SectionTitle text={`${studio.name} Studios`} />

      <StudioClient studio={studio} role={role} userId={userId} />

      {studio.series.length === 0 && (
        <p className="empty-studio">No series added yet.</p>
      )}
    </>
  );
}
