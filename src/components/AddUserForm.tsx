import { type FormEvent, useState } from "react";
import { useCreateUser } from "../api/users";

const initial = { name: "", email: "", role: "member" as const };

export function AddUserForm() {
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [role, setRole] = useState<"admin" | "member">(initial.role);
  const { mutateAsync, isPending, error, reset } = useCreateUser();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    reset();
    await mutateAsync({ name, email, role });
    setName(initial.name);
    setEmail(initial.email);
    setRole(initial.role);
  }

  return (
    <form
      onSubmit={(e) => {
        void onSubmit(e);
      }}
      className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      aria-label="Add user"
    >
      <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Add user</h2>
      <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
        <div className="sm:col-span-1">
          <label
            htmlFor="user-name"
            className="mb-1 block text-xs text-gray-600 dark:text-gray-400"
          >
            Name
          </label>
          <input
            id="user-name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="sm:col-span-1">
          <label
            htmlFor="user-email"
            className="mb-1 block text-xs text-gray-600 dark:text-gray-400"
          >
            Email
          </label>
          <input
            id="user-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="user-role"
            className="mb-1 block text-xs text-gray-600 dark:text-gray-400"
          >
            Role
          </label>
          <select
            id="user-role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "member")}
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option value="member">member</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
          >
            {isPending ? "Adding…" : "Add user"}
          </button>
        </div>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error instanceof Error ? error.message : "Something went wrong."}
        </p>
      ) : null}
    </form>
  );
}
