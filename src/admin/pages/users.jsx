import { useState } from "react";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";

import {
  useAdminUsers,
  useToggleUserBlock,
} from "../hooks/useAdminUsers";

function Users() {
  const { data: users = [], isLoading, isError } = useAdminUsers();

  const toggleUserBlock = useToggleUserBlock();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 5;

  // Block or unblock a user
  const handleToggleBlock = (user) => {
    toggleUserBlock.mutate({
      id: user.id,
      isBlocked: !user.isBlocked,
    });
  };

  // Search users by name or email
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "status",
      label: "Status",
      render: (user) => (
        <StatusBadge
          status={user.isBlocked ? "Blocked" : "Active"}
        />
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (user) => (
        <button
          onClick={() => handleToggleBlock(user)}
          disabled={toggleUserBlock.isPending}
          className={`rounded-lg px-4 py-2 text-xs font-medium disabled:opacity-50 ${
            user.isBlocked
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {user.isBlocked ? "Unblock" : "Block"}
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <p className="text-white">Loading users...</p>;
  }

  if (isError) {
    return <p className="text-red-400">Failed to fetch users.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="View and manage registered customers."
      />

      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        placeholder="Search by name or email..."
      />

      <DataTable columns={columns} data={currentUsers} />

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default Users;
