"use client";

import Image from "next/image";
import Link from "next/link";
import { deleteStudioAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Studio {
  id: string;
  name: string;
  logoPath: string;
}

interface StudioGridProps {
  studios: Studio[];
  isAdminActive: boolean;
}

/* Grid pattern: 5-4-4-5 repeating = 18 max */
export default function StudioGrid({ studios, isAdminActive }: StudioGridProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Split into rows following the 5-4-4-5 pattern
  const rows: Studio[][] = [];
  const pattern = [5, 4, 4, 5];
  let idx = 0;

  for (let i = 0; idx < studios.length; i++) {
    const rowSize = pattern[i % pattern.length];
    rows.push(studios.slice(idx, idx + rowSize));
    idx += rowSize;
  }

  const handleDelete = async (studioId: string, studioName: string) => {
    if (!confirm(`Delete studio "${studioName}" and ALL its series? This cannot be undone.`)) {
      return;
    }

    setDeletingId(studioId);
    await deleteStudioAction(studioId);
    setDeletingId(null);
    router.refresh();
  };

  return (
    <div className="studio-grid">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="studio-grid-row"
        >
          {row.map((studio) => (
            <div key={studio.id} className="studio-card-wrapper">
              <Link
                href={`/studio/${encodeURIComponent(studio.name)}`}
                className="studio-card"
              >
                <div className="studio-logo-wrapper">
                  <Image
                    src={studio.logoPath}
                    alt={studio.name}
                    width={116}
                    height={116}
                    className="studio-logo-img"
                  />
                </div>
                <span className="studio-card-name">{studio.name}</span>
              </Link>
              {isAdminActive && (
                <button
                  className="delete-studio-btn"
                  disabled={deletingId === studio.id}
                  onClick={() => handleDelete(studio.id, studio.name)}
                  title={`Delete ${studio.name}`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
