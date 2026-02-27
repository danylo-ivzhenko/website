"use client";

import { deleteSeriesAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

interface DeleteSeriesButtonProps {
  seriesId: string;
}

export default function DeleteSeriesButton({ seriesId }: DeleteSeriesButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    await deleteSeriesAction(seriesId);
    router.refresh();
    setLoading(false);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="delete-series-btn"
        title="Delete"
      >
        ✕
      </button>

      <ConfirmModal
        open={showModal}
        title="Delete Series Card"
        message="Are you sure you want to delete this card? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
        loading={loading}
      />
    </>
  );
}
