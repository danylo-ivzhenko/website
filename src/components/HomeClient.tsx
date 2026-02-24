"use client";

import { useState } from "react";
import StudioGrid from "@/components/StudioGrid";
import AddStudioForm from "@/components/AddStudioForm";

interface Studio {
  id: string;
  name: string;
  logoPath: string;
}

interface HomeClientProps {
  studios: Studio[];
  role: string | null;
}

const MAX_STUDIOS = 18;

export default function HomeClient({ studios, role }: HomeClientProps) {
  const [adminActive, setAdminActive] = useState(false);
  const isSuperAdmin = role === "SUPERADMIN";

  return (
    <>
      <StudioGrid studios={studios} isAdminActive={adminActive && isSuperAdmin} />

      <AddStudioForm
        isAdminActive={adminActive && isSuperAdmin}
        currentCount={studios.length}
        maxStudios={MAX_STUDIOS}
      />

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
