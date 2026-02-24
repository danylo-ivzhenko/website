"use client";

import { useState } from "react";
import Image from "next/image";
import AddSeriesForm from "@/components/AddSeriesForm";
import DeleteSeriesButton from "@/components/DeleteSeriesButton";

interface SeriesItem {
  id: string;
  imagePath: string;
  authorId: string;
  author: { id: string; login: string };
}

interface StudioClientProps {
  studio: {
    id: string;
    name: string;
    logoPath: string;
    series: SeriesItem[];
  };
  role: string | null;
  userId: string | null;
}

export default function StudioClient({
  studio,
  role,
  userId,
}: StudioClientProps) {
  const [adminActive, setAdminActive] = useState(false);
  const isSuperAdmin = role === "SUPERADMIN";
  const isEditor = role === "EDITOR";
  const canManage = isSuperAdmin || isEditor;

  return (
    <>
      <AddSeriesForm
        studioId={studio.id}
        isAdminActive={adminActive && canManage}
      />

      <div className="series-gallery">
        {studio.series.map((s) => {
          const canDelete =
            adminActive &&
            (isSuperAdmin || (isEditor && s.authorId === userId));

          return (
            <div key={s.id} className="series-card">
              <div className="series-image-wrapper">
                <Image
                  src={s.imagePath}
                  alt="Series"
                  width={740}
                  height={0}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                    maxWidth: "740px",
                  }}
                  sizes="(max-width: 768px) 100vw, 740px"
                />
              </div>
              {canDelete && (
                <DeleteSeriesButton seriesId={s.id} />
              )}
              {adminActive && isSuperAdmin && (
                <span className="series-author-tag">by {s.author.login}</span>
              )}
            </div>
          );
        })}
      </div>

      {isSuperAdmin && (
        <button
          className={`admin-toggle-btn ${adminActive ? "active" : ""}`}
          onClick={() => setAdminActive(!adminActive)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
          </svg>
          Admin Panel
        </button>
      )}
    </>
  );
}
