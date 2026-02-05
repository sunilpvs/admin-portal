import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";

function UserTable({
  users,
  deleteUser,
  currentPage,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "first_name",
    direction: "asc",
  });

  // 🔍 Search
  const filteredUsers = users.filter((u) =>
    [
      u.first_name,
      u.last_name,
      u.email,
      u.username,
      u.role_name,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 🔃 Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    const valA = a[key]?.toString().toLowerCase() || "";
    const valB = b[key]?.toString().toLowerCase() || "";
    if (valA < valB) return -1 * dir;
    if (valA > valB) return 1 * dir;
    return 0;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  // ↕ Sorting handler
  const handleSort = (column) => {
    setSortConfig((prev) => ({
      key: column,
      direction:
        prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortArrow = (column) =>
    sortConfig.key === column
      ? sortConfig.direction === "asc"
        ? "▲"
        : "▼"
      : "";

  return (
    <Box m="20px">
      <Header title="User Management" subtitle="Admin / Users" />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">

        {/* Search + Limit */}
        <div className="d-flex justify-content-between mb-3 flex-wrap">
          <input
            type="text"
            className="form-control mb-2"
            style={{ maxWidth: "300px" }}
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />

          <select
            className="form-select mb-2"
            style={{ width: "200px" }}
            value={itemsPerPage}
            onChange={(e) => {
              onLimitChange(Number(e.target.value));
              onPageChange(1);
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Sr</th>
                <th
                  onClick={() => handleSort("first_name")}
                  style={{ cursor: "pointer" }}
                >
                  First Name {getSortArrow("first_name")}
                </th>
                <th
                  onClick={() => handleSort("last_name")}
                  style={{ cursor: "pointer" }}
                >
                  Last Name {getSortArrow("last_name")}
                </th>
                <th>Email</th>
                <th>User Name</th>
                <th
                  onClick={() => handleSort("role_name")}
                  style={{ cursor: "pointer" }}
                >
                  Role {getSortArrow("role_name")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u, i) => (
                  <tr key={u.id}>
                    <td>{startIndex + i + 1}</td>
                    <td>{u.first_name}</td>
                    <td>{u.last_name}</td>
                    <td>{u.email}</td>
                    <td>{u.username}</td>
                    <td>{u.role_name}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteUser(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between mt-3">
          <span>
            Showing {paginatedUsers.length} of {sortedUsers.length}
          </span>
          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm me-1 ${
                  currentPage === i + 1
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
}

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  deleteUser: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default UserTable;
