import { useUsers } from "../api/users";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { UserCard } from "../components/UserCard";

export function UsersPage() {
  const { data, isPending, isError, error } = useUsers();

  if (isPending) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div role="alert" className="p-4 text-red-600 dark:text-red-400">
        Error loading users: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="p-4 text-gray-500">No users found.</p>;
  }

  return (
    <ul className="space-y-3">
      {data.map((user) => (
        <li key={user.id}>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  );
}
