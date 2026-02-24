"use client";

import { deleteSeriesAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteSeriesButtonProps {
  seriesId: string;
}

export default function DeleteSeriesButton({ seriesId }: DeleteSeriesButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this series card?")) return;
    setLoading(true);
    await deleteSeriesAction(seriesId);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="delete-series-btn"
      title="Delete"
    >
      {loading ? "..." : "✕"}
    </button>
  );
}
