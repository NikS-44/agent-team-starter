import { type FormEvent, useEffect, useState } from "react";
import { type User, useDeleteUser, useUpdateUser } from "../api/users";

interface UserCardProps {
  user: User;
}

function UserCardEditForm({ user, onClose }: { user: User; onClose: () => void }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<"admin" | "member">(user.role);
  const updateUser = useUpdateUser();

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  }, [user]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    updateUser.reset();
    try {
      await updateUser.mutateAsync({
        id: user.id,
        body: { name, email, role },
      });
      onClose();
    } catch {
      // error shown via updateUser.error
    }
  }

  function onCancel() {
    updateUser.reset();
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    onClose();
  }

  return (
    <form
      onSubmit={(e) => {
        void onSave(e);
      }}
      className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      aria-label={`Edit user ${user.name}`}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`edit-name-${user.id}`}
            className="mb-0.5 block text-xs text-gray-600 dark:text-gray-400"
          >
            Name
          </label>
          <input
            id={`edit-name-${user.id}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor={`edit-email-${user.id}`}
            className="mb-0.5 block text-xs text-gray-600 dark:text-gray-400"
          >
            Email
          </label>
          <input
            id={`edit-email-${user.id}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor={`edit-role-${user.id}`}
            className="mb-0.5 block text-xs text-gray-600 dark:text-gray-400"
          >
            Role
          </label>
          <select
            id={`edit-role-${user.id}`}
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "member")}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option value="member">member</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>
      {updateUser.error ? (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {updateUser.error instanceof Error ? updateUser.error.message : "Update failed."}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={updateUser.isPending}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {updateUser.isPending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function UserCard({ user }: UserCardProps) {
  const [editing, setEditing] = useState(false);
  const deleteUser = useDeleteUser();

  function onDelete() {
    if (!globalThis.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    deleteUser.reset();
    void deleteUser.mutateAsync(user.id);
  }

  if (editing) {
    return <UserCardEditForm user={user} onClose={() => setEditing(false)} />;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            data-testid="user-role"
            className={
              user.role === "admin"
                ? "rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                : "rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }
          >
            {user.role}
          </span>
          <a
            href={`/users/${encodeURIComponent(user.id)}/payment-methods`}
            className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            OTU cards
          </a>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete()}
            disabled={deleteUser.isPending}
            className="rounded border border-red-300 px-2 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
          >
            {deleteUser.isPending ? "…" : "Delete"}
          </button>
        </div>
      </div>
      {deleteUser.error ? (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {deleteUser.error instanceof Error ? deleteUser.error.message : "Delete failed."}
        </p>
      ) : null}
    </div>
  );
}
