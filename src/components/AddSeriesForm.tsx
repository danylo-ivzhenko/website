"use client";

import { useState, useRef } from "react";
import { addSeriesAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface AddSeriesFormProps {
  studioId: string;
  isAdminActive: boolean;
}

export default function AddSeriesForm({
  studioId,
  isAdminActive,
}: AddSeriesFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (!isAdminActive) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("studioId", studioId);
    files.forEach((file) => formData.append("images", file));

    const result = await addSeriesAction(formData);

    if (!result.success) {
      setError(result.error || "Upload failed");
    } else {
      setSuccess(`Successfully uploaded ${result.count} images`);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="add-series-section">
      <form onSubmit={handleSubmit} className="add-series-form">
        <label className="series-upload-label">
          <div className="series-upload-zone">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17,8 12,3 7,8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>
              {files.length > 0
                ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                : "Click or drag to upload series images"}
            </span>
          </div>
          <input
            ref={inputRef}
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden-input"
          />
        </label>

        <button
          type="submit"
          className="add-series-submit"
          disabled={loading || files.length === 0}
        >
          {loading ? "Uploading..." : "Upload Series"}
        </button>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}
      </form>
    </div>
  );
}
