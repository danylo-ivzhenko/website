"use client";

import { useState, useRef } from "react";
import { createStudioAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface AddStudioFormProps {
  isAdminActive: boolean;
  currentCount: number;
  maxStudios: number;
}

export default function AddStudioForm({
  isAdminActive,
  currentCount,
  maxStudios,
}: AddStudioFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  if (!isAdminActive) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (currentCount >= maxStudios) {
      setError(`Maximum of ${maxStudios} studios reached!`);
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const result = await createStudioAction(formData);

    if (!result.success) {
      setError(result.error || "Failed to create studio");
    } else {
      formRef.current?.reset();
      setPreview(null);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="add-studio-section">
      <form ref={formRef} onSubmit={handleSubmit} className="add-studio-form">
        <div className="add-studio-logo-upload">
          <label className="logo-upload-label">
            {preview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={preview} alt="Preview" className="logo-preview" />
            ) : (
              <div className="logo-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Logo</span>
              </div>
            )}
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden-input"
              required
            />
          </label>
        </div>

        <input
          name="name"
          type="text"
          placeholder="Studio Name"
          required
          className="add-studio-name-input"
        />

        <button type="submit" className="add-studio-submit" disabled={loading}>
          {loading ? "Creating..." : "Add Studio"}
        </button>

        {error && <p className="add-studio-error">{error}</p>}
      </form>
    </div>
  );
}
