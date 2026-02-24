"use client";

import { useState } from "react";
import { changeUserRoleAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface UserRow {
  id: string;
  email: string | null;
  login: string;
  status: string;
}

interface UsersClientProps {
  users: UserRow[];
  currentUserId: string;
}

export default function UsersClient({ users, currentUserId }: UsersClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setError(null);
    setLoading(userId);

    const result = await changeUserRoleAction(userId, newRole);

    if (!result.success) {
      setError(result.error || "Failed to change role");
    }

    setLoading(null);
    router.refresh();
  };

  return (
    <div className="users-table-wrapper">
      {error && <p className="form-error">{error}</p>}

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Login</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            return (
              <tr key={user.id} className={isSelf ? "users-row-self" : ""}>
                <td className="users-id-cell" title={user.id}>
                  {user.id.slice(0, 8)}…
                </td>
                <td>{user.email || "—"}</td>
                <td>{user.login}</td>
                <td>
                  {isSelf ? (
                    <span className="users-role-badge users-role-superadmin">
                      {user.status}
                    </span>
                  ) : (
                    <select
                      className="users-role-select"
                      value={user.status}
                      disabled={loading === user.id}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="SUPERADMIN">SUPERADMIN</option>
                    </select>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
